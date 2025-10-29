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
  tipoVeiculo: "CARRO" | "MOTO";
  modelo: string;
  fabricante: string;
  ano: number;
  preco: number;
  cilindrada?: number;
  tipoCombustivel?: string;
  quantidadePortas?: number;
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

                <TableCell>
                  <Badge
                    variant={vehicle.tipoVeiculo === "CARRO" ? "default" : "secondary"}
                    className={vehicle.tipoVeiculo === "CARRO" ? "bg-primary" : "bg-accent text-accent-foreground"}
                  >
                    {vehicle.tipoVeiculo}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.modelo}</TableCell>
                <TableCell>{vehicle.fabricante}</TableCell>
                <TableCell>{vehicle.ano}</TableCell>
                <TableCell>{formatPrice(vehicle.preco)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-success">Ativo</span>
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
