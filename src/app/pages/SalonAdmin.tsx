import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function SalonAdmin() {
  const [perfil, setPerfil] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [foto, setFoto] = useState<File | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);

  const cargarDatos = async () => {
    const perfilRes = await fetch("http://localhost/citasbelleza/api/salon-admin/perfil.php", { credentials: "include" });
    const data = await perfilRes.json();
    setPerfil(data);
    setForm(data);

    const dashRes = await fetch("http://localhost/citasbelleza/api/salon-admin/dashboard.php", { credentials: "include" });
    setDashboard(await dashRes.json());
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarPerfil = async () => {
    await fetch("http://localhost/citasbelleza/api/salon-admin/update_perfil.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    cargarDatos();
  };

  const subirFoto = async () => {
    if (!foto) return;
    const formData = new FormData();
    formData.append("foto", foto);

    await fetch("http://localhost/citasbelleza/api/salon-admin/upload_salon_foto.php", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    setFoto(null);
    cargarDatos();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6">Panel del Salon</h1>

      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="p-4">Total citas: {dashboard.total_citas}</CardContent></Card>
          <Card><CardContent className="p-4">Hoy: {dashboard.citas_hoy}</CardContent></Card>
          <Card><CardContent className="p-4">Clientes: {dashboard.clientes}</CardContent></Card>
          <Card><CardContent className="p-4">Ingresos: ${dashboard.ingresos}</CardContent></Card>
        </div>
      )}

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card>
            <CardHeader><CardTitle>Perfil del Salon</CardTitle></CardHeader>
            <CardContent className="space-y-4">

              <Input placeholder="Nombre" value={form.nombre || ""} onChange={(e)=>setForm({...form, nombre: e.target.value})} />
              <Input placeholder="Direccion" value={form.direccion || ""} onChange={(e)=>setForm({...form, direccion: e.target.value})} />
              <Input placeholder="Telefono" value={form.telefono || ""} onChange={(e)=>setForm({...form, telefono: e.target.value})} />
              <Input placeholder="Descripcion" value={form.descripcion || ""} onChange={(e)=>setForm({...form, descripcion: e.target.value})} />

              <div className="grid grid-cols-2 gap-3">
                <Input type="time" value={form.horario_apertura || "09:00"} onChange={(e)=>setForm({...form, horario_apertura: e.target.value})} />
                <Input type="time" value={form.horario_cierre || "20:00"} onChange={(e)=>setForm({...form, horario_cierre: e.target.value})} />
              </div>

              <Button onClick={guardarPerfil}>Guardar cambios</Button>

              {perfil?.imagen && <img src={`http://localhost/citasbelleza/${perfil.imagen}`} className="w-48 rounded" />}

              <div className="flex gap-2">
                <Input type="file" onChange={(e)=>setFoto(e.target.files?.[0] || null)} />
                <Button onClick={subirFoto}>Subir Foto</Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
