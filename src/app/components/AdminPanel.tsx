import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { salones, citas } from "@/data/mockData";
import { toast } from "sonner";
import { PlusCircle, Building2, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminPanel() {
  const navigate = useNavigate();
  const [nuevoSalon, setNuevoSalon] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    telefono: "",
    horarioApertura: "09:00",
    horarioCierre: "20:00"
  });

  const handleSubmitSalon = (e: React.FormEvent) => {
    e.preventDefault();
    
    // En producciÛn, esto harÌa un POST a la API de MariaDB
    toast.success("SalÛn agregado exitosamente", {
      description: "El salÛn ha sido registrado en la base de datos"
    });

    setNuevoSalon({
      nombre: "",
      descripcion: "",
      direccion: "",
      telefono: "",
      horarioApertura: "09:00",
      horarioCierre: "20:00"
    });
  };

  const estadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'default';
      case 'pendiente':
        return 'secondary';
      case 'completada':
        return 'outline';
      case 'cancelada':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Panel de AdministraciÛn</h1>
          <p className="text-muted-foreground">Gestiona salones, trabajadores y citas</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salones</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold">{salones.length}</div>
            <p className="text-xs text-muted-foreground">
              Salones registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold">{citas.filter(c => c.estado === 'confirmada').length}</div>
            <p className="text-xs text-muted-foreground">
              Citas confirmadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold">{new Set(citas.map(c => c.clienteEmail)).size}</div>
            <p className="text-xs text-muted-foreground">
              Clientes ˙nicos
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="salones" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="salones">Salones</TabsTrigger>
          <TabsTrigger value="citas">Citas</TabsTrigger>
          <TabsTrigger value="nuevo">Nuevo SalÛn</TabsTrigger>
        </TabsList>

        <TabsContent value="salones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Salones Registrados</CardTitle>
              <CardDescription>
                Lista de todos los salones en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salones.map((salon) => (
                  <div key={salon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img 
                        src={salon.imagen} 
                        alt={salon.nombre}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-medium">{salon.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{salon.direccion}</p>
                        <p className="text-sm text-muted-foreground">{salon.telefono}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{salon.calificacion} ‚≠ê</Badge>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/salon/${salon.id}`)}>
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="citas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>GestiÛn de Citas</CardTitle>
              <CardDescription>
                Todas las citas programadas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>SalÛn</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Contacto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citas.map((cita) => {
                    const salon = salones.find(s => s.id === cita.salonId);
                    return (
                      <TableRow key={cita.id}>
                        <TableCell className="font-medium">{cita.clienteNombre}</TableCell>
                        <TableCell>{salon?.nombre || 'N/A'}</TableCell>
                        <TableCell>{cita.fecha}</TableCell>
                        <TableCell>{cita.hora}</TableCell>
                        <TableCell>
                          <Badge variant={estadoBadgeColor(cita.estado)}>
                            {cita.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {cita.clienteEmail}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {citas.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay citas registradas
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nuevo" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Agregar Nuevo SalÛn
              </CardTitle>
              <CardDescription>
                Registra un nuevo salÛn de belleza en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSalon} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del SalÛn *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={nuevoSalon.nombre}
                      onChange={(e) => setNuevoSalon({...nuevoSalon, nombre: e.target.value})}
                      placeholder="Ej: Beauty Studio Premium"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">TelÈfono *</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={nuevoSalon.telefono}
                      onChange={(e) => setNuevoSalon({...nuevoSalon, telefono: e.target.value})}
                      placeholder="+1 555-0000"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="direccion">DirecciÛn *</Label>
                    <Input
                      id="direccion"
                      type="text"
                      value={nuevoSalon.direccion}
                      onChange={(e) => setNuevoSalon({...nuevoSalon, direccion: e.target.value})}
                      placeholder="Av. Principal 123, Centro"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descripcion">DescripciÛn *</Label>
                    <Textarea
                      id="descripcion"
                      value={nuevoSalon.descripcion}
                      onChange={(e) => setNuevoSalon({...nuevoSalon, descripcion: e.target.value})}
                      placeholder="Describe los servicios y especialidades del salÛn..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apertura">Horario de Apertura *</Label>
                    <Input
                      id="apertura"
                      type="time"
                      value={nuevoSalon.horarioApertura}
                      onChange={(e) => setNuevoSalon({...nuevoSalon, horarioApertura: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cierre">Horario de Cierre *</Label>
                    <Input
                      id="cierre"
                      type="time"
                      value={nuevoSalon.horarioCierre}
                      onChange={(e) => setNuevoSalon({...nuevoSalon, horarioCierre: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Registrar SalÛn
                  </Button>
                </div>

                <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Nota de IntegraciÛn con MariaDB:</p>
                  <p>
                    En producciÛn, este formulario enviar· los datos a travÈs de una API REST 
                    que ejecutar· comandos INSERT en la base de datos MariaDB. La estructura 
                    de datos ya est· preparada para la integraciÛn backend.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
