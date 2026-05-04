<?php
require_once __DIR__ . '/../config.php';
require_login();

$stmt = $pdo->query("SELECT * FROM solicitudes_salon ORDER BY creado_en DESC");
$data = $stmt->fetchAll();

echo json_encode($data);
