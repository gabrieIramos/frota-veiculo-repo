import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Rental } from "./RentalTable";
import { Vehicle } from "./VehicleTable";

interface RentalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rental: any) => void;
  editingRental?: Rental | null;
  vehicles: Vehicle[];
}

export function RentalFormModal({
  open,
  onOpenChange,
  onSubmit,
  editingRental,
  vehicles,
}: RentalFormModalProps) {
  const [formData, setFormData] = useState({
    veiculoId: "",
    cliente: "",
    dataRetirada: "",
    dataDevolucao: "",
    valor: "",
    observacoes: "",
    status: "ATIVO",
  });

  useEffect(() => {
    if (editingRental) {
      setFormData({
        veiculoId: editingRental.veiculoId.toString(),
        cliente: editingRental.cliente || "",
        dataRetirada: editingRental.dataRetirada ? editingRental.dataRetirada.split('T')[0] : "",
        dataDevolucao: editingRental.dataDevolucao ? editingRental.dataDevolucao.split('T')[0] : "",
        valor: editingRental.valor ? editingRental.valor.toString() : "",
        observacoes: editingRental.observacoes || "",
        status: editingRental.status || "ATIVO",
      });
    } else {
      setFormData({
        veiculoId: "",
        cliente: "",
        dataRetirada: "",
        dataDevolucao: "",
        valor: "",
        observacoes: "",
        status: "ATIVO",
      });
    }
  }, [editingRental, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.veiculoId) {
      alert("Selecione um veículo");
      return;
    }
    
    if (!formData.cliente || !formData.dataRetirada || !formData.dataDevolucao || !formData.valor) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const prepared = {
      ...formData,
      veiculoId: parseInt(formData.veiculoId),
      valor: parseFloat(formData.valor),
    } as any;

    if (editingRental) {
      onSubmit({ ...prepared, id: editingRental.id });
    } else {
      onSubmit(prepared);
    }
  };

  const availableVehicles = editingRental 
    ? vehicles 
    : vehicles.filter(v => v.status === "DISPONÍVEL");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full sm:h-auto sm:max-w-[500px] sm:max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingRental ? "Editar Aluguel" : "Cadastrar Novo Aluguel"}
          </DialogTitle>
          <DialogDescription>
            {editingRental
              ? "Atualize as informações do aluguel abaixo."
              : "Preencha os dados do aluguel para cadastrá-lo no sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid gap-4 py-4 overflow-y-auto pr-2 max-h-[calc(100vh-200px)] sm:max-h-[calc(90vh-200px)]">
            <div className="grid gap-2">
              <Label htmlFor="veiculoId">Veículo</Label>
              <Select
                value={formData.veiculoId}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, veiculoId: value })
                }
                disabled={!!editingRental}
              >
                <SelectTrigger id="veiculoId">
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.length === 0 ? (
                    <SelectItem value="" disabled>Nenhum veículo disponível</SelectItem>
                  ) : (
                    availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.modelo} - {vehicle.fabricante}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                placeholder="Nome do cliente"
                value={formData.cliente}
                onChange={(e) =>
                  setFormData({ ...formData, cliente: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dataRetirada">Data de Retirada</Label>
              <Input
                id="dataRetirada"
                type="date"
                value={formData.dataRetirada}
                onChange={(e) =>
                  setFormData({ ...formData, dataRetirada: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dataDevolucao">Data de Devolução</Label>
              <Input
                id="dataDevolucao"
                type="date"
                value={formData.dataDevolucao}
                onChange={(e) =>
                  setFormData({ ...formData, dataDevolucao: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({ ...formData, valor: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações sobre o aluguel"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                  <SelectItem value="ATRASADO">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4 mt-auto bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingRental ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

