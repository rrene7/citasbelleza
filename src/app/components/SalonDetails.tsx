import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, MapPin, Phone, Clock, ArrowLeft, Calendar } from "lucide-react";
import { BookingModal } from "./BookingModal";
import { ReviewSection } from "./ReviewSection";
import { Trabajador } from "@/types";
import { salones, servicios, trabajadores } from "@/data/mockData";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
export function SalonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const salon = salones.find(s => s.id === Number(id));
  const trabajadoresSalon = trabajadores.filter(t => t.salonId === Number(id));

  if (!salon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Salón no encontrado</p>
        <Button onClick={() => navigate("/")}>Volver al inicio</Button>
      </div>
    );
  }

  const handleReservar = (trabajador: Trabajador) => {
    setSelectedTrabajador(trabajador);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={salon.imagen} 
          alt={salon.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <Button 
            variant="ghost" 
            className="mb-4 text-white hover:bg-white/20"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="mb-2">{salon.nombre}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{salon.calificacion}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{salon.direccion}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{salon.telefono}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{salon.horarioApertura} - {salon.horarioCierre}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="trabajadores" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="trabajadores">Profesionales</TabsTrigger>
            <TabsTrigger value="info">Información</TabsTrigger>
          </TabsList>

          <TabsContent value="trabajadores" className="mt-6">
            <h2 className="mb-6">Nuestro Equipo de Profesionales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trabajadoresSalon.map((trabajador) => (
                <Card key={trabajador.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={trabajador.imagen} 
                      alt={trabajador.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{trabajador.nombre}</CardTitle>
                        <CardDescription>{trabajador.especialidad}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{trabajador.calificacion}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{trabajador.experiencia}</p>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Disponibilidad:</p>
                      <div className="flex flex-wrap gap-1">
                        {trabajador.disponibilidad.map((dia, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {dia}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleReservar(trabajador)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Cita
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre Nosotros</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{salon.descripcion}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{salon.direccion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{salon.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{salon.horarioApertura} - {salon.horarioCierre}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Servicios Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {servicios.slice(0, 6).map((servicio) => (
                      <div key={servicio.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{servicio.nombre}</p>
                          <p className="text-sm text-muted-foreground">{servicio.duracion} min</p>
                        </div>
                        <p className="font-semibold">${servicio.precio}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <ReviewSection salonId={salon.id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedTrabajador && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedTrabajador(null);
          }}
          salon={salon}
          trabajador={selectedTrabajador}
        />
      )}
    </div>
  );
}