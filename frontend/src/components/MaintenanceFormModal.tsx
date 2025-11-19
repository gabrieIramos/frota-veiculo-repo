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
import { Maintenance } from "./MaintenanceTable";
import { Vehicle } from "./VehicleTable";

interface MaintenanceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (maintenance: any) => Promise<void>;
  editingMaintenance?: Maintenance | null;
  vehicles: Vehicle[];
  loading?: boolean;
}

export function MaintenanceFormModal({
  open,
  onOpenChange,
  onSubmit,
  editingMaintenance,
  vehicles,
  loading = false,
}: MaintenanceFormModalProps) {
  const [formData, setFormData] = useState({
    veiculoId: "",
    tipo: "",
    dataEntrada: "",
    dataPrevistaSaida: "",
    preco: "",
    descricao: "",
    oficina: "",
    status: "EM_ANDAMENTO",
  });

  useEffect(() => {
    if (editingMaintenance) {
      setFormData({
        veiculoId: editingMaintenance.veiculoId.toString(),
        tipo: editingMaintenance.tipo || "",
        dataEntrada: editingMaintenance.dataEntrada ? editingMaintenance.dataEntrada.split('T')[0] : "",
        dataPrevistaSaida: editingMaintenance.dataPrevistaSaida ? editingMaintenance.dataPrevistaSaida.split('T')[0] : "",
        preco: editingMaintenance.preco ? editingMaintenance.preco.toString() : "",
        descricao: editingMaintenance.descricao || "",
        oficina: editingMaintenance.oficina || "",
        status: editingMaintenance.status || "EM_ANDAMENTO",
      });
    } else {
      setFormData({
        veiculoId: "",
        tipo: "",
        dataEntrada: "",
        dataPrevistaSaida: "",
        preco: "",
        descricao: "",
        oficina: "",
        status: "EM_ANDAMENTO",
      });
    }
  }, [editingMaintenance, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    const prepared = {
      ...formData,
      veiculoId: parseInt(formData.veiculoId),
      preco: parseFloat(formData.preco),
    } as any;

    try {
      if (editingMaintenance) {
        await onSubmit({ ...prepared, id: editingMaintenance.id });
      } else {
        await onSubmit(prepared);
      }
    } catch (err) {
      console.error("Erro ao submeter formulário:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!loading) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="w-full h-full sm:h-auto sm:max-w-[500px] sm:max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingMaintenance ? "Editar Manutenção" : "Cadastrar Nova Manutenção"}
          </DialogTitle>
          <DialogDescription>
            {editingMaintenance
              ? "Atualize as informações da manutenção abaixo."
              : "Preencha os dados da manutenção para cadastrá-la no sistema."}
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
                disabled={!!editingMaintenance}
              >
                <SelectTrigger id="veiculoId">
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.length === 0 ? (
                    <SelectItem value="" disabled>Nenhum veículo disponível</SelectItem>
                  ) : (
                    vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.modelo} - {vehicle.fabricante}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Input
                id="tipo"
                placeholder="Ex: Revisão, Reparo, Troca de óleo"
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dataEntrada">Data de Entrada</Label>
              <Input
                id="dataEntrada"
                type="date"
                value={formData.dataEntrada}
                onChange={(e) =>
                  setFormData({ ...formData, dataEntrada: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dataPrevistaSaida">Data Prevista de Saída</Label>
              <Input
                id="dataPrevistaSaida"
                type="date"
                value={formData.dataPrevistaSaida}
                onChange={(e) =>
                  setFormData({ ...formData, dataPrevistaSaida: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.preco}
                onChange={(e) =>
                  setFormData({ ...formData, preco: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="oficina">Oficina</Label>
              <Input
                id="oficina"
                placeholder="Nome da oficina"
                value={formData.oficina}
                onChange={(e) =>
                  setFormData({ ...formData, oficina: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição da manutenção"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
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
                  <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                  <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4 mt-auto bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : editingMaintenance ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

