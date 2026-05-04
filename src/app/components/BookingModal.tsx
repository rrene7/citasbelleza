import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Calendar } from "@/app/components/ui/calendar";
import { Salon, Trabajador } from "@/types";
import { api, normalizarServicio, type ApiServicio } from "@/services/api";
import { paymentConfig } from "@/data/paymentConfig";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  salon: Salon;
  trabajador: Trabajador;
}

export function BookingModal({ isOpen, onClose, salon, trabajador }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [metodoPago, setMetodoPago] = useState<string>("yappy");
  const [serviciosSalon, setServiciosSalon] = useState<ReturnType<typeof normalizarServicio>[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  const servicioSeleccionado = serviciosSalon.find(s => s.id === Number(selectedService));

  useEffect(() => {
    if (!isOpen) return;

    api.servicios(salon.id)
      .then((data: ApiServicio[]) => setServiciosSalon(data.map(normalizarServicio)))
      .catch(() => toast.error("No se pudieron cargar los servicios"));
  }, [isOpen, salon.id]);

  useEffect(() => {
    setSelectedTime("");

    if (!selectedDate) {
      setHorariosDisponibles([]);
      return;
    }

    api.disponibilidad(trabajador.id, format(selectedDate, "yyyy-MM-dd"))
      .then(setHorariosDisponibles)
      .catch(() => {
        setHorariosDisponibles([]);
        toast.error("No se pudo consultar la disponibilidad");
      });
  }, [selectedDate, trabajador.id]);

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedService("");
    setSelectedTime("");
    setClienteNombre("");
    setClienteEmail("");
    setClienteTelefono("");
    setNotas("");
    setMetodoPago("yappy");
    setHorariosDisponibles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedService || !selectedTime || !clienteNombre || !clienteEmail || !clienteTelefono) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const metodoPagoTexto = metodoPago === "yappy" ? "Yappy" : "Efectivo en salon";
    const notasFinales = notas
      ? `${notas}\nMetodo de pago: ${metodoPagoTexto}`
      : `Metodo de pago: ${metodoPagoTexto}`;

    try {
      setGuardando(true);
      await api.crearCita({
        cliente_nombre: clienteNombre,
        cliente_email: clienteEmail,
        cliente_telefono: clienteTelefono,
        salon_id: salon.id,
        trabajador_id: trabajador.id,
        servicio_id: Number(selectedService),
        fecha: format(selectedDate, "yyyy-MM-dd"),
        hora: selectedTime,
        notas: notasFinales
      });

      toast.success("Cita agendada exitosamente", {
        description: `Tu cita con ${trabajador.nombre} fue registrada para el ${format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })} a las ${selectedTime}. Pago: ${metodoPagoTexto}`
      });

      resetForm();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al agendar la cita");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Cita con {trabajador.nombre}</DialogTitle>
          <DialogDescription>
            {trabajador.especialidad} en {salon.nombre}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="servicio">Servicio *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger id="servicio">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviciosSalon.map((servicio) => (
                      <SelectItem key={servicio.id} value={String(servicio.id)}>
                        {servicio.nombre} - ${servicio.precio} ({servicio.duracion} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Fecha de la cita *</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border"
                  locale={es}
                />
              </div>

              {selectedDate && horariosDisponibles.length > 0 && (
                <div>
                  <Label htmlFor="hora">Hora disponible *</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger id="hora">
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {horariosDisponibles.map((hora) => (
                        <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedDate && horariosDisponibles.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay horarios disponibles para esta fecha.</p>
              )}

              <div>
                <Label htmlFor="metodo-pago">Metodo de pago *</Label>
                <Select value={metodoPago} onValueChange={setMetodoPago}>
                  <SelectTrigger id="metodo-pago">
                    <SelectValue placeholder="Selecciona un metodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yappy">Yappy</SelectItem>
                    <SelectItem value="efectivo">Efectivo en salon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {metodoPago === "yappy" && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium mb-1">Pago con Yappy</p>
                  {paymentConfig.yappyLink ? (
                    <p className="text-muted-foreground">
                      Paga aqui:{" "}
                      <a className="underline" href={paymentConfig.yappyLink} target="_blank" rel="noreferrer">
                        {paymentConfig.yappyLink}
                      </a>
                    </p>
                  ) : (
                    <p className="text-muted-foreground">Solicita el link o paga al numero Yappy del salon.</p>
                  )}
                  {paymentConfig.yappyPhone && <p className="text-muted-foreground">Yappy: {paymentConfig.yappyPhone}</p>}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input id="nombre" type="text" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} placeholder="Juan Perez" required />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={clienteEmail} onChange={(e) => setClienteEmail(e.target.value)} placeholder="juan@ejemplo.com" required />
              </div>

              <div>
                <Label htmlFor="telefono">Telefono *</Label>
                <Input id="telefono" type="tel" value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value)} placeholder="+507 6000-0000" required />
              </div>

              <div>
                <Label htmlFor="notas">Notas adicionales</Label>
                <Textarea id="notas" value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Comentarios o preferencias especiales..." rows={4} />
              </div>
            </div>
          </div>

          {servicioSeleccionado && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Resumen del Servicio</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-muted-foreground">Servicio:</p>
                <p className="font-medium">{servicioSeleccionado.nombre}</p>
                <p className="text-muted-foreground">Duracion:</p>
                <p className="font-medium">{servicioSeleccionado.duracion} minutos</p>
                <p className="text-muted-foreground">Precio:</p>
                <p className="font-medium">${servicioSeleccionado.precio}</p>
                <p className="text-muted-foreground">Profesional:</p>
                <p className="font-medium">{trabajador.nombre}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Confirmar Cita"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
