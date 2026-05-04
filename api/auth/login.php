<?php
require_once __DIR__ . '/../config.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['error' => 'Email y password requeridos']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, nombre, email FROM usuarios WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit;
}

// DEMO: sin hash (luego mejoramos)
$_SESSION['usuario'] = $user;

echo json_encode(['ok' => true, 'usuario' => $user]);
