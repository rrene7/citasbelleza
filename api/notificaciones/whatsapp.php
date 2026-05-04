<?php
require_once __DIR__ . '/../config.php';
require_login();

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

$telefono = preg_replace('/\D+/', '', $cita['cliente_telefono'] ?? '');
if ($telefono === '') {
    echo json_encode(['error' => 'La cita no tiene telefono']);
    exit;
}

if (strpos($telefono, '507') !== 0) {
    $telefono = '507' . $telefono;
}

$estadoTexto = $estado ?: $cita['estado'];
$mensaje = "Hola {$cita['cliente_nombre']}, tu cita en {$cita['salon_nombre']} para {$cita['servicio_nombre']} con {$cita['trabajador_nombre']} el {$cita['fecha']} a las " . substr($cita['hora'], 0, 5) . " esta {$estadoTexto}. Gracias por usar Citas Belleza Panama.";

$url = 'https://wa.me/' . $telefono . '?text=' . rawurlencode($mensaje);

echo json_encode([
    'ok' => true,
    'telefono' => $telefono,
    'mensaje' => $mensaje,
    'url' => $url
]);
