import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function SalonAdmin() {
  const [perfil, setPerfil] = useState<any>(null);
  const [servicios, setServicios] = useState<any[]>([]);
  const [trabajadores, setTrabajadores] = useState<any[]>([]);
  const [fotoSalon, setFotoSalon] = useState<File | null>(null);
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: "", precio: "" });
  const [nuevoTrabajador, setNuevoTrabajador] = useState({ nombre: "", especialidad: "", experiencia: "" });

  const cargarDatos = async () => {
    const [perfilRes, serviciosRes, trabajadoresRes] = await Promise.all([
      fetch("http://localhost/citasbelleza/api/salon-admin/perfil.php", { credentials: "include" }),
      fetch("http://localhost/citasbelleza/api/salon-admin/servicios/list.php", { credentials: "include" }),
      fetch("http://localhost/citasbelleza/api/salon-admin/trabajadores/list.php", { credentials: "include" })
    ]);

    setPerfil(await perfilRes.json());
    setServicios(await serviciosRes.json());
    setTrabajadores(await trabajadoresRes.json());
  };

  useEffect(() => { cargarDatos(); }, []);

  const subirFotoSalon = async () => {
    if (!fotoSalon) return;
    const fd = new FormData();
    fd.append("foto", fotoSalon);
    await fetch("http://localhost/citasbelleza/api/salon-admin/upload_salon_foto.php", { method: "POST", credentials: "include", body: fd });
    setFotoSalon(null);
    cargarDatos();
  };

  const crearServicio = async () => {
    if (!nuevoServicio.nombre) return;
    await fetch("http://localhost/citasbelleza/api/salon-admin/servicios/create.php", {
      method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nuevoServicio)
    });
    setNuevoServicio({ nombre: "", precio: "" });
    cargarDatos();
  };

  const crearTrabajador = async () => {
    if (!nuevoTrabajador.nombre) return;
    await fetch("http://localhost/citasbelleza/api/salon-admin/trabajadores/create.php", {
      method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nuevoTrabajador)
    });
    setNuevoTrabajador({ nombre: "", especialidad: "", experiencia: "" });
    cargarDatos();
  };

  const subirFotoTrabajador = async (trabajadorId: number, file?: File | null) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("trabajador_id", String(trabajadorId));
    fd.append("foto", file);
    await fetch("http://localhost/citasbelleza/api/salon-admin/trabajadores/upload_foto.php", { method: "POST", credentials: "include", body: fd });
    cargarDatos();
  };

  const imagenUrl = (ruta?: string) => ruta?.startsWith("uploads/") ? `http://localhost/citasbelleza/${ruta}` : ruta;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6">Panel del Salon</h1>

      <Tabs defaultValue="perfil">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="servicios">Servicios</TabsTrigger>
          <TabsTrigger value="trabajadores">Trabajadores</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-6">
          <Card><CardHeader><CardTitle>Perfil del Salon</CardTitle></CardHeader><CardContent className="space-y-4">
            {perfil && (<>
              {perfil.imagen && <img src={imagenUrl(perfil.imagen)} className="w-full max-h-72 object-cover rounded-lg" />}
              <p><b>Nombre:</b> {perfil.nombre}</p>
              <p><b>Direccion:</b> {perfil.direccion}</p>
              <p><b>Telefono:</b> {perfil.telefono}</p>
              <div className="flex gap-2"><Input type="file" onChange={(e)=>setFotoSalon(e.target.files?.[0] || null)} /><Button onClick={subirFotoSalon}>Subir Foto</Button></div>
            </>)}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="servicios" className="mt-6">
          <Card><CardHeader><CardTitle>Servicios</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_120px] gap-2">
              <Input placeholder="Nombre del servicio" value={nuevoServicio.nombre} onChange={(e)=>setNuevoServicio({...nuevoServicio, nombre:e.target.value})} />
              <Input placeholder="Precio" value={nuevoServicio.precio} onChange={(e)=>setNuevoServicio({...nuevoServicio, precio:e.target.value})} />
              <Button onClick={crearServicio}>Agregar</Button>
            </div>
            <div className="space-y-2">{servicios.map(s => <div key={s.id} className="border rounded p-3 flex justify-between"><span>{s.nombre}</span><b>${s.precio}</b></div>)}</div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="trabajadores" className="mt-6">
          <Card><CardHeader><CardTitle>Trabajadores</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_120px] gap-2">
              <Input placeholder="Nombre" value={nuevoTrabajador.nombre} onChange={(e)=>setNuevoTrabajador({...nuevoTrabajador, nombre:e.target.value})} />
              <Input placeholder="Especialidad" value={nuevoTrabajador.especialidad} onChange={(e)=>setNuevoTrabajador({...nuevoTrabajador, especialidad:e.target.value})} />
              <Input placeholder="Experiencia" value={nuevoTrabajador.experiencia} onChange={(e)=>setNuevoTrabajador({...nuevoTrabajador, experiencia:e.target.value})} />
              <Button onClick={crearTrabajador}>Agregar</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trabajadores.map(t => <Card key={t.id}><CardContent className="p-4 space-y-3">
                {t.imagen && <img src={imagenUrl(t.imagen)} className="w-full h-40 object-cover rounded" />}
                <div><b>{t.nombre}</b><p className="text-sm text-muted-foreground">{t.especialidad}</p><p className="text-sm">{t.experiencia}</p></div>
                <Input type="file" onChange={(e)=>subirFotoTrabajador(t.id, e.target.files?.[0])} />
              </CardContent></Card>)}
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
