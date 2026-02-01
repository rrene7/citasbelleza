import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { citas, salones, trabajadores, servicios } from "@/data/mockData";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Star, Trash2, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export function MisCitas() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [buscarCitas, setBuscarCitas] = useState(false);
  const [emailBusqueda, setEmailBusqueda] = useState("");

  const citasUsuario = citas.filter(c => c.clienteEmail === emailBusqueda);
  const citasPendientes = citasUsuario.filter(c => c.estado === 'pendiente' || c.estado === 'confirmada');
  const citasHistorial = citasUsuario.filter(c => c.estado === 'completada' || c.estado === 'cancelada');

  const handleBuscarCitas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor ingresa tu email");
      return;
    }
    setEmailBusqueda(email);
    setBuscarCitas(true);
  };

  const handleCancelarCita = (citaId: number) => {
    const cita = citas.find(c => c.id === citaId);
    if (cita) {
      cita.estado = 'cancelada';
      toast.success("Cita cancelada exitosamente");
    }
  };

  const CitaCard = ({ cita }: { cita: any }) => {
    const salon = salones.find(s => s.id === cita.salonId);
    const trabajador = trabajadores.find(t => t.id === cita.trabajadorId);
    const servicio = servicios.find(s => s.id === cita.servicioId);

    return (
      <Card className="overflow-hidden">
        <CardHeader className={cita.estado === 'cancelada' ? 'opacity-60' : ''}>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{salon?.nombre}</CardTitle>
              <CardDescription>{servicio?.nombre}</CardDescription>
            </div>
            <Badge variant={
              cita.estado === 'confirmada' ? 'default' : 
              cita.estado === 'pendiente' ? 'secondary' :
              cita.estado === 'completada' ? 'outline' : 'destructive'
            }>
              {cita.estado}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{format(new Date(cita.fecha), "EEEE, d 'de' MMMM, yyyy", { locale: es })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{cita.hora} ({servicio?.duracion} minutos)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span>Con {trabajador?.nombre} - {trabajador?.especialidad}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{salon?.direccion}</span>
            </div>
            {cita.notas && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <p className="font-medium mb-1">Notas:</p>
                <p className="text-muted-foreground">{cita.notas}</p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(`/salon/${salon?.id}`)}
              >
                Ver Salón
              </Button>
              {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>¿Cancelar cita?</DialogTitle>
                      <DialogDescription>
                        Esta acción cancelará tu cita programada. El horario quedará disponible para otros clientes.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline">No, mantener</Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleCancelarCita(cita.id)}
                      >
                        Sí, cancelar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!buscarCitas) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Consultar Mis Citas</CardTitle>
              <CardDescription>
                Ingresa tu email para ver tus citas agendadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuscarCitas} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar mis citas
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1>Mis Citas</h1>
          <Button variant="outline" onClick={() => {
            setBuscarCitas(false);
            setEmail("");
            setEmailBusqueda("");
          }}>
            Cambiar Email
          </Button>
        </div>
        <p className="text-muted-foreground">Gestiona tus citas en {emailBusqueda}</p>
      </div>

      {citasUsuario.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No tienes citas registradas</h3>
            <p className="text-muted-foreground mb-4">
              Explora nuestros salones y agenda tu primera cita
            </p>
            <Button onClick={() => navigate("/")}>
              Explorar Salones
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="activas" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="activas">
              Citas Activas ({citasPendientes.length})
            </TabsTrigger>
            <TabsTrigger value="historial">
              Historial ({citasHistorial.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activas" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {citasPendientes.length > 0 ? (
                citasPendientes.map((cita) => (
                  <CitaCard key={cita.id} cita={cita} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No tienes citas activas</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="historial" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {citasHistorial.length > 0 ? (
                citasHistorial.map((cita) => (
                  <CitaCard key={cita.id} cita={cita} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No tienes historial de citas</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
