import { useState, useEffect } from "react";
import { authFetch } from "../utils/api";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Vehicle } from "./VehicleTable";

interface VehicleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (vehicle: any) => Promise<void>;
  editingVehicle?: Vehicle | null;
  loading?: boolean;
}

export function VehicleFormModal({
  open,
  onOpenChange,
  onSubmit,
  editingVehicle,
  loading = false,
}: VehicleFormModalProps) {
  const [formData, setFormData] = useState({
    tipoVeiculo: "CARRO",
    modelo: "",
    fabricante: "",
    ano: new Date().getFullYear(),  
    preco: "",
    status: "DISPONÍVEL",    
    quantidadePortas: "",
    tipoCombustivel: "GASOLINA",
    cilindrada: "",
  });

  const [hasActiveRental, setHasActiveRental] = useState(false);
  const [hasActiveMaintenance, setHasActiveMaintenance] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        tipoVeiculo: editingVehicle.tipoVeiculo || "CARRO",
        modelo: editingVehicle.modelo || "",
        fabricante: editingVehicle.fabricante || "",
        ano: editingVehicle.ano || new Date().getFullYear(),                
        preco: editingVehicle.preco !== undefined ? String(Math.round(Number((editingVehicle as any).preco) * 100)) : "",
        status: editingVehicle.status || "DISPONÍVEL",
        quantidadePortas: editingVehicle.quantidadePortas !== undefined ? String(editingVehicle.quantidadePortas) : "",
        tipoCombustivel: editingVehicle.tipoCombustivel || "GASOLINA",
        cilindrada: editingVehicle.cilindrada !== undefined ? String(editingVehicle.cilindrada) : "",
      });
      // check if vehicle has active rental or maintenance
      (async () => {
        try {
          setHasActiveRental(false);
          setHasActiveMaintenance(false);
          if (!editingVehicle || editingVehicle.id == null) return;
          const rentRes = await authFetch(`${BACKEND_URL}/api/alugueis?veiculoId=${editingVehicle.id}`);
          if (rentRes.ok) {
            const rentData = await rentRes.json();
            if (Array.isArray(rentData)) {
              const active = rentData.some((r: any) => {
                const s = (r?.status || '').toUpperCase();
                return s === 'ATIVO' || s === 'ALUGADO' || s === 'EM_ANDAMENTO';
              });
              setHasActiveRental(active);
            }
          }
        } catch (err) {
          console.error('Erro ao checar aluguéis do veículo', err);
          setHasActiveRental(false);
        }

        try {
          if (!editingVehicle || editingVehicle.id == null) return;
          const mRes = await authFetch(`${BACKEND_URL}/api/manutencoes?veiculoId=${editingVehicle.id}`);
          if (mRes.ok) {
            const mData = await mRes.json();
            if (Array.isArray(mData)) {
              const activeM = mData.some((m: any) => {
                const s = (m?.status || '').toUpperCase();
                return s === 'EM_ANDAMENTO' || s === 'ATIVO' || s === 'MANUTENCAO';
              });
              setHasActiveMaintenance(activeM);
            }
          }
        } catch (err) {
          console.error('Erro ao checar manutenções do veículo', err);
          setHasActiveMaintenance(false);
        }
      })();
    } else {
      setFormData({
        tipoVeiculo: "CARRO",
        modelo: "",
        fabricante: "",
        ano: new Date().getFullYear(),
        preco: "",
        status: "DISPONÍVEL",
        quantidadePortas: "",
        tipoCombustivel: "GASOLINA",
        cilindrada: "",
      });
    }
  }, [editingVehicle, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    // Prevent changing status while the vehicle has active rental/maintenance
    if (editingVehicle) {
      const originalStatus = (editingVehicle.status || '').toString();
      if ((hasActiveRental || hasActiveMaintenance) && formData.status !== originalStatus) {
        toast.error('Não é possível alterar o status do veículo enquanto houver aluguel ou manutenção em andamento. Finalize-os antes.');
        return;
      }
    }
    const prepared = {
      ...formData,      
      preco: formData.preco === "" ? 0 : (parseInt(formData.preco as any, 10) || 0) / 100,
      quantidadePortas: formData.quantidadePortas === "" ? undefined : parseInt(formData.quantidadePortas as any),
      cilindrada: formData.cilindrada === "" ? undefined : parseInt(formData.cilindrada as any),
    } as any;

    try {
      if (editingVehicle) {
        await onSubmit({ ...prepared, id: editingVehicle.id });
      } else {
        await onSubmit(prepared);
      }
    } catch (err) {
      console.error("Erro ao submeter formulário:", err);
    }
  };
  
  const parseInputToRaw = (input: string) => {
    if (!input) return "";    
    const digits = input.replace(/\D/g, '');
    return digits;
  };

  const formatRawToDisplay = (raw: string) => {
    if (!raw) return '';
    const cents = parseInt(raw, 10) || 0;
    const n = cents / 100;
    if (isNaN(n)) return raw;
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  };

  return (
    <Dialog open={open} onOpenChange={(open: boolean) => {
      if (!loading) {
        onOpenChange(open);
      }
    }}>
  <DialogContent className="w-full h-full sm:h-auto sm:max-w-[500px] sm:max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingVehicle ? "Editar Veículo" : "Cadastrar Novo Veículo"}
          </DialogTitle>
          <DialogDescription>
            {editingVehicle
              ? "Atualize as informações do veículo abaixo."
              : "Preencha os dados do veículo para cadastrá-lo no sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid gap-4 py-4 overflow-y-auto pr-2 max-h-[calc(100vh-200px)] sm:max-h-[calc(90vh-200px)]">
            <div className="grid gap-2">
              <Label htmlFor="tipoVeiculo">Tipo de Veículo</Label>
              <Select
                value={formData.tipoVeiculo}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, tipoVeiculo: value })
                }
                disabled={!!editingVehicle}
              >
                <SelectTrigger id="tipoVeiculo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CARRO">Carro</SelectItem>
                  <SelectItem value="MOTO">Moto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                placeholder="Ex: Civic, CG 160"
                value={formData.modelo}
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fabricante">Fabricante</Label>
              <Input
                id="fabricante"
                placeholder="Ex: Honda, Toyota"
                value={formData.fabricante}
                onChange={(e) =>
                  setFormData({ ...formData, fabricante: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                min="1950"
                max={new Date().getFullYear() + 1}
                value={formData.ano}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setFormData({ ...formData, ano: isNaN(value) ? new Date().getFullYear() : value });
                }}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                type="text"
                min="0"
                step="0.01"
                placeholder="0.00"                
                value={formatRawToDisplay(formData.preco as string)}
                onChange={(e) => {                  
                  const raw = parseInputToRaw(e.target.value);
                  setFormData({ ...formData, preco: raw });
                }}
                required
              />
            </div>

            {formData.tipoVeiculo === "CARRO" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="quantidadePortas">Quantidade de Portas</Label>
                  <Input
                    id="quantidadePortas"
                    type="number"
                    min="1"
                    max="8"  
                    placeholder="0"                  
                    value={formData.quantidadePortas as any}
                    onChange={(e) => {
                      setFormData({ ...formData, quantidadePortas: e.target.value });
                    }}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tipoCombustivel">Tipo de Combustível</Label>
                  <Select
                    value={formData.tipoCombustivel}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, tipoCombustivel: value })
                    }
                  >
                    <SelectTrigger id="tipoCombustivel">
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GASOLINA">Gasolina</SelectItem>
                      <SelectItem value="ETANOL">Etanol</SelectItem>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                      <SelectItem value="FLEX">Flex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formData.tipoVeiculo === "MOTO" && (
              <div className="grid gap-2">
                <Label htmlFor="cilindrada">Cilindrada (cc)</Label>
                <Input
                  id="cilindrada"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.cilindrada as any}
                  onChange={(e) => {
                    setFormData({ ...formData, cilindrada: e.target.value });
                  }}
                  required
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                  value={formData.status}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, status: value })
                  }
                  disabled={!!editingVehicle && (hasActiveRental || hasActiveMaintenance)}
                >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="DISPONÍVEL">Disponível</SelectItem>
                    <SelectItem value="ALUGADO">Alugado</SelectItem>
                    <SelectItem value="MANUTENÇÃO">Manutenção</SelectItem>
                    <SelectItem value="INDISPONÍVEL">Indisponível</SelectItem>
                </SelectContent>
              </Select>
                {(hasActiveRental || hasActiveMaintenance) && (
                  <p className="text-sm text-destructive mt-2">Existe{hasActiveRental && ' um aluguel em andamento'}{hasActiveRental && hasActiveMaintenance && ' e'}{hasActiveMaintenance && ' uma manutenção em andamento'}. Não é possível alterar o status até que sejam finalizados.</p>
                )}
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
            <Button type="submit" disabled={loading || (editingVehicle && (hasActiveRental || hasActiveMaintenance) && formData.status !== (editingVehicle.status || ''))}>
              {loading ? "Salvando..." : editingVehicle ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
