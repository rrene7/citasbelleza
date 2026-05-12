<?php
require_once __DIR__ . '/../config.php';
require_salon();

$user = current_user();
$salonId = (int)$user['salon_id'];

if (empty($_FILES['foto'])) {
    echo json_encode(['error' => 'Foto requerida']);
    exit;
}

$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$mime = mime_content_type($_FILES['foto']['tmp_name']);

if (!isset($allowed[$mime])) {
    echo json_encode(['error' => 'Formato no permitido']);
    exit;
}

$dir = __DIR__ . '/../../uploads/salones';
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}

$filename = 'salon_' . $salonId . '_' . time() . '.' . $allowed[$mime];
$path = $dir . '/' . $filename;

if (!move_uploaded_file($_FILES['foto']['tmp_name'], $path)) {
    echo json_encode(['error' => 'No se pudo subir la foto']);
    exit;
}

$publicPath = 'uploads/salones/' . $filename;
$stmt = $pdo->prepare("UPDATE salones SET imagen = ? WHERE id = ?");
$stmt->execute([$publicPath, $salonId]);

echo json_encode(['ok' => true, 'ruta' => $publicPath]);
