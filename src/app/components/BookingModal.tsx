import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { api, normalizarServicio } from "@/services/api";

export function BookingModal({ isOpen, onClose, salon, trabajador }: any) {
  const [servicios, setServicios] = useState<any[]>([]);
  const [servicioId, setServicioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horarios, setHorarios] = useState<string[]>([]);
  const [cliente, setCliente] = useState({ nombre: "", email: "", telefono: "" });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !salon?.id) return;
    api.servicios(Number(salon.id))
      .then((data) => setServicios(data.map(normalizarServicio)))
      .catch(() => setServicios([]));
  }, [isOpen, salon?.id]);

  useEffect(() => {
    if (!fecha || !trabajador?.id) return;
    api.disponibilidad(Number(trabajador.id), fecha)
      .then(setHorarios)
      .catch(() => setHorarios([]));
  }, [fecha, trabajador?.id]);

  const servicio = servicios.find((s) => String(s.id) === String(servicioId));

  const reservar = async () => {
    setMensaje("");
    setError("");

    if (!servicioId || !fecha || !hora || !cliente.nombre || !cliente.email || !cliente.telefono) {
      setError("Completa todos los campos de la reserva");
      return;
    }

    try {
      await api.crearCita({
        cliente_nombre: cliente.nombre,
        cliente_email: cliente.email,
        cliente_telefono: cliente.telefono,
        salon_id: Number(salon.id),
        trabajador_id: Number(trabajador.id),
        servicio_id: Number(servicioId),
        fecha,
        hora,
        notas: "Reserva desde formulario web"
      });

      setMensaje("Cita registrada correctamente");
      setTimeout(() => {
        setCliente({ nombre: "", email: "", telefono: "" });
        setServicioId("");
        setFecha("");
        setHora("");
        onClose();
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la cita");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Agendar cita</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="font-medium">{salon?.nombre}</p>
            <p className="text-sm text-muted-foreground">Profesional: {trabajador?.nombre}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Servicio</label>
            <select className="w-full border rounded-md h-10 px-3" value={servicioId} onChange={(e) => setServicioId(e.target.value)}>
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre} - ${s.precio}</option>
              ))}
            </select>
            {servicios.length === 0 && <p className="text-sm text-muted-foreground">Este salon aun no tiene servicios registrados.</p>}
          </div>

          {servicio && <p className="text-sm text-muted-foreground">Duracion: {servicio.duracion} min · Precio: ${servicio.precio}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Fecha</label>
              <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Hora</label>
              <select className="w-full border rounded-md h-10 px-3" value={hora} onChange={(e) => setHora(e.target.value)}>
                <option value="">Selecciona</option>
                {horarios.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Nombre" value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} />
            <Input placeholder="Email" value={cliente.email} onChange={(e) => setCliente({ ...cliente, email: e.target.value })} />
            <Input placeholder="Telefono" value={cliente.telefono} onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} />
          </div>

          {mensaje && <p className="text-sm text-green-600">{mensaje}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button className="w-full" onClick={reservar}>Confirmar reserva</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
