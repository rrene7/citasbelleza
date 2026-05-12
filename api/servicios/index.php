<?php
require_once __DIR__ . '/../config.php';

$salonId = isset($_GET['salon_id']) ? (int) $_GET['salon_id'] : 0;

if ($salonId > 0) {
    $stmt = $pdo->prepare("SELECT * FROM servicios WHERE activo = 1 AND salon_id = ? ORDER BY nombre ASC");
    $stmt->execute([$salonId]);
} else {
    $stmt = $pdo->query("SELECT * FROM servicios WHERE activo = 1 ORDER BY nombre ASC");
}

echo json_encode($stmt->fetchAll());
