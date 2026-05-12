<?php
require_once __DIR__ . '/../../config.php';
require_salon();

$user = current_user();
$salonId = (int)$user['salon_id'];
$trabajadorId = (int)($_POST['trabajador_id'] ?? 0);

if ($trabajadorId <= 0 || empty($_FILES['foto'])) {
    echo json_encode(['error' => 'Trabajador y foto requeridos']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM trabajadores WHERE id = ? AND salon_id = ? LIMIT 1');
$stmt->execute([$trabajadorId, $salonId]);
if (!$stmt->fetch()) {
    echo json_encode(['error' => 'Trabajador no pertenece a este salon']);
    exit;
}

$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$mime = mime_content_type($_FILES['foto']['tmp_name']);

if (!isset($allowed[$mime])) {
    echo json_encode(['error' => 'Formato no permitido']);
    exit;
}

$dir = __DIR__ . '/../../../uploads/trabajadores';
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}

$filename = 'trabajador_' . $trabajadorId . '_' . time() . '.' . $allowed[$mime];
$path = $dir . '/' . $filename;

if (!move_uploaded_file($_FILES['foto']['tmp_name'], $path)) {
    echo json_encode(['error' => 'No se pudo subir la foto']);
    exit;
}

$publicPath = 'uploads/trabajadores/' . $filename;
$stmt = $pdo->prepare('UPDATE trabajadores SET imagen = ? WHERE id = ? AND salon_id = ?');
$stmt->execute([$publicPath, $trabajadorId, $salonId]);

echo json_encode(['ok' => true, 'ruta' => $publicPath]);
