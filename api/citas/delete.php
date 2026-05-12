<?php
require_once __DIR__ . '/../config.php';
require_login();

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? (int) $data['id'] : 0;

if ($id <= 0) {
    echo json_encode(['error' => 'ID invalido']);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM citas WHERE id = ?");
$stmt->execute([$id]);

echo json_encode(['ok' => true]);
