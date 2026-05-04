<?php
require_once __DIR__ . '/../config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$required = ['cliente_nombre','cliente_email','salon_id','trabajador_id','servicio_id','fecha','hora'];

foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(['error' => 'Falta campo: ' . $field]);
        exit;
    }
}

// Verificar disponibilidad
$stmt = $pdo->prepare("SELECT id FROM citas WHERE trabajador_id = ? AND fecha = ? AND hora = ? AND estado IN ('pendiente','confirmada')");
$stmt->execute([$data['trabajador_id'], $data['fecha'], $data['hora']]);

if ($stmt->fetch()) {
    echo json_encode(['error' => 'Horario no disponible']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO citas (cliente_nombre, cliente_email, cliente_telefono, salon_id, trabajador_id, servicio_id, fecha, hora, notas)
VALUES (?,?,?,?,?,?,?,?,?)");

$stmt->execute([
    $data['cliente_nombre'],
    $data['cliente_email'],
    $data['cliente_telefono'] ?? null,
    $data['salon_id'],
    $data['trabajador_id'],
    $data['servicio_id'],
    $data['fecha'],
    $data['hora'],
    $data['notas'] ?? null
]);

echo json_encode(['ok' => true]);
