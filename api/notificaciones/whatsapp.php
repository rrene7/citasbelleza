<?php
require_once __DIR__ . '/../config.php';
require_login();

$configPath = __DIR__ . '/whatsapp_business_config.local.php';
$config = file_exists($configPath) ? require $configPath : require __DIR__ . '/whatsapp_business_config.php';

$data = json_decode(file_get_contents('php://input'), true);
$citaId = isset($data['cita_id']) ? (int) $data['cita_id'] : 0;
$estado = $data['estado'] ?? '';

if ($citaId <= 0) {
    echo json_encode(['error' => 'ID de cita invalido']);
    exit;
}

$stmt = $pdo->prepare("SELECT c.*, s.nombre AS salon_nombre, t.nombre AS trabajador_nombre, sv.nombre AS servicio_nombre
    FROM citas c
    INNER JOIN salones s ON s.id = c.salon_id
    INNER JOIN trabajadores t ON t.id = c.trabajador_id
    INNER JOIN servicios sv ON sv.id = c.servicio_id
    WHERE c.id = ? LIMIT 1");
$stmt->execute([$citaId]);
$cita = $stmt->fetch();

if (!$cita) {
    echo json_encode(['error' => 'Cita no encontrada']);
    exit;
}

$telefono = preg_replace('/\\D+/', '', $cita['cliente_telefono'] ?? '');
if ($telefono === '') {
    echo json_encode(['error' => 'Sin telefono']);
    exit;
}

if (strpos($telefono, '507') !== 0) {
    $telefono = '507' . $telefono;
}

$estadoTexto = $estado ?: $cita['estado'];
$mensaje = "Hola {$cita['cliente_nombre']}, tu cita en {$cita['salon_nombre']} para {$cita['servicio_nombre']} con {$cita['trabajador_nombre']} el {$cita['fecha']} a las " . substr($cita['hora'], 0, 5) . " esta {$estadoTexto}.";

// MODO PRO
if (!empty($config['enabled'])) {
    $url = "https://graph.facebook.com/{$config['graph_version']}/{$config['phone_number_id']}/messages";

    $payload = [
        'messaging_product' => 'whatsapp',
        'to' => $telefono,
        'type' => 'text',
        'text' => ['body' => $mensaje]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $config['access_token'],
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

    $response = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo json_encode([
        'ok' => $http >= 200 && $http < 300,
        'modo' => 'business',
        'response' => $response
    ]);
    exit;
}

// FALLBACK
$link = 'https://wa.me/' . $telefono . '?text=' . rawurlencode($mensaje);

echo json_encode([
    'ok' => true,
    'modo' => 'link',
    'url' => $link
]);
