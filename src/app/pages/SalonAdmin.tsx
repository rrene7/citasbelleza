import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function SalonAdmin() {
  const [perfil, setPerfil] = useState<any>(null);
  const [servicios, setServicios] = useState<any[]>([]);
  const [trabajadores, setTrabajadores] = useState<any[]>([]);
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: "", precio: "" });
  const [nuevoTrabajador, setNuevoTrabajador] = useState({ nombre: "", especialidad: "", experiencia: "" });

  const cargarDatos = async () => {
    const perfilRes = await fetch("http://localhost/citasbelleza/api/salon-admin/perfil.php", { credentials: "include" });
    const serviciosRes = await fetch("http://localhost/citasbelleza/api/salon-admin/servicios/list.php", { credentials: "include" });
    const trabajadoresRes = await fetch("http://localhost/citasbelleza/api/salon-admin/trabajadores/list.php", { credentials: "include" });

    setPerfil(await perfilRes.json());
    setServicios(await serviciosRes.json());
    setTrabajadores(await trabajadoresRes.json());
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearServicio = async () => {
    await fetch("http://localhost/citasbelleza/api/salon-admin/servicios/create.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoServicio)
    });
    setNuevoServicio({ nombre: "", precio: "" });
    cargarDatos();
  };

  const crearTrabajador = async () => {
    await fetch("http://localhost/citasbelleza/api/salon-admin/trabajadores/create.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoTrabajador)
    });
    setNuevoTrabajador({ nombre: "", especialidad: "", experiencia: "" });
    cargarDatos();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6">Panel del Salon</h1>

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="servicios">Servicios</TabsTrigger>
          <TabsTrigger value="trabajadores">Trabajadores</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card>
            <CardHeader><CardTitle>Perfil</CardTitle></CardHeader>
            <CardContent>
              {perfil && (
                <div>
                  <p>{perfil.nombre}</p>
                  <p>{perfil.direccion}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicios">
          <Card>
            <CardHeader><CardTitle>Servicios</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input placeholder="Nombre" value={nuevoServicio.nombre} onChange={(e)=>setNuevoServicio({...nuevoServicio, nombre:e.target.value})} />
                <Input placeholder="Precio" value={nuevoServicio.precio} onChange={(e)=>setNuevoServicio({...nuevoServicio, precio:e.target.value})} />
                <Button onClick={crearServicio}>Agregar</Button>
              </div>
              {servicios.map(s => (
                <div key={s.id}>{s.nombre} - ${s.precio}</div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trabajadores">
          <Card>
            <CardHeader><CardTitle>Trabajadores</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input placeholder="Nombre" value={nuevoTrabajador.nombre} onChange={(e)=>setNuevoTrabajador({...nuevoTrabajador, nombre:e.target.value})} />
                <Input placeholder="Especialidad" value={nuevoTrabajador.especialidad} onChange={(e)=>setNuevoTrabajador({...nuevoTrabajador, especialidad:e.target.value})} />
                <Input placeholder="Experiencia" value={nuevoTrabajador.experiencia} onChange={(e)=>setNuevoTrabajador({...nuevoTrabajador, experiencia:e.target.value})} />
                <Button onClick={crearTrabajador}>Agregar</Button>
              </div>
              {trabajadores.map(t => (
                <div key={t.id}>{t.nombre} - {t.especialidad}</div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
