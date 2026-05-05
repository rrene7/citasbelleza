<?php
require_once __DIR__ . '/../../config.php';
require_salon();

$data = json_decode(file_get_contents('php://input'), true);

$nombre = trim($data['nombre'] ?? '');
$precio = (float)($data['precio'] ?? 0);

if (!$nombre) {
    echo json_encode(['error'=>'Nombre requerido']); exit;
}

$user = current_user();
$salonId = (int)$user['salon_id'];

$stmt = $pdo->prepare("INSERT INTO servicios (nombre, precio, salon_id) VALUES (?, ?, ?)");
$stmt->execute([$nombre, $precio, $salonId]);

echo json_encode(['ok'=>true]);
