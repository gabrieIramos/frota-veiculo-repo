import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Vehicle } from "./VehicleTable";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{vehicle.modelo}</span>
              <Badge 
                variant={vehicle.tipoVeiculo === "CARRO" ? "default" : "secondary"}
                className={vehicle.tipoVeiculo === "CARRO" ? "bg-primary" : "bg-accent text-accent-foreground"}
              >
                {vehicle.tipoVeiculo}
              </Badge>
            </div>
            <p className="text-muted-foreground">{vehicle.fabricante}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(vehicle)}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(vehicle.id)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-muted-foreground">Ano</p>
            <p>{vehicle.ano}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Preço</p>
            <p>{formatPrice(vehicle.preco)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Status</p>
            <div className="flex items-center gap-1">
              {vehicle.status === "DISPONÍVEL" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Disponível</span>
                </>
              ) : vehicle.status === "ALUGADO" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-600">Alugado</span>
                </>
              ) : vehicle.status === "MANUTENÇÃO" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-600">Manutenção</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">Indisponível</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
