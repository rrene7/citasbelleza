<?php
require_once __DIR__ . '/../config.php';

$trabajadorId = isset($_GET['trabajador_id']) ? (int) $_GET['trabajador_id'] : 0;
$fecha = isset($_GET['fecha']) ? trim($_GET['fecha']) : '';

if ($trabajadorId <= 0 || $fecha === '') {
    echo json_encode(['error' => 'Debe enviar trabajador_id y fecha']);
    exit;
}

$stmt = $pdo->prepare("SELECT s.horario_apertura, s.horario_cierre
    FROM trabajadores t
    INNER JOIN salones s ON s.id = t.salon_id
    WHERE t.id = ? AND t.activo = 1 AND s.activo = 1");
$stmt->execute([$trabajadorId]);
$info = $stmt->fetch();

if (!$info) {
    echo json_encode(['error' => 'Trabajador no encontrado']);
    exit;
}

$stmt = $pdo->prepare("SELECT hora FROM citas WHERE trabajador_id = ? AND fecha = ? AND estado IN ('pendiente','confirmada')");
$stmt->execute([$trabajadorId, $fecha]);
$ocupadas = array_map(fn($row) => substr($row['hora'], 0, 5), $stmt->fetchAll());

$inicio = strtotime($fecha . ' ' . $info['horario_apertura']);
$fin = strtotime($fecha . ' ' . $info['horario_cierre']);
$horarios = [];

for ($t = $inicio; $t < $fin; $t += 30 * 60) {
    $hora = date('H:i', $t);
    if (!in_array($hora, $ocupadas, true)) {
        $horarios[] = $hora;
    }
}

echo json_encode($horarios);
