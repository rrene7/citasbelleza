<?php
require_once __DIR__ . '/../config.php';
require_login();

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? (int) $data['id'] : 0;
$estado = $data['estado'] ?? '';
$permitidos = ['pendiente', 'confirmada', 'completada', 'cancelada'];

if ($id <= 0 || !in_array($estado, $permitidos, true)) {
    echo json_encode(['error' => 'Datos invalidos']);
    exit;
}

$stmt = $pdo->prepare("UPDATE citas SET estado = ? WHERE id = ?");
$stmt->execute([$estado, $id]);

echo json_encode(['ok' => true]);
