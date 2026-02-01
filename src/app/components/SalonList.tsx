import { useState } from "react";
import { salones } from "@/data/mockData";
import { SalonCard } from "./SalonCard";
import { AdvancedFilters, FilterState } from "./AdvancedFilters";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";

export function SalonList() {
  const [searchTerm, setSearchTerm] = useState("");
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
      <div className="mb-8">
        <h1 className="mb-2">Encuentra tu Salón de Belleza Ideal</h1>
        <p className="text-muted-foreground mb-6">
          Descubre los mejores salones de belleza y agenda tu cita con profesionales expertos
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
    </div>
  );
}