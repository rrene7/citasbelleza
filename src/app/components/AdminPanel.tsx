import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { api, type ApiCita, normalizarSalon } from "@/services/api";
import { AgendaVisual } from "@/app/components/AgendaVisual";
import { toast } from "sonner";
import { Building2, Calendar, Users, DollarSign, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminPanel() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<ApiCita[]>([]);
  const [salones, setSalones] = useState<ReturnType<typeof normalizarSalon>[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      await api.me();
      const [citasData, salonesData] = await Promise.all([api.citas(), api.salones()]);
      setCitas(citasData);
      setSalones(salonesData.map(normalizarSalon));
    } catch (error) {
      toast.error("Debes iniciar sesion para acceder al panel admin");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const citasFiltradas = useMemo(() => {
    return fechaFiltro ? citas.filter((cita) => cita.fecha === fechaFiltro) : citas;
  }, [citas, fechaFiltro]);

  const clientesUnicos = new Set(citas.map((c) => c.cliente_email)).size;
  const ingresosEstimados = citas
    .filter((c) => c.estado !== "cancelada")
    .reduce((total, c) => total + Number(c.precio || 0), 0);

  const estadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "confirmada": return "default";
      case "pendiente": return "secondary";
      case "completada": return "outline";
      case "cancelada": return "destructive";
      default: return "secondary";
    }
  };

  const cambiarEstado = async (id: number, estado: string) => {
    try {
      await fetch("http://localhost/citasbelleza/api/citas/update_estado.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado })
      }).then(async (r) => {
        const data = await r.json();
        if (!r.ok || data.error) throw new Error(data.error || "Error");
      });
      toast.success("Estado actualizado");

      await fetch("http://localhost/citasbelleza/api/notificaciones/whatsapp.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cita_id: id, estado })
      })
        .then(async (r) => {
          const data = await r.json();
          if (data.url) {
            window.open(data.url, "_blank");
          }
        })
        .catch(() => {
          console.warn("No se pudo preparar la notificacion de WhatsApp");
        });

      cargarDatos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar");
    }
  };

  const eliminarCita = async (id: number) => {
    if (!confirm("Seguro que deseas eliminar esta cita?")) return;
    try {
      await fetch("http://localhost/citasbelleza/api/citas/delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      }).then(async (r) => {
        const data = await r.json();
        if (!r.ok || data.error) throw new Error(data.error || "Error");
      });
      toast.success("Cita eliminada");
      cargarDatos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar");
    }
  };

  const enviarWhatsApp = (cita: ApiCita) => {
    const telefono = (cita.cliente_telefono || "").replace(/\D/g, "");
    const numero = telefono.startsWith("507") ? telefono : `507${telefono}`;
    const mensaje = `Hola ${cita.cliente_nombre}, tu cita en ${cita.salon_nombre || "Citas Belleza Panama"} para ${cita.servicio_nombre || "servicio"} el ${cita.fecha} a las ${cita.hora.slice(0,5)} esta ${cita.estado}.`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando panel...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Panel Admin</h1>
          <p className="text-muted-foreground">Gestion real de salones, citas y agenda.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")}>Volver al inicio</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Salones</CardTitle><Building2 className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="font-bold">{salones.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Citas</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="font-bold">{citas.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Clientes</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="font-bold">{clientesUnicos}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Ingresos Est.</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="font-bold">${ingresosEstimados.toFixed(2)}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="citas" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="citas">Citas</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="salones">Salones</TabsTrigger>
        </TabsList>

        <TabsContent value="citas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion de Citas</CardTitle>
              <CardDescription>Filtra, confirma, completa, cancela o elimina citas reales.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-3 items-center">
                <Input type="date" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} className="max-w-xs" />
                <Button variant="outline" onClick={() => setFechaFiltro("")}>Limpiar</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead><TableHead>Salon</TableHead><TableHead>Servicio</TableHead><TableHead>Fecha</TableHead><TableHead>Hora</TableHead><TableHead>Estado</TableHead><TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citasFiltradas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell><div className="font-medium">{cita.cliente_nombre}</div><div className="text-xs text-muted-foreground">{cita.cliente_email}<br />{cita.cliente_telefono}</div></TableCell>
                      <TableCell>{cita.salon_nombre}</TableCell>
                      <TableCell>{cita.servicio_nombre}<div className="text-xs text-muted-foreground">${cita.precio}</div></TableCell>
                      <TableCell>{cita.fecha}</TableCell>
                      <TableCell>{cita.hora.slice(0,5)}</TableCell>
                      <TableCell><Badge variant={estadoBadgeColor(cita.estado)}>{cita.estado}</Badge></TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => cambiarEstado(cita.id, "confirmada")}>Confirmar</Button>
                          <Button size="sm" variant="outline" onClick={() => cambiarEstado(cita.id, "completada")}>Completar</Button>
                          <Button size="sm" variant="outline" onClick={() => cambiarEstado(cita.id, "cancelada")}>Cancelar</Button>
                          <Button size="sm" variant="outline" onClick={() => enviarWhatsApp(cita)}>WhatsApp</Button>
                          <Button size="sm" variant="destructive" onClick={() => eliminarCita(cita.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {citasFiltradas.length === 0 && <div className="text-center py-8 text-muted-foreground">No hay citas para mostrar</div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agenda" className="mt-6">
          <AgendaVisual citas={citas} onCambiarEstado={cambiarEstado} onWhatsApp={enviarWhatsApp} />
        </TabsContent>

        <TabsContent value="salones" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Salones Registrados</CardTitle><CardDescription>Datos reales cargados desde MariaDB.</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salones.map((salon) => (
                  <div key={salon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div><h3 className="font-medium">{salon.nombre}</h3><p className="text-sm text-muted-foreground">{salon.direccion}</p><p className="text-sm text-muted-foreground">{salon.telefono}</p></div>
                    <div className="flex items-center gap-2"><Badge variant="outline">{salon.calificacion} estrella</Badge><Button variant="outline" size="sm" onClick={() => navigate(`/salon/${salon.id}`)}>Ver</Button></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
