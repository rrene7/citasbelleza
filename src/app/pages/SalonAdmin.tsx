import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function SalonAdmin() {
  const [perfil, setPerfil] = useState<any>(null);
  const [foto, setFoto] = useState<File | null>(null);

  const cargarDatos = async () => {
    const perfilRes = await fetch("http://localhost/citasbelleza/api/salon-admin/perfil.php", { credentials: "include" });
    setPerfil(await perfilRes.json());
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card>
            <CardHeader><CardTitle>Perfil</CardTitle></CardHeader>
            <CardContent>
              {perfil && (
                <div className="space-y-4">
                  <p>{perfil.nombre}</p>
                  <p>{perfil.direccion}</p>
                  {perfil.imagen && <img src={`http://localhost/citasbelleza/${perfil.imagen}`} className="w-48 rounded" />}

                  <div className="flex gap-2">
                    <Input type="file" onChange={(e)=>setFoto(e.target.files?.[0] || null)} />
                    <Button onClick={subirFoto}>Subir Foto</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
