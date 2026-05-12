<?php
require_once __DIR__ . '/../config.php';

if (!empty($_SESSION['usuario'])) {
    echo json_encode($_SESSION['usuario']);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
}
