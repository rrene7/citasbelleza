import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Star, MapPin, Phone, Clock } from "lucide-react";
import { Salon } from "@/types";
import { useNavigate } from "react-router-dom";

interface SalonCardProps {
  salon: Salon;
}

export function SalonCard({ salon }: SalonCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/salon/${salon.id}`)}>
      <div className="aspect-video overflow-hidden">
        <img 
          src={salon.imagen} 
          alt={salon.nombre}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{salon.nombre}</CardTitle>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{salon.calificacion}</span>
          </div>
        </div>
        <CardDescription>{salon.descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{salon.direccion}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{salon.telefono}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{salon.horarioApertura} - {salon.horarioCierre}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {salon.servicios.map((servicio, index) => (
            <Badge key={index} variant="secondary">{servicio}</Badge>
          ))}
        </div>
        
        <Button className="w-full" onClick={(e) => {
          e.stopPropagation();
          navigate(`/salon/${salon.id}`);
        }}>
          Ver Detalles y Agendar
        </Button>
      </CardContent>
    </Card>
  );
}
