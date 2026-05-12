<?php
require_once __DIR__ . '/../config.php';
require_login();

$user = current_user();
$salonId = $user['salon_id'] ?? null;

if (!$salonId) {
    echo json_encode(['error'=>'No tiene salon asignado']); exit;
}

$stmt = $pdo->prepare("SELECT * FROM salones WHERE id = ?");
$stmt->execute([$salonId]);
$salon = $stmt->fetch();

echo json_encode($salon);
