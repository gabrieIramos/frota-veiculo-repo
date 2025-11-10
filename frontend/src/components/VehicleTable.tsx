import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

export interface Vehicle {
  id: string;
  plate: string;
  type: "Carro" | "Moto";
  model: string;
  manufacturer: string;
  year: number;
  price: number;
  status: "Ativo" | "Inativo";
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export function VehicleTable({ vehicles, onEdit, onDelete }: VehicleTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Placa</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Fabricante</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground h-32">
                Nenhum veículo cadastrado. Clique em "Cadastrar Novo Veículo" para começar.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle, index) => (
              <TableRow 
                key={vehicle.id}
                className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <TableCell>{vehicle.plate}</TableCell>
                <TableCell>
                  <Badge 
                    variant={vehicle.type === "Carro" ? "default" : "secondary"}
                    className={vehicle.type === "Carro" ? "bg-primary" : "bg-accent text-accent-foreground"}
                  >
                    {vehicle.type}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.manufacturer}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{formatPrice(vehicle.price)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {vehicle.status === "Ativo" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-success">Ativo</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Inativo</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
