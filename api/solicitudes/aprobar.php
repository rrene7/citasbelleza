<?php
require_once __DIR__ . '/../config.php';
require_login();

$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? 0);

$stmt = $pdo->prepare("SELECT * FROM solicitudes_salon WHERE id = ?");
$stmt->execute([$id]);
$sol = $stmt->fetch();

if (!$sol) {
    echo json_encode(['error'=>'No encontrada']); exit;
}

// crear salon
$stmt = $pdo->prepare("INSERT INTO salones (nombre, descripcion, direccion, telefono, horario_apertura, horario_cierre, activo) VALUES (?,?,?,?, '09:00','20:00',1)");
$stmt->execute([
    $sol['nombre_salon'],
    $sol['descripcion'],
    $sol['direccion'],
    $sol['telefono']
]);

// actualizar solicitud
$pdo->prepare("UPDATE solicitudes_salon SET estado='aprobada', revisado_en=NOW() WHERE id=?")->execute([$id]);

echo json_encode(['ok'=>true]);
