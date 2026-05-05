<?php
require_once __DIR__ . '/../../config.php';
require_salon();

$user = current_user();
$salonId = (int)$user['salon_id'];

$stmt = $pdo->prepare("SELECT * FROM servicios WHERE salon_id = ? ORDER BY nombre ASC");
$stmt->execute([$salonId]);

echo json_encode($stmt->fetchAll());
