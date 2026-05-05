<?php
require_once __DIR__ . '/../config.php';
require_admin();

$stmt = $pdo->query("SELECT * FROM solicitudes_salon ORDER BY creado_en DESC");
echo json_encode($stmt->fetchAll());
