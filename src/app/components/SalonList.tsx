import { useState } from "react";
import { salones } from "@/data/mockData";
import { SalonCard } from "./SalonCard";
import { AdvancedFilters, FilterState } from "./AdvancedFilters";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Search } from "lucide-react";

export function SalonList() {
  const whatsappMessage = encodeURIComponent(
    "Hola, quiero publicar mi salón en Citas Belleza Panamá y recibir más reservas."
  );
  const whatsappUrl = `https://wa.me/50762730591?text=${whatsappMessage}`;
  const [searchTerm, setSearchTerm] = useState("");
  const [leadNombre, setLeadNombre] = useState("");
  const [leadSalon, setLeadSalon] = useState("");
  const [leadTelefono, setLeadTelefono] = useState("");
  const [leadCiudad, setLeadCiudad] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    servicios: [],
    calificacionMin: 0,
    precioMax: 200,
    disponibleHoy: false
  });

  const filteredSalones = salones.filter(salon => {
    // Búsqueda por texto
    const matchesSearch = 
      salon.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.servicios.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtro de servicios
    const matchesServicios = filters.servicios.length === 0 ||
      filters.servicios.some(s => salon.servicios.includes(s));

    // Filtro de calificación
    const matchesCalificacion = salon.calificacion >= filters.calificacionMin;

    return matchesSearch && matchesServicios && matchesCalificacion;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
          <div>
            <h1 className="mb-3">Citas Belleza Panamá</h1>
            <p className="text-muted-foreground mb-5">
              Ayudamos a los salones a llenar su agenda con reservas online, recordatorios y pagos
              simples por Yappy o efectivo.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  Quiero publicar mi salón
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#planes">Ver planes</a>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Reserva en minutos</CardTitle>
              <CardDescription>
                Encuentra profesionales, compara servicios y agenda sin llamadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              + Menos no-shows · + Clientes · + Control total de citas
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="planes" className="mb-12">
        <h2 className="mb-2">Planes para salones</h2>
        <p className="text-muted-foreground mb-6">
          Lanza tu agenda online con todo lo esencial desde el primer día.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Básico</CardTitle>
              <CardDescription>Ideal para 1 salón pequeño o mediano</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Reservas online 24/7</p>
              <p>• Panel de citas y clientes</p>
              <p>• Recordatorios por email</p>
              <p>• Pago en salón</p>
              <div className="pt-3">
                <Button asChild className="w-full">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    Empezar por WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Para salones que quieren crecer rápido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Todo lo del Básico</p>
              <p>• Confirmación por WhatsApp</p>
              <p>• Pago con Yappy</p>
              <p>• Reportes y métricas</p>
              <div className="pt-3">
                <Button asChild className="w-full">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    Quiero el plan Pro
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="contacto" className="mb-12">
        <h2 className="mb-2">¿Quieres publicar tu salón?</h2>
        <p className="text-muted-foreground mb-6">
          Déjanos tus datos y te contactamos por WhatsApp.
        </p>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Formulario rápido</CardTitle>
            <CardDescription>Te respondemos en el mismo día.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const msg = [
                  "Hola, quiero publicar mi salón en Citas Belleza Panamá.",
                  leadNombre ? `Nombre: ${leadNombre}` : "",
                  leadSalon ? `Salón: ${leadSalon}` : "",
                  leadTelefono ? `Teléfono: ${leadTelefono}` : "",
                  leadCiudad ? `Ciudad: ${leadCiudad}` : ""
                ]
                  .filter(Boolean)
                  .join(" | ");
                const url = `https://wa.me/50762730591?text=${encodeURIComponent(msg)}`;
                window.open(url, "_blank");
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lead-nombre">Nombre</label>
                <Input
                  id="lead-nombre"
                  value={leadNombre}
                  onChange={(e) => setLeadNombre(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lead-salon">Nombre del salón</label>
                <Input
                  id="lead-salon"
                  value={leadSalon}
                  onChange={(e) => setLeadSalon(e.target.value)}
                  placeholder="Ej. Estudio Belleza"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lead-telefono">Teléfono</label>
                <Input
                  id="lead-telefono"
                  value={leadTelefono}
                  onChange={(e) => setLeadTelefono(e.target.value)}
                  placeholder="+507 6000-0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lead-ciudad">Ciudad</label>
                <Input
                  id="lead-ciudad"
                  value={leadCiudad}
                  onChange={(e) => setLeadCiudad(e.target.value)}
                  placeholder="Panamá"
                />
              </div>
              <div className="md:col-span-2 pt-2">
                <Button type="submit" className="w-full">
                  Enviar por WhatsApp
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="mb-2">Encuentra tu Salon de Belleza Ideal</h2>
        <p className="text-muted-foreground mb-6">
          Descubre los mejores salones de belleza y agenda tu cita con profesionales expertos.
        </p>
        
        <div className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar salones o servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <AdvancedFilters onFilterChange={setFilters} />
        </div>

        {(filters.servicios.length > 0 || filters.calificacionMin > 0 || filters.precioMax < 200) && (
          <div className="mt-4 text-sm text-muted-foreground">
            Mostrando {filteredSalones.length} resultado{filteredSalones.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalones.map((salon) => (
          <SalonCard key={salon.id} salon={salon} />
        ))}
      </div>

      {filteredSalones.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron salones que coincidan con tu búsqueda</p>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-emerald-500 text-white px-4 py-3 shadow-lg hover:bg-emerald-600"
        aria-label="WhatsApp"
      >
        WhatsApp
      </a>
    </div>
  );
}
