import { Filter, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";

interface VehicleFiltersProps {
  filters: {
    type: string;
    manufacturer: string;
    yearFrom: string;
    yearTo: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function VehicleFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: VehicleFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.type || filters.manufacturer || filters.yearFrom || filters.yearTo;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avançados
            {hasActiveFilters && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                •
              </span>
            )}
          </Button>
        </CollapsibleTrigger>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>
      <CollapsibleContent className="mt-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="filter-type">Tipo de Veículo</Label>
              <Select
                value={filters.type}
                onValueChange={(value: any) =>
                  onFilterChange({ ...filters, type: value })
                }
              >
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="CARRO">Carro</SelectItem>
                  <SelectItem value="MOTO">Moto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-manufacturer">Fabricante</Label>
              <Input
                id="filter-manufacturer"
                placeholder="Ex: Honda, Toyota"
                value={filters.manufacturer}
                onChange={(e) =>
                  onFilterChange({ ...filters, manufacturer: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-year-from">Ano (De)</Label>
              <Input
                id="filter-year-from"
                type="number"
                placeholder="2000"
                value={filters.yearFrom}
                onChange={(e) =>
                  onFilterChange({ ...filters, yearFrom: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-year-to">Ano (Até)</Label>
              <Input
                id="filter-year-to"
                type="number"
                placeholder={new Date().getFullYear().toString()}
                value={filters.yearTo}
                onChange={(e) =>
                  onFilterChange({ ...filters, yearTo: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
