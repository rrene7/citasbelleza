<?php
require_once __DIR__ . '/../config.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['error' => 'Email y password requeridos']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, nombre, email, password_hash, rol, salon_id FROM usuarios WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit;
}

$passwordOk = false;
if (!empty($user['password_hash'])) {
    $passwordOk = password_verify($password, $user['password_hash']) || $password === $user['password_hash'];
}

if (!$passwordOk) {
    echo json_encode(['error' => 'Password incorrecto']);
    exit;
}

$_SESSION['usuario'] = [
    'id' => (int) $user['id'],
    'nombre' => $user['nombre'],
    'email' => $user['email'],
    'rol' => $user['rol'],
    'salon_id' => $user['salon_id'] ? (int) $user['salon_id'] : null
];

echo json_encode([
    'ok' => true,
    'usuario' => $_SESSION['usuario']
]);
