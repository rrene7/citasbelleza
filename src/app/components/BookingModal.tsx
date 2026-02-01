import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Calendar } from "@/app/components/ui/calendar";
import { Salon, Trabajador } from "@/types";
import { servicios, agregarCita, generarHorariosDisponibles } from "@/data/mockData";
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

  const servicioSeleccionado = servicios.find(s => s.id === Number(selectedService));
  
  const horariosDisponibles = selectedDate && servicioSeleccionado
    ? generarHorariosDisponibles(
        trabajador.id,
        format(selectedDate, 'yyyy-MM-dd'),
        salon.horarioApertura,
        salon.horarioCierre,
        servicioSeleccionado.duracion
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedService || !selectedTime || !clienteNombre || !clienteEmail || !clienteTelefono) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const metodoPagoTexto = metodoPago === "yappy" ? "Yappy" : "Efectivo en salón";
    const notasFinales = notas
      ? `${notas}\nMétodo de pago: ${metodoPagoTexto}`
      : `Método de pago: ${metodoPagoTexto}`;

    try {
      const nuevaCita = agregarCita({
        clienteNombre,
        clienteEmail,
        clienteTelefono,
        salonId: salon.id,
        trabajadorId: trabajador.id,
        servicioId: Number(selectedService),
        fecha: format(selectedDate, 'yyyy-MM-dd'),
        hora: selectedTime,
        estado: 'pendiente',
        notas: notasFinales
      });

      toast.success("¡Cita agendada exitosamente!", {
        description: `Tu cita con ${trabajador.nombre} ha sido confirmada para el ${format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })} a las ${selectedTime}. Pago: ${metodoPagoTexto}`
      });

      // Resetear formulario
      setSelectedDate(undefined);
      setSelectedService("");
      setSelectedTime("");
      setClienteNombre("");
      setClienteEmail("");
      setClienteTelefono("");
      setNotas("");
      setMetodoPago("yappy");
      
      onClose();
    } catch (error) {
      toast.error("Error al agendar la cita. Por favor intenta nuevamente.");
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
                    {servicios.map((servicio) => (
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
                  disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
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
                        <SelectItem key={hora} value={hora}>
                          {hora}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="metodo-pago">Método de pago *</Label>
                <Select value={metodoPago} onValueChange={setMetodoPago}>
                  <SelectTrigger id="metodo-pago">
                    <SelectValue placeholder="Selecciona un método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yappy">Yappy</SelectItem>
                    <SelectItem value="efectivo">Efectivo en salón</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {metodoPago === "yappy" && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium mb-1">Pago con Yappy</p>
                  {paymentConfig.yappyLink ? (
                    <p className="text-muted-foreground">
                      Paga aquí:{" "}
                      <a className="underline" href={paymentConfig.yappyLink} target="_blank" rel="noreferrer">
                        {paymentConfig.yappyLink}
                      </a>
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Solicita el link o paga al número Yappy del salón.
                    </p>
                  )}
                  {paymentConfig.yappyPhone && (
                    <p className="text-muted-foreground">Yappy: {paymentConfig.yappyPhone}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={clienteEmail}
                  onChange={(e) => setClienteEmail(e.target.value)}
                  placeholder="juan@ejemplo.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={clienteTelefono}
                  onChange={(e) => setClienteTelefono(e.target.value)}
                  placeholder="+1 555-1234"
                  required
                />
              </div>

              <div>
                <Label htmlFor="notas">Notas adicionales</Label>
                <Textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Comentarios o preferencias especiales..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {servicioSeleccionado && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Resumen del Servicio</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-muted-foreground">Servicio:</p>
                <p className="font-medium">{servicioSeleccionado.nombre}</p>
                <p className="text-muted-foreground">Duración:</p>
                <p className="font-medium">{servicioSeleccionado.duracion} minutos</p>
                <p className="text-muted-foreground">Precio:</p>
                <p className="font-medium">${servicioSeleccionado.precio}</p>
                <p className="text-muted-foreground">Profesional:</p>
                <p className="font-medium">{trabajador.nombre}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar Cita
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
