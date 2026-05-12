<?php
require_once __DIR__ . '/../config.php';
require_login();

$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? 0);

$pdo->prepare("UPDATE solicitudes_salon SET estado='rechazada', revisado_en=NOW() WHERE id=?")->execute([$id]);

echo json_encode(['ok'=>true]);
