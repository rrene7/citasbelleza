// Tipos de datos que corresponderán a las tablas de MariaDB

export interface Salon {
  id: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  imagen: string;
  horarioApertura: string;
  horarioCierre: string;
  calificacion: number;
  servicios: string[];
}

export interface Trabajador {
  id: number;
  salonId: number;
  nombre: string;
  especialidad: string;
  imagen: string;
  calificacion: number;
  experiencia: string;
  disponibilidad: string[];
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number; // en minutos
  precio: number;
}

export interface Cita {
  id: number;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  salonId: number;
  trabajadorId: number;
  servicioId: number;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
}

export interface HorarioDisponible {
  fecha: string;
  horas: string[];
}
