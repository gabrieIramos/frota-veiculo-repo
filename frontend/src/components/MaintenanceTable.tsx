import { Pencil, Trash2, CheckCircle2, Clock } from "lucide-react";
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

export interface Maintenance {
  id: number;
  veiculoId: number;
  veiculoModelo: string;
  veiculoFabricante: string;
  tipo: string;
  dataEntrada: string;
  dataPrevistaSaida: string;
  preco: number;
  descricao?: string;
  oficina: string;
  status: string;
  usuarioId: number;
}

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  onEdit: (maintenance: Maintenance) => void;
  onDelete: (id: number) => void;
  onFinalize: (id: number) => void;
}

export function MaintenanceTable({ maintenances, onEdit, onDelete, onFinalize }: MaintenanceTableProps) {
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
            <TableHead>Tipo</TableHead>
            <TableHead>Data Entrada</TableHead>
            <TableHead>Data Prevista Saída</TableHead>
            <TableHead>Oficina</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground h-32">
                Nenhuma manutenção cadastrada. Clique em "Cadastrar Nova Manutenção" para começar.
              </TableCell>
            </TableRow>
          ) : (
            maintenances.map((maintenance, index) => (
              <TableRow 
                key={maintenance.id}
                className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{maintenance.veiculoModelo}</div>
                    <div className="text-sm text-muted-foreground">{maintenance.veiculoFabricante}</div>
                  </div>
                </TableCell>
                <TableCell>{maintenance.tipo}</TableCell>
                <TableCell>{formatDate(maintenance.dataEntrada)}</TableCell>
                <TableCell>{formatDate(maintenance.dataPrevistaSaida)}</TableCell>
                <TableCell>{maintenance.oficina}</TableCell>
                <TableCell>{formatPrice(maintenance.preco)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {maintenance.status === "EM_ANDAMENTO" ? (
                      <>
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-600">Em Andamento</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Finalizada</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {maintenance.status === "EM_ANDAMENTO" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFinalize(maintenance.id)}
                        className="h-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                      >
                        Finalizar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(maintenance)}
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(maintenance.id)}
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

