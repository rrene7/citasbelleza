import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Star, MapPin, Phone, Clock, ArrowLeft } from "lucide-react";
import { BookingModal } from "@/app/components/BookingModal";
import { api, normalizarSalon, normalizarTrabajador } from "@/services/api";

export function SalonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const salonId = Number(id);
  const [salon, setSalon] = useState<any>(null);
  const [trabajadores, setTrabajadores] = useState<any[]>([]);
  const [selectedTrabajador, setSelectedTrabajador] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const [salonesData, trabajadoresData] = await Promise.all([
          api.salones(),
          api.trabajadores(salonId)
        ]);
        const encontrado = salonesData.map(normalizarSalon).find((s) => s.id === salonId);
        setSalon(encontrado || null);
        setTrabajadores(trabajadoresData.map(normalizarTrabajador));
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [salonId]);

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando salon...</div>;
  if (!salon) return <div className="container mx-auto px-4 py-8">Salon no encontrado</div>;

  return (
    <div>
      <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: `url(${salon.imagen?.startsWith("uploads/") ? `http://localhost/citasbelleza/${salon.imagen}` : salon.imagen})` }}>
        <div className="absolute inset-0 bg-black/45" />
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-8 text-white">
          <Button variant="ghost" className="w-fit mb-4 text-white" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button>
          <h1>{salon.nombre}</h1>
          <div className="flex flex-wrap gap-4 text-sm mt-2">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{salon.calificacion}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{salon.direccion}</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{salon.telefono}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{salon.horarioApertura} - {salon.horarioCierre}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profesionales">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profesionales">Profesionales</TabsTrigger>
            <TabsTrigger value="info">Informacion</TabsTrigger>
          </TabsList>

          <TabsContent value="profesionales" className="mt-8">
            <h2 className="mb-6">Nuestro Equipo de Profesionales</h2>
            {trabajadores.length === 0 && <p className="text-muted-foreground">Este salon aun no tiene trabajadores registrados.</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trabajadores.map((trabajador) => (
                <Card key={trabajador.id} className="overflow-hidden">
                  <img src={trabajador.imagen?.startsWith("uploads/") ? `http://localhost/citasbelleza/${trabajador.imagen}` : trabajador.imagen} className="w-full h-64 object-cover" />
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{trabajador.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{trabajador.especialidad}</p>
                      </div>
                      <span className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{trabajador.calificacion}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{trabajador.experiencia}</p>
                    <Button className="w-full" onClick={() => setSelectedTrabajador(trabajador)}>Agendar Cita</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-8">
            <Card><CardContent className="p-6"><p>{salon.descripcion}</p></CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedTrabajador && <BookingModal isOpen={!!selectedTrabajador} onClose={() => setSelectedTrabajador(null)} salon={salon} trabajador={selectedTrabajador} />}
    </div>
  );
}
