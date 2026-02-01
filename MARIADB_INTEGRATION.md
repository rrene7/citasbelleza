# Integración con MariaDB - Sistema de Gestión de Salones de Belleza

## Estructura de Base de Datos MariaDB

### Tablas Necesarias

```sql
-- Tabla de Salones
CREATE TABLE salones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(500),
    telefono VARCHAR(50),
    imagen VARCHAR(500),
    horario_apertura TIME,
    horario_cierre TIME,
    calificacion DECIMAL(2,1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Servicios del Salón
CREATE TABLE salon_servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT,
    servicio VARCHAR(100),
    FOREIGN KEY (salon_id) REFERENCES salones(id) ON DELETE CASCADE
);

-- Tabla de Trabajadores
CREATE TABLE trabajadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT,
    nombre VARCHAR(255) NOT NULL,
    especialidad VARCHAR(255),
    imagen VARCHAR(500),
    calificacion DECIMAL(2,1) DEFAULT 0,
    experiencia VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (salon_id) REFERENCES salones(id) ON DELETE CASCADE
);

-- Tabla de Disponibilidad de Trabajadores
CREATE TABLE trabajador_disponibilidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trabajador_id INT,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
    FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id) ON DELETE CASCADE
);

-- Tabla de Servicios
CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion INT, -- en minutos
    precio DECIMAL(10,2)
);

-- Tabla de Citas
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(50),
    salon_id INT,
    trabajador_id INT,
    servicio_id INT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (salon_id) REFERENCES salones(id),
    FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    INDEX idx_fecha_trabajador (fecha, trabajador_id)
);

-- Tabla de Reseñas
CREATE TABLE resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT,
    trabajador_id INT NULL,
    cliente_nombre VARCHAR(255),
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha DATE,
    FOREIGN KEY (salon_id) REFERENCES salones(id) ON DELETE CASCADE,
    FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id) ON DELETE SET NULL
);
```

## Endpoints de API REST (Backend)

### Salones

```
GET    /api/salones                 - Listar todos los salones
GET    /api/salones/:id            - Obtener un salón específico
POST   /api/salones                - Crear nuevo salón
PUT    /api/salones/:id            - Actualizar salón
DELETE /api/salones/:id            - Eliminar salón
GET    /api/salones/search?q=      - Buscar salones
```

### Trabajadores

```
GET    /api/trabajadores                       - Listar todos los trabajadores
GET    /api/trabajadores/:id                  - Obtener trabajador específico
GET    /api/salones/:salonId/trabajadores    - Trabajadores por salón
POST   /api/trabajadores                      - Crear nuevo trabajador
PUT    /api/trabajadores/:id                  - Actualizar trabajador
DELETE /api/trabajadores/:id                  - Eliminar trabajador
```

### Servicios

```
GET    /api/servicios              - Listar todos los servicios
GET    /api/servicios/:id         - Obtener servicio específico
POST   /api/servicios             - Crear nuevo servicio
PUT    /api/servicios/:id         - Actualizar servicio
DELETE /api/servicios/:id         - Eliminar servicio
```

### Citas

```
GET    /api/citas                              - Listar todas las citas
GET    /api/citas/:id                         - Obtener cita específica
GET    /api/citas/cliente/:email              - Citas por email de cliente
GET    /api/citas/trabajador/:id/fecha/:fecha - Citas de trabajador en fecha
POST   /api/citas                             - Crear nueva cita
PUT    /api/citas/:id                         - Actualizar cita
DELETE /api/citas/:id                         - Cancelar cita
GET    /api/disponibilidad/:trabajadorId/:fecha - Horarios disponibles
```

### Reseñas

```
GET    /api/resenas/salon/:salonId       - Reseñas de un salón
POST   /api/resenas                      - Crear nueva reseña
```

## Ejemplo de Implementación Backend (Node.js + Express)

### 1. Configuración de Conexión

```javascript
// config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'beauty_salons',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### 2. Ejemplo de Controlador - Salones

```javascript
// controllers/salonesController.js
const pool = require('../config/database');

// Obtener todos los salones
exports.getAllSalones = async (req, res) => {
  try {
    const [salones] = await pool.query(`
      SELECT s.*, GROUP_CONCAT(ss.servicio) as servicios
      FROM salones s
      LEFT JOIN salon_servicios ss ON s.id = ss.salon_id
      GROUP BY s.id
    `);
    
    // Formatear servicios como array
    const formattedSalones = salones.map(salon => ({
      ...salon,
      servicios: salon.servicios ? salon.servicios.split(',') : []
    }));
    
    res.json(formattedSalones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener salón por ID
exports.getSalonById = async (req, res) => {
  try {
    const [salones] = await pool.query(
      'SELECT * FROM salones WHERE id = ?',
      [req.params.id]
    );
    
    if (salones.length === 0) {
      return res.status(404).json({ error: 'Salón no encontrado' });
    }
    
    const [servicios] = await pool.query(
      'SELECT servicio FROM salon_servicios WHERE salon_id = ?',
      [req.params.id]
    );
    
    res.json({
      ...salones[0],
      servicios: servicios.map(s => s.servicio)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo salón
exports.createSalon = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { nombre, descripcion, direccion, telefono, imagen, 
            horarioApertura, horarioCierre, servicios } = req.body;
    
    const [result] = await connection.query(
      `INSERT INTO salones (nombre, descripcion, direccion, telefono, 
       imagen, horario_apertura, horario_cierre) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, direccion, telefono, imagen, 
       horarioApertura, horarioCierre]
    );
    
    const salonId = result.insertId;
    
    // Insertar servicios
    if (servicios && servicios.length > 0) {
      const serviciosValues = servicios.map(s => [salonId, s]);
      await connection.query(
        'INSERT INTO salon_servicios (salon_id, servicio) VALUES ?',
        [serviciosValues]
      );
    }
    
    await connection.commit();
    res.status(201).json({ id: salonId, message: 'Salón creado exitosamente' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
```

### 3. Ejemplo de Controlador - Citas

```javascript
// controllers/citasController.js
const pool = require('../config/database');

// Crear nueva cita
exports.createCita = async (req, res) => {
  try {
    const { clienteNombre, clienteEmail, clienteTelefono, salonId,
            trabajadorId, servicioId, fecha, hora, notas } = req.body;
    
    // Verificar disponibilidad
    const [existentes] = await pool.query(
      `SELECT * FROM citas 
       WHERE trabajador_id = ? AND fecha = ? AND hora = ? 
       AND estado IN ('pendiente', 'confirmada')`,
      [trabajadorId, fecha, hora]
    );
    
    if (existentes.length > 0) {
      return res.status(400).json({ 
        error: 'El horario ya está ocupado' 
      });
    }
    
    const [result] = await pool.query(
      `INSERT INTO citas (cliente_nombre, cliente_email, cliente_telefono,
       salon_id, trabajador_id, servicio_id, fecha, hora, notas, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
      [clienteNombre, clienteEmail, clienteTelefono, salonId,
       trabajadorId, servicioId, fecha, hora, notas]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Cita agendada exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener horarios disponibles
exports.getHorariosDisponibles = async (req, res) => {
  try {
    const { trabajadorId, fecha } = req.params;
    
    const [citasExistentes] = await pool.query(
      `SELECT hora FROM citas 
       WHERE trabajador_id = ? AND fecha = ? 
       AND estado IN ('pendiente', 'confirmada')`,
      [trabajadorId, fecha]
    );
    
    const horasOcupadas = citasExistentes.map(c => c.hora);
    
    // Obtener horario del salón
    const [trabajador] = await pool.query(
      `SELECT s.horario_apertura, s.horario_cierre 
       FROM trabajadores t
       JOIN salones s ON t.salon_id = s.id
       WHERE t.id = ?`,
      [trabajadorId]
    );
    
    // Generar horarios disponibles (intervalos de 30 min)
    const horariosDisponibles = generarHorarios(
      trabajador[0].horario_apertura,
      trabajador[0].horario_cierre,
      horasOcupadas
    );
    
    res.json(horariosDisponibles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function generarHorarios(apertura, cierre, ocupados) {
  // Lógica para generar horarios
  // Similar a la implementada en mockData.ts
}
```

## Archivos Frontend que Necesitan Modificación

### 1. Crear un servicio API

```typescript
// src/services/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const api = {
  // Salones
  getSalones: async () => {
    const response = await fetch(`${API_BASE_URL}/salones`);
    return response.json();
  },
  
  getSalonById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/salones/${id}`);
    return response.json();
  },
  
  // Citas
  createCita: async (cita: any) => {
    const response = await fetch(`${API_BASE_URL}/citas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cita)
    });
    return response.json();
  },
  
  getCitasByEmail: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/citas/cliente/${email}`);
    return response.json();
  },
  
  // ... más métodos
};
```

### 2. Modificar componentes para usar la API

Reemplazar las importaciones de `mockData.ts` con llamadas a la API usando `useEffect` y estados.

## Variables de Entorno

```env
# .env (Backend)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=beauty_salons
PORT=3000

# .env (Frontend)
REACT_APP_API_URL=http://localhost:3000/api
```

## Instalación de Dependencias Backend

```bash
npm install express mysql2 dotenv cors
npm install --save-dev nodemon
```

## Ejecución

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (ya está listo)
# Solo necesita configurar la URL de la API
```

## Notas Importantes

1. **Seguridad**: Implementar validación de datos y sanitización en el backend
2. **Autenticación**: Considerar JWT para autenticación de usuarios
3. **Rate Limiting**: Implementar límites de peticiones
4. **CORS**: Configurar correctamente los orígenes permitidos
5. **Transacciones**: Usar transacciones para operaciones complejas
6. **Índices**: Crear índices en columnas frecuentemente consultadas
7. **Backup**: Implementar sistema de respaldos automáticos de la base de datos

## Sistema de Notificaciones (Opcional)

Para notificaciones por email al confirmar citas:

```javascript
// Usar nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.enviarConfirmacionCita = async (cita) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: cita.clienteEmail,
    subject: 'Confirmación de Cita - BeautyBook',
    html: `
      <h2>Tu cita ha sido confirmada</h2>
      <p>Fecha: ${cita.fecha}</p>
      <p>Hora: ${cita.hora}</p>
      <p>Salón: ${cita.salonNombre}</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};
```
