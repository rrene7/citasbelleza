CREATE DATABASE IF NOT EXISTS citasbelleza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE citasbelleza;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','salon') NOT NULL DEFAULT 'salon',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS salones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL,
  nombre VARCHAR(180) NOT NULL,
  descripcion TEXT NULL,
  direccion VARCHAR(255) NULL,
  telefono VARCHAR(50) NULL,
  imagen VARCHAR(500) NULL,
  horario_apertura TIME NOT NULL DEFAULT '09:00:00',
  horario_cierre TIME NOT NULL DEFAULT '20:00:00',
  calificacion DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_salones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salon_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  duracion_minutos INT NOT NULL DEFAULT 30,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_servicios_salon FOREIGN KEY (salon_id) REFERENCES salones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS trabajadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salon_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  especialidad VARCHAR(150) NULL,
  imagen VARCHAR(500) NULL,
  calificacion DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  experiencia VARCHAR(150) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trabajadores_salon FOREIGN KEY (salon_id) REFERENCES salones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS disponibilidad_trabajador (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trabajador_id INT NOT NULL,
  dia_semana ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
  CONSTRAINT fk_disponibilidad_trabajador FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_nombre VARCHAR(150) NOT NULL,
  cliente_email VARCHAR(190) NOT NULL,
  cliente_telefono VARCHAR(50) NULL,
  salon_id INT NOT NULL,
  trabajador_id INT NOT NULL,
  servicio_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('pendiente','confirmada','completada','cancelada') NOT NULL DEFAULT 'pendiente',
  notas TEXT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_citas_salon FOREIGN KEY (salon_id) REFERENCES salones(id) ON DELETE CASCADE,
  CONSTRAINT fk_citas_trabajador FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id) ON DELETE CASCADE,
  CONSTRAINT fk_citas_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE,
  INDEX idx_citas_trabajador_fecha (trabajador_id, fecha, hora)
) ENGINE=InnoDB;

INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES ('Administrador', 'admin@citasbelleza.local', '$2y$10$example.hash.reemplazar', 'admin')
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO salones (nombre, descripcion, direccion, telefono, imagen, calificacion)
VALUES
('Elegance Beauty Studio', 'Salon premium especializado en tratamientos capilares y colorimetria.', 'Ciudad de Panama', '+507 6000-0000', '', 4.8),
('Nails & Beauty Lounge', 'Especialistas en manicure, pedicure y nail art.', 'La Chorrera, Panama Oeste', '+507 6000-0001', '', 4.6);

INSERT INTO servicios (salon_id, nombre, descripcion, duracion_minutos, precio)
VALUES
(1, 'Corte de cabello', 'Corte personalizado', 45, 25.00),
(1, 'Coloracion', 'Coloracion completa', 120, 80.00),
(2, 'Manicure', 'Cuidado completo de manos', 45, 30.00),
(2, 'Pedicure', 'Cuidado completo de pies', 60, 40.00);

INSERT INTO trabajadores (salon_id, nombre, especialidad, calificacion, experiencia)
VALUES
(1, 'Maria Gonzalez', 'Colorista profesional', 4.9, '8 anos de experiencia'),
(1, 'Carlos Ruiz', 'Estilista de corte', 4.8, '6 anos de experiencia'),
(2, 'Valentina Torres', 'Nail artist', 4.7, '4 anos de experiencia');

INSERT INTO disponibilidad_trabajador (trabajador_id, dia_semana)
VALUES
(1,'lunes'),(1,'martes'),(1,'miercoles'),(1,'jueves'),(1,'viernes'),
(2,'martes'),(2,'miercoles'),(2,'jueves'),(2,'viernes'),(2,'sabado'),
(3,'lunes'),(3,'martes'),(3,'miercoles'),(3,'jueves'),(3,'viernes');
