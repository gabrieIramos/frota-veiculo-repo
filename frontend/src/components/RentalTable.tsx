import { Pencil, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
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

export interface Rental {
  id: number;
  veiculoId: number;
  veiculoModelo: string;
  veiculoFabricante: string;
  cliente: string;
  dataRetirada: string;
  dataDevolucao: string;
  valor: number;
  observacoes?: string;
  status: string;
  usuarioId: number;
}

interface RentalTableProps {
  rentals: Rental[];
  onEdit: (rental: Rental) => void;
  onDelete: (id: number) => void;
  onFinalize: (id: number) => void;
}

export function RentalTable({ rentals, onEdit, onDelete, onFinalize }: RentalTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      if (/T/.test(dateString)) {
        const d = new Date(dateString);
        if (!isNaN(d.getTime())) return d.toLocaleDateString('pt-BR');
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [y, m, d] = dateString.split('-').map(Number);
        const dd = new Date(y, (m || 1) - 1, d || 1);
        if (!isNaN(dd.getTime())) return dd.toLocaleDateString('pt-BR');
      }
    } catch {}
    return dateString;
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Veículo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data Retirada</TableHead>
            <TableHead>Data Devolução</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                Nenhum aluguel cadastrado. Clique em "Cadastrar Novo Aluguel" para começar.
              </TableCell>
            </TableRow>
          ) : (
            rentals.map((rental, index) => (
              <TableRow 
                key={rental.id}
                className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{rental.veiculoModelo}</div>
                    <div className="text-sm text-muted-foreground">{rental.veiculoFabricante}</div>
                  </div>
                </TableCell>
                <TableCell>{rental.cliente}</TableCell>
                <TableCell>{formatDate(rental.dataRetirada)}</TableCell>
                <TableCell>{formatDate(rental.dataDevolucao)}</TableCell>
                <TableCell>{formatPrice(rental.valor)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {rental.status === "ATIVO" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Ativo</span>
                      </>
                    ) : rental.status === "FINALIZADO" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-600">Finalizado</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Atrasado</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {rental.status === "ATIVO" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFinalize(rental.id)}
                        className="h-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Finalizar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(rental)}
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(rental.id)}
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

