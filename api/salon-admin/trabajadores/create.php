<?php
require_once __DIR__ . '/../../config.php';
require_salon();

$data = json_decode(file_get_contents('php://input'), true);

$nombre = trim($data['nombre'] ?? '');
$especialidad = trim($data['especialidad'] ?? '');
$experiencia = trim($data['experiencia'] ?? '');

if (!$nombre) {
    echo json_encode(['error'=>'Nombre requerido']); exit;
}

$user = current_user();
$salonId = (int)$user['salon_id'];

$stmt = $pdo->prepare("INSERT INTO trabajadores (nombre, especialidad, experiencia, salon_id, activo) VALUES (?, ?, ?, ?, 1)");
$stmt->execute([$nombre, $especialidad, $experiencia, $salonId]);

echo json_encode(['ok'=>true]);
