import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Slider } from "@/app/components/ui/slider";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/app/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  servicios: string[];
  calificacionMin: number;
  precioMax: number;
  disponibleHoy: boolean;
}

const serviciosDisponibles = [
  "Corte", "Coloración", "Peinados", "Tratamientos", 
  "Manicure", "Pedicure", "Faciales", "Masajes",
  "Balayage", "Keratina", "Extensiones", "Depilación"
];

export function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    servicios: [],
    calificacionMin: 0,
    precioMax: 200,
    disponibleHoy: false
  });

  const handleServiceToggle = (servicio: string) => {
    const newServicios = filters.servicios.includes(servicio)
      ? filters.servicios.filter(s => s !== servicio)
      : [...filters.servicios, servicio];
    
    const newFilters = { ...filters, servicios: newServicios };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCalificacionChange = (value: number[]) => {
    const newFilters = { ...filters, calificacionMin: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePrecioChange = (value: number[]) => {
    const newFilters = { ...filters, precioMax: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDisponibilidadToggle = () => {
    const newFilters = { ...filters, disponibleHoy: !filters.disponibleHoy };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const newFilters = {
      servicios: [],
      calificacionMin: 0,
      precioMax: 200,
      disponibleHoy: false
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFiltersCount = 
    filters.servicios.length + 
    (filters.calificacionMin > 0 ? 1 : 0) + 
    (filters.precioMax < 200 ? 1 : 0) +
    (filters.disponibleHoy ? 1 : 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtros Avanzados
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros Avanzados</SheetTitle>
          <SheetDescription>
            Refina tu búsqueda de salones de belleza
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={handleClearFilters}
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serviciosDisponibles.map((servicio) => (
                  <div key={servicio} className="flex items-center space-x-2">
                    <Checkbox
                      id={servicio}
                      checked={filters.servicios.includes(servicio)}
                      onCheckedChange={() => handleServiceToggle(servicio)}
                    />
                    <label
                      htmlFor={servicio}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {servicio}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Calificación Mínima</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {filters.calificacionMin === 0 ? 'Todas' : `${filters.calificacionMin}+ estrellas`}
                </span>
                <span className="text-sm font-medium">{filters.calificacionMin.toFixed(1)}</span>
              </div>
              <Slider
                value={[filters.calificacionMin]}
                onValueChange={handleCalificacionChange}
                min={0}
                max={5}
                step={0.5}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Precio Máximo por Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Hasta ${filters.precioMax}
                </span>
                <span className="text-sm font-medium">${filters.precioMax}</span>
              </div>
              <Slider
                value={[filters.precioMax]}
                onValueChange={handlePrecioChange}
                min={0}
                max={200}
                step={10}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disponibleHoy"
                  checked={filters.disponibleHoy}
                  onCheckedChange={handleDisponibilidadToggle}
                />
                <label
                  htmlFor="disponibleHoy"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Solo salones con disponibilidad hoy
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="pt-4">
            <p className="text-xs text-muted-foreground">
              {activeFiltersCount === 0 
                ? "No hay filtros activos" 
                : `${activeFiltersCount} filtro${activeFiltersCount !== 1 ? 's' : ''} activo${activeFiltersCount !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
