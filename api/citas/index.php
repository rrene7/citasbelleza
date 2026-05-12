<?php
require_once __DIR__ . '/../config.php';

$email = isset($_GET['email']) ? trim($_GET['email']) : '';

$sql = "SELECT c.*, s.nombre AS salon_nombre, t.nombre AS trabajador_nombre, sv.nombre AS servicio_nombre, sv.precio
        FROM citas c
        INNER JOIN salones s ON s.id = c.salon_id
        INNER JOIN trabajadores t ON t.id = c.trabajador_id
        INNER JOIN servicios sv ON sv.id = c.servicio_id";

if ($email !== '') {
    $stmt = $pdo->prepare($sql . " WHERE c.cliente_email = ? ORDER BY c.fecha DESC, c.hora DESC");
    $stmt->execute([$email]);
} else {
    $stmt = $pdo->query($sql . " ORDER BY c.fecha DESC, c.hora DESC");
}

echo json_encode($stmt->fetchAll());
