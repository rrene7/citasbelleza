import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Review {
  id: number;
  clienteNombre: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

interface ReviewSectionProps {
  salonId: number;
  trabajadorId?: number;
}

// Datos de ejemplo de reseñas
const reviewsEjemplo: Review[] = [
  {
    id: 1,
    clienteNombre: "María López",
    calificacion: 5,
    comentario: "Excelente servicio, muy profesionales y el resultado quedó hermoso. Definitivamente volveré.",
    fecha: "2026-01-28"
  },
  {
    id: 2,
    clienteNombre: "Carlos Ramírez",
    calificacion: 5,
    comentario: "La mejor experiencia en un salón. El equipo es muy atento y conocen perfectamente su trabajo.",
    fecha: "2026-01-25"
  },
  {
    id: 3,
    clienteNombre: "Ana Martínez",
    calificacion: 4,
    comentario: "Muy buen servicio, ambiente agradable. Solo tuve que esperar un poco más de lo esperado.",
    fecha: "2026-01-20"
  },
  {
    id: 4,
    clienteNombre: "Jorge Silva",
    calificacion: 5,
    comentario: "Increíble transformación! Superó mis expectativas. Personal muy capacitado.",
    fecha: "2026-01-15"
  }
];

export function ReviewSection({ salonId, trabajadorId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(reviewsEjemplo);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (calificacion === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    if (!comentario.trim()) {
      toast.error("Por favor escribe un comentario");
      return;
    }

    const nuevaReview: Review = {
      id: reviews.length + 1,
      clienteNombre: "Usuario Actual", // En producción vendría del sistema de autenticación
      calificacion,
      comentario,
      fecha: new Date().toISOString().split('T')[0]
    };

    setReviews([nuevaReview, ...reviews]);
    toast.success("¡Gracias por tu reseña!");
    
    setCalificacion(0);
    setComentario("");
    setIsDialogOpen(false);
  };

  const promedioCalificacion = reviews.reduce((acc, r) => acc + r.calificacion, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calificaciones y Reseñas</CardTitle>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{promedioCalificacion.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">
                  {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
                </span>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Escribir Reseña
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Escribe tu Reseña</DialogTitle>
                  <DialogDescription>
                    Comparte tu experiencia con otros clientes
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Calificación</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCalificacion(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || calificacion)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Comentario</label>
                    <Textarea
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Cuéntanos sobre tu experiencia..."
                      rows={5}
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Publicar Reseña
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{review.clienteNombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(review.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.calificacion
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground">{review.comentario}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
