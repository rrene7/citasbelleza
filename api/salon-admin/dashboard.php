<?php
require_once __DIR__ . '/../config.php';
require_salon();

$user = current_user();
$salonId = (int)$user['salon_id'];

$stmt = $pdo->prepare("SELECT COUNT(*) total_citas FROM citas WHERE salon_id = ?");
$stmt->execute([$salonId]);
$totalCitas = (int)$stmt->fetch()['total_citas'];

$stmt = $pdo->prepare("SELECT COUNT(*) citas_hoy FROM citas WHERE salon_id = ? AND fecha = CURDATE()");
$stmt->execute([$salonId]);
$citasHoy = (int)$stmt->fetch()['citas_hoy'];

$stmt = $pdo->prepare("SELECT COUNT(DISTINCT cliente_email) clientes FROM citas WHERE salon_id = ?");
$stmt->execute([$salonId]);
$clientes = (int)$stmt->fetch()['clientes'];

$stmt = $pdo->prepare("SELECT COALESCE(SUM(sv.precio),0) ingresos FROM citas c INNER JOIN servicios sv ON sv.id = c.servicio_id WHERE c.salon_id = ? AND c.estado <> 'cancelada'");
$stmt->execute([$salonId]);
$ingresos = (float)$stmt->fetch()['ingresos'];

$stmt = $pdo->prepare("SELECT c.*, sv.nombre servicio_nombre, sv.precio, t.nombre trabajador_nombre FROM citas c LEFT JOIN servicios sv ON sv.id = c.servicio_id LEFT JOIN trabajadores t ON t.id = c.trabajador_id WHERE c.salon_id = ? ORDER BY c.fecha DESC, c.hora DESC LIMIT 10");
$stmt->execute([$salonId]);
$ultimasCitas = $stmt->fetchAll();

echo json_encode([
    'total_citas' => $totalCitas,
    'citas_hoy' => $citasHoy,
    'clientes' => $clientes,
    'ingresos' => $ingresos,
    'ultimas_citas' => $ultimasCitas
]);
