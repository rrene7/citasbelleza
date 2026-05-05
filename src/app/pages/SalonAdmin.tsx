import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

export default function SalonAdmin() {
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost/citasbelleza/api/salon-admin/perfil.php", { credentials: "include" })
      .then(r => r.json())
      .then(setPerfil);
  }, []);

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
            <CardHeader>
              <CardTitle>Perfil del Salon</CardTitle>
            </CardHeader>
            <CardContent>
              {perfil ? (
                <div>
                  <p><b>Nombre:</b> {perfil.nombre}</p>
                  <p><b>Direccion:</b> {perfil.direccion}</p>
                  <p><b>Telefono:</b> {perfil.telefono}</p>
                </div>
              ) : "Cargando..."}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicios">
          <Card><CardContent>CRUD de servicios (proximo)</CardContent></Card>
        </TabsContent>

        <TabsContent value="trabajadores">
          <Card><CardContent>CRUD de trabajadores (proximo)</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
