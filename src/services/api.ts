const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/citasbelleza/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.error) {
    throw new Error(data?.error || 'Error de comunicacion con la API');
  }

  return data as T;
}

export type ApiUsuario = {
  id: number;
  nombre: string;
  email: string;
  rol?: string;
};

export type ApiSalon = {
  id: number;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  telefono: string | null;
  imagen: string | null;
  horario_apertura: string;
  horario_cierre: string;
  calificacion: string | number;
};

export type ApiServicio = {
  id: number;
  salon_id: number;
  nombre: string;
  descripcion: string | null;
  duracion_minutos: number;
  precio: string | number;
};

export type ApiTrabajador = {
  id: number;
  salon_id: number;
  nombre: string;
  especialidad: string | null;
  imagen: string | null;
  calificacion: string | number;
  experiencia: string | null;
};

export type ApiCita = {
  id: number;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string | null;
  salon_id: number;
  trabajador_id: number;
  servicio_id: number;
  fecha: string;
  hora: string;
  estado: string;
  notas: string | null;
  salon_nombre?: string;
  trabajador_nombre?: string;
  servicio_nombre?: string;
  precio?: string | number;
};

export type CrearCitaPayload = {
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono?: string;
  salon_id: number;
  trabajador_id: number;
  servicio_id: number;
  fecha: string;
  hora: string;
  notas?: string;
};

export const api = {
  login: (email: string, password: string) =>
    request<{ ok: true; usuario: ApiUsuario }>('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  logout: () => request<{ ok: true }>('/auth/logout.php'),

  me: () => request<ApiUsuario>('/auth/me.php'),

  salones: () => request<ApiSalon[]>('/salones/'),
  servicios: (salonId?: number) => request<ApiServicio[]>(salonId ? `/servicios/?salon_id=${salonId}` : '/servicios/'),
  trabajadores: (salonId?: number) => request<ApiTrabajador[]>(salonId ? `/trabajadores/?salon_id=${salonId}` : '/trabajadores/'),
  citas: (email?: string) => request<ApiCita[]>(email ? `/citas/?email=${encodeURIComponent(email)}` : '/citas/'),
  disponibilidad: (trabajadorId: number, fecha: string) =>
    request<string[]>(`/citas/disponibilidad.php?trabajador_id=${trabajadorId}&fecha=${encodeURIComponent(fecha)}`),
  crearCita: (payload: CrearCitaPayload) =>
    request<{ ok: true }>('/citas/store.php', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export function normalizarSalon(salon: ApiSalon) {
  return {
    id: Number(salon.id),
    nombre: salon.nombre,
    descripcion: salon.descripcion || '',
    direccion: salon.direccion || '',
    telefono: salon.telefono || '',
    imagen: salon.imagen || 'https://images.unsplash.com/photo-1611211235015-e2e3a7d09e97?auto=format&fit=crop&w=1080&q=80',
    horarioApertura: (salon.horario_apertura || '09:00').slice(0, 5),
    horarioCierre: (salon.horario_cierre || '20:00').slice(0, 5),
    calificacion: Number(salon.calificacion || 0),
    servicios: [] as string[]
  };
}

export function normalizarTrabajador(trabajador: ApiTrabajador) {
  return {
    id: Number(trabajador.id),
    salonId: Number(trabajador.salon_id),
    nombre: trabajador.nombre,
    especialidad: trabajador.especialidad || '',
    imagen: trabajador.imagen || 'https://images.unsplash.com/photo-1737063935340-f9af0940c4c5?auto=format&fit=crop&w=1080&q=80',
    calificacion: Number(trabajador.calificacion || 0),
    experiencia: trabajador.experiencia || '',
    disponibilidad: [] as string[]
  };
}

export function normalizarServicio(servicio: ApiServicio) {
  return {
    id: Number(servicio.id),
    nombre: servicio.nombre,
    descripcion: servicio.descripcion || '',
    duracion: Number(servicio.duracion_minutos || 30),
    precio: Number(servicio.precio || 0)
  };
}
