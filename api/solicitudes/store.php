<?php
require_once __DIR__ . '/../config.php';

$data = json_decode(file_get_contents('php://input'), true);

$nombre = $data['nombre_propietario'] ?? '';
$email = $data['email'] ?? '';
$telefono = $data['telefono'] ?? '';
$salon = $data['nombre_salon'] ?? '';
$direccion = $data['direccion'] ?? '';
$descripcion = $data['descripcion'] ?? '';

if (!$nombre || !$email || !$telefono || !$salon || !$direccion) {
    echo json_encode(['error' => 'Todos los campos obligatorios']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO solicitudes_salon 
(nombre_propietario, email, telefono, nombre_salon, direccion, descripcion) 
VALUES (?, ?, ?, ?, ?, ?)");

$stmt->execute([$nombre, $email, $telefono, $salon, $direccion, $descripcion]);

echo json_encode(['ok' => true]);
