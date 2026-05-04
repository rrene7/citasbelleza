import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { type ApiCita } from "@/services/api";

interface AgendaVisualProps {
  citas: ApiCita[];
  onCambiarEstado: (id: number, estado: string) => void;
  onWhatsApp: (cita: ApiCita) => void;
}

const horas = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
];

function estadoClass(estado: string) {
  switch (estado) {
    case "confirmada": return "border-l-4 border-l-green-600 bg-green-50";
    case "completada": return "border-l-4 border-l-blue-600 bg-blue-50";
    case "cancelada": return "border-l-4 border-l-red-600 bg-red-50 opacity-70";
    default: return "border-l-4 border-l-yellow-500 bg-yellow-50";
  }
}

export function AgendaVisual({ citas, onCambiarEstado, onWhatsApp }: AgendaVisualProps) {
  const hoy = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState(hoy);

  const citasDelDia = useMemo(() => citas.filter((cita) => cita.fecha === fecha), [citas, fecha]);

  const porHora = useMemo(() => {
    const mapa = new Map<string, ApiCita[]>();
    for (const cita of citasDelDia) {
      const hora = cita.hora.slice(0, 5);
      if (!mapa.has(hora)) mapa.set(hora, []);
      mapa.get(hora)?.push(cita);
    }
    return mapa;
  }, [citasDelDia]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle>Agenda visual</CardTitle>
            <CardDescription>Vista diaria por horarios y estado de cada cita.</CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-[180px]" />
            <Badge variant="outline">{citasDelDia.length} citas</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {horas.map((hora) => {
            const citasHora = porHora.get(hora) || [];
            return (
              <div key={hora} className="grid grid-cols-[90px_1fr] gap-4 border-b pb-3">
                <div className="font-semibold text-sm text-muted-foreground pt-3">{hora}</div>
                <div className="space-y-2">
                  {citasHora.length === 0 ? (
                    <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">Disponible</div>
                  ) : (
                    citasHora.map((cita) => (
                      <div key={cita.id} className={`rounded-md border p-3 ${estadoClass(cita.estado)}`}>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{cita.cliente_nombre}</p>
                              <Badge variant="outline">{cita.estado}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{cita.servicio_nombre} · {cita.trabajador_nombre}</p>
                            <p className="text-sm text-muted-foreground">{cita.salon_nombre} · {cita.cliente_telefono}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => onCambiarEstado(cita.id, "confirmada")}>Confirmar</Button>
                            <Button size="sm" variant="outline" onClick={() => onCambiarEstado(cita.id, "completada")}>Completar</Button>
                            <Button size="sm" variant="outline" onClick={() => onWhatsApp(cita)}>WhatsApp</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
