<?php
require_once __DIR__ . '/../config.php';
require_salon();

$user = current_user();
$salonId = (int)$user['salon_id'];
$data = json_decode(file_get_contents('php://input'), true);

$nombre = trim($data['nombre'] ?? '');
$descripcion = trim($data['descripcion'] ?? '');
$direccion = trim($data['direccion'] ?? '');
$telefono = trim($data['telefono'] ?? '');
$horarioApertura = trim($data['horario_apertura'] ?? '09:00');
$horarioCierre = trim($data['horario_cierre'] ?? '20:00');

if (!$nombre || !$direccion || !$telefono || !$horarioApertura || !$horarioCierre) {
    echo json_encode(['error' => 'Nombre, direccion, telefono y horario son obligatorios']);
    exit;
}

$stmt = $pdo->prepare("UPDATE salones SET nombre = ?, descripcion = ?, direccion = ?, telefono = ?, horario_apertura = ?, horario_cierre = ? WHERE id = ?");
$stmt->execute([$nombre, $descripcion, $direccion, $telefono, $horarioApertura, $horarioCierre, $salonId]);

echo json_encode(['ok' => true]);
