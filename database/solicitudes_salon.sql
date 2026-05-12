USE citasbelleza;

CREATE TABLE IF NOT EXISTS solicitudes_salon (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_propietario VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  nombre_salon VARCHAR(180) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  descripcion TEXT NULL,
  estado ENUM('pendiente','aprobada','rechazada') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revisado_en TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_solicitudes_estado (estado),
  INDEX idx_solicitudes_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
