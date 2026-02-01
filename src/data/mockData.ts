import { Salon, Trabajador, Servicio, Cita } from '@/types';

// Datos simulados que representan lo que vendría de MariaDB
// En producción, estos datos se obtendrían mediante APIs REST conectadas a MariaDB

export const salones: Salon[] = [
  {
    id: 1,
    nombre: "Elegance Beauty Studio",
    descripcion: "Salón de belleza premium especializado en tratamientos capilares y colorimetría de alta gama.",
    direccion: "Av. Principal 123, Centro",
    telefono: "+1 555-0101",
    imagen: "https://images.unsplash.com/photo-1611211235015-e2e3a7d09e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWF1dHklMjBzYWxvbiUyMGludGVyaW9yfGVufDF8fHx8MTc2OTk1MDU0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    horarioApertura: "09:00",
    horarioCierre: "20:00",
    calificacion: 4.8,
    servicios: ["Corte", "Coloración", "Peinados", "Tratamientos"]
  },
  {
    id: 2,
    nombre: "Luxury Hair Salon",
    descripcion: "Expertos en transformaciones capilares y tendencias internacionales.",
    direccion: "Calle Comercial 456, Plaza Norte",
    telefono: "+1 555-0102",
    imagen: "https://images.unsplash.com/photo-1759134155377-4207d89b39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYWlyJTIwc2Fsb258ZW58MXx8fHwxNzY5OTU3NDUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    horarioApertura: "10:00",
    horarioCierre: "21:00",
    calificacion: 4.9,
    servicios: ["Corte Premium", "Balayage", "Keratina", "Extensiones"]
  },
  {
    id: 3,
    nombre: "Spa & Wellness Center",
    descripcion: "Centro integral de belleza y bienestar con tratamientos faciales y corporales.",
    direccion: "Boulevard Spa 789, Zona Exclusiva",
    telefono: "+1 555-0103",
    imagen: "https://images.unsplash.com/photo-1731514771613-991a02407132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjB3ZWxsbmVzcyUyMHNhbG9ufGVufDF8fHx8MTc2OTk1NzQ1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    horarioApertura: "08:00",
    horarioCierre: "22:00",
    calificacion: 4.7,
    servicios: ["Masajes", "Faciales", "Depilación", "Manicure"]
  },
  {
    id: 4,
    nombre: "Nails & Beauty Lounge",
    descripcion: "Especialistas en nail art y cuidado de manos y pies.",
    direccion: "Centro Comercial Elite, Local 45",
    telefono: "+1 555-0104",
    imagen: "https://images.unsplash.com/photo-1613457492120-4fcfbb7c3a5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWlsJTIwc2Fsb24lMjBtYW5pY3VyZXxlbnwxfHx8fDE3Njk4NzIxNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    horarioApertura: "09:00",
    horarioCierre: "19:00",
    calificacion: 4.6,
    servicios: ["Manicure", "Pedicure", "Uñas Acrílicas", "Nail Art"]
  }
];

export const trabajadores: Trabajador[] = [
  // Elegance Beauty Studio
  {
    id: 1,
    salonId: 1,
    nombre: "María González",
    especialidad: "Colorista Profesional",
    imagen: "https://images.unsplash.com/photo-1737063935340-f9af0940c4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYWlyc3R5bGlzdCUyMHdvbWFufGVufDF8fHx8MTc2OTg4MDc4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    calificacion: 4.9,
    experiencia: "8 años de experiencia",
    disponibilidad: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
  },
  {
    id: 2,
    salonId: 1,
    nombre: "Carlos Ruiz",
    especialidad: "Estilista de Corte",
    imagen: "https://images.unsplash.com/photo-1646825209987-6be8fe5f7403?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYWlyc3R5bGlzdCUyMG1hbnxlbnwxfHx8fDE3Njk5NTc0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    calificacion: 4.8,
    experiencia: "6 años de experiencia",
    disponibilidad: ["Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  },
  {
    id: 3,
    salonId: 1,
    nombre: "Ana Martínez",
    especialidad: "Especialista en Tratamientos",
    imagen: "https://images.unsplash.com/photo-1600637070413-0798fafbb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBhcnRpc3QlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5ODY4OTc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    calificacion: 4.7,
    experiencia: "5 años de experiencia",
    disponibilidad: ["Lunes", "Martes", "Miércoles", "Sábado", "Domingo"]
  },
  // Luxury Hair Salon
  {
    id: 4,
    salonId: 2,
    nombre: "Sofia López",
    especialidad: "Master en Balayage",
    imagen: "https://images.unsplash.com/photo-1737063935340-f9af0940c4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYWlyc3R5bGlzdCUyMHdvbWFufGVufDF8fHx8MTc2OTg4MDc4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    calificacion: 5.0,
    experiencia: "10 años de experiencia",
    disponibilidad: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
  },
  {
    id: 5,
    salonId: 2,
    nombre: "Diego Fernández",
    especialidad: "Estilista Celebrity",
    imagen: "https://images.unsplash.com/photo-1732314287829-f1da598a5b77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5OTU3NDUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    calificacion: 4.9,
    experiencia: "12 años de experiencia",
    disponibilidad: ["Miércoles", "Jueves", "Viernes", "Sábado"]
  },
  // Spa & Wellness Center
  {
    id: 6,
    salonId: 3,
    nombre: "Laura Sánchez",
    especialidad: "Terapeuta Facial",
    imagen: "https://images.unsplash.com/photo-1600637070413-0798fafbb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBhcnRpc3QlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5ODY4OTc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    calificacion: 4.8,
    experiencia: "7 años de experiencia",
    disponibilidad: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  },
  {
    id: 7,
    salonId: 3,
    nombre: "Roberto Díaz",
    especialidad: "Masajista Profesional",
    imagen: "https://images.unsplash.com/photo-1646825209987-6be8fe5f7403?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYWlyc3R5bGlzdCUyMG1hbnxlbnwxfHx8fDE3Njk5NTc0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    calificacion: 4.9,
    experiencia: "9 años de experiencia",
    disponibilidad: ["Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  },
  // Nails & Beauty Lounge
  {
    id: 8,
    salonId: 4,
    nombre: "Valentina Torres",
    especialidad: "Nail Artist",
    imagen: "https://images.unsplash.com/photo-1737063935340-f9af0940c4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYWlyc3R5bGlzdCUyMHdvbWFufGVufDF8fHx8MTc2OTg4MDc4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    calificacion: 4.7,
    experiencia: "4 años de experiencia",
    disponibilidad: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
  }
];

export const servicios: Servicio[] = [
  { id: 1, nombre: "Corte de Cabello", descripcion: "Corte personalizado según tu estilo", duracion: 45, precio: 25 },
  { id: 2, nombre: "Coloración Completa", descripcion: "Cambio de color total", duracion: 120, precio: 80 },
  { id: 3, nombre: "Balayage", descripcion: "Técnica de iluminación natural", duracion: 180, precio: 150 },
  { id: 4, nombre: "Tratamiento Capilar", descripcion: "Hidratación profunda", duracion: 60, precio: 45 },
  { id: 5, nombre: "Peinado Especial", descripcion: "Para eventos y ocasiones", duracion: 90, precio: 60 },
  { id: 6, nombre: "Manicure", descripcion: "Cuidado completo de manos", duracion: 45, precio: 30 },
  { id: 7, nombre: "Pedicure", descripcion: "Cuidado completo de pies", duracion: 60, precio: 40 },
  { id: 8, nombre: "Facial Profundo", descripcion: "Limpieza y tratamiento facial", duracion: 75, precio: 70 },
  { id: 9, nombre: "Masaje Relajante", descripcion: "Masaje de cuerpo completo", duracion: 90, precio: 85 },
  { id: 10, nombre: "Uñas Acrílicas", descripcion: "Aplicación de uñas acrílicas", duracion: 120, precio: 55 }
];

// Estado inicial de citas (simula la tabla de citas en MariaDB)
export let citas: Cita[] = [
  {
    id: 1,
    clienteNombre: "Juan Pérez",
    clienteEmail: "juan@example.com",
    clienteTelefono: "+1 555-1234",
    salonId: 1,
    trabajadorId: 1,
    servicioId: 2,
    fecha: "2026-02-05",
    hora: "10:00",
    estado: "confirmada",
    notas: "Primera vez en el salón"
  }
];

// Función para agregar una cita (simula INSERT en MariaDB)
export const agregarCita = (cita: Omit<Cita, 'id'>): Cita => {
  const nuevaCita: Cita = {
    ...cita,
    id: citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1
  };
  citas.push(nuevaCita);
  return nuevaCita;
};

// Función para obtener citas por trabajador y fecha (simula SELECT en MariaDB)
export const obtenerCitasPorTrabajadorYFecha = (trabajadorId: number, fecha: string): Cita[] => {
  return citas.filter(c => c.trabajadorId === trabajadorId && c.fecha === fecha);
};

// Función para generar horarios disponibles
export const generarHorariosDisponibles = (
  trabajadorId: number,
  fecha: string,
  horarioApertura: string,
  horarioCierre: string,
  duracionServicio: number
): string[] => {
  const citasExistentes = obtenerCitasPorTrabajadorYFecha(trabajadorId, fecha);
  const horasOcupadas = citasExistentes.map(c => c.hora);
  
  const horarios: string[] = [];
  const [horaInicio, minInicio] = horarioApertura.split(':').map(Number);
  const [horaFin, minFin] = horarioCierre.split(':').map(Number);
  
  let horaActual = horaInicio;
  let minActual = minInicio;
  
  while (horaActual < horaFin || (horaActual === horaFin && minActual < minFin)) {
    const horarioStr = `${String(horaActual).padStart(2, '0')}:${String(minActual).padStart(2, '0')}`;
    if (!horasOcupadas.includes(horarioStr)) {
      horarios.push(horarioStr);
    }
    
    minActual += 30; // Intervalos de 30 minutos
    if (minActual >= 60) {
      horaActual += 1;
      minActual = 0;
    }
  }
  
  return horarios;
};
