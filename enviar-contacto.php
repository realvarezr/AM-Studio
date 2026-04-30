<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

$nombre   = trim(strip_tags($_POST['nombre']   ?? ''));
$email    = trim(strip_tags($_POST['email']    ?? ''));
$telefono = trim(strip_tags($_POST['telefono'] ?? ''));
$servicio = trim(strip_tags($_POST['servicio'] ?? ''));
$mensaje  = trim(strip_tags($_POST['mensaje']  ?? ''));

if (!$nombre || !$email || !$mensaje) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Pflichtfelder fehlen / Faltan campos obligatorios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Ungültige E-Mail / Correo inválido']);
    exit;
}

// ── SMTP IONOS (STARTTLS port 587) ──────────────────────────────
$host = 'smtp.ionos.de';
$port = 587;
$user = 'info@am-itsolutions.de';
$pass = 'RE!2025!';
$from = 'info@am-itsolutions.de';
$to   = 'info@am-itsolutions.de';

$subject = '=?UTF-8?B?' . base64_encode('Neue Anfrage – ' . $nombre) . '?=';

$body  = "Name:      $nombre\r\n";
$body .= "E-Mail:    $email\r\n";
$body .= "Telefon:   " . ($telefono ?: '–') . "\r\n";
$body .= "Dienst:    " . ($servicio ?: '–') . "\r\n\r\n";
$body .= "Nachricht:\r\n$mensaje\r\n";

// Conexión TCP plana — STARTTLS empieza sin cifrado
$sock = @fsockopen($host, $port, $errno, $errstr, 15);
if (!$sock) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Verbindung fehlgeschlagen / No se pudo conectar']);
    exit;
}

$r = function() use ($sock) { return fgets($sock, 512); };
$s = function($c) use ($sock) { fwrite($sock, $c . "\r\n"); };

$r(); // 220 greeting
$s('EHLO studio.am-itsolutions.de');
while (($l = $r()) && substr($l, 3, 1) === '-');

$s('STARTTLS');
$r(); // 220 Go ahead

// Actualizar stream a TLS
$tlsOk = stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
if (!$tlsOk) {
    fclose($sock);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'TLS-Upgrade fehlgeschlagen / Error al activar TLS']);
    exit;
}

$s('EHLO studio.am-itsolutions.de');
while (($l = $r()) && substr($l, 3, 1) === '-');

$s('AUTH LOGIN');
$r();
$s(base64_encode($user));
$r();
$s(base64_encode($pass));
$auth = $r();

if (substr($auth, 0, 3) !== '235') {
    $code = substr($auth, 0, 3);
    fclose($sock);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => "Authentifizierung fehlgeschlagen ($code) / Autenticación fallida ($code)"]);
    exit;
}

$s("MAIL FROM:<$from>");
$r();
$s("RCPT TO:<$to>");
$r();
$s('DATA');
$r();

$msg  = "From: AM Studio <$from>\r\n";
$msg .= "To: <$to>\r\n";
$msg .= "Reply-To: $nombre <$email>\r\n";
$msg .= "Subject: $subject\r\n";
$msg .= "MIME-Version: 1.0\r\n";
$msg .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
$msg .= $body . "\r\n.";

$s($msg);
$sent = $r();
$s('QUIT');
fclose($sock);

if (substr($sent, 0, 3) === '250') {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'E-Mail konnte nicht gesendet werden / No se pudo enviar el correo']);
}
