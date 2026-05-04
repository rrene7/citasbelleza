<?php
require_once __DIR__ . '/../config.php';

$stmt = $pdo->query("SELECT * FROM salones WHERE activo = 1 ORDER BY id DESC");
$salones = $stmt->fetchAll();

echo json_encode($salones);
