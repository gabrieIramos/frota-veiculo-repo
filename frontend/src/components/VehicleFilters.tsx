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
    status?: string;
    quantidadePortas?: string;
    tipoCombustivel?: string;
    cilindrada?: string;
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

  const mergedFilters = {
    type: filters?.type ?? "all",
    manufacturer: filters?.manufacturer ?? "",
    yearFrom: filters?.yearFrom ?? "",
    yearTo: filters?.yearTo ?? "",
    status: filters?.status ?? "",
    quantidadePortas: filters?.quantidadePortas ?? "",
    tipoCombustivel: filters?.tipoCombustivel ?? "",
    cilindrada: filters?.cilindrada ?? "",
  };

  const hasActiveFilters =
    (mergedFilters.type && mergedFilters.type !== "all") ||
    !!mergedFilters.manufacturer ||
    !!mergedFilters.yearFrom ||
    !!mergedFilters.yearTo ||
    !!mergedFilters.status;

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
                value={mergedFilters.type}
                onValueChange={(value: string) =>
                  onFilterChange({ ...mergedFilters, type: value })
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
                value={mergedFilters.manufacturer}
                onChange={(e) =>
                  onFilterChange({ ...mergedFilters, manufacturer: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-year-from">Ano (De)</Label>
              <Input
                id="filter-year-from"
                type="number"
                placeholder="2000"
                value={mergedFilters.yearFrom}
                onChange={(e) =>
                  onFilterChange({ ...mergedFilters, yearFrom: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-year-to">Ano (Até)</Label>
              <Input
                id="filter-year-to"
                type="number"
                placeholder={new Date().getFullYear().toString()}
                value={mergedFilters.yearTo}
                onChange={(e) =>
                  onFilterChange({ ...mergedFilters, yearTo: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select
                value={mergedFilters.status || ""}
                onValueChange={(value: string) =>
                  onFilterChange({ ...mergedFilters, status: value })
                }
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="DISPONÍVEL">Disponível</SelectItem>
                  <SelectItem value="ALUGADO">Alugado</SelectItem>
                  <SelectItem value="MANUTENÇÃO">Manutenção</SelectItem>
                  <SelectItem value="INDISPONÍVEL">Indisponível</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campos específicos por tipo */}
            {mergedFilters.type === "CARRO" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="filter-quantidade-portas">Quantidade de Portas</Label>
                  <Input
                    id="filter-quantidade-portas"
                    type="number"
                    min={1}
                    max={8}
                    placeholder="4"
                    value={mergedFilters.quantidadePortas || ""}
                    onChange={(e) =>
                      onFilterChange({ ...mergedFilters, quantidadePortas: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="filter-tipo-combustivel">Tipo de Combustível</Label>
                  <Select
                    value={mergedFilters.tipoCombustivel || ""}
                      onValueChange={(value: string) =>
                        onFilterChange({ ...mergedFilters, tipoCombustivel: value })
                      }
                  >
                    <SelectTrigger id="filter-tipo-combustivel">
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Qualquer</SelectItem>
                        <SelectItem value="GASOLINA">Gasolina</SelectItem>
                        <SelectItem value="ETANOL">Etanol</SelectItem>
                        <SelectItem value="DIESEL">Diesel</SelectItem>
                        <SelectItem value="FLEX">Flex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {mergedFilters.type === "MOTO" && (
              <div className="grid gap-2">
                <Label htmlFor="filter-cilindrada">Cilindrada mínima (cc)</Label>
                <Input
                  id="filter-cilindrada"
                  type="number"
                  min={0}
                  placeholder="150"
                  value={mergedFilters.cilindrada || ""}
                  onChange={(e) =>
                    onFilterChange({ ...mergedFilters, cilindrada: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
