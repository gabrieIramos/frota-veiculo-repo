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
  onSubmit: (vehicle: Omit<Vehicle, "id"> & { id?: string }) => void;
  editingVehicle?: Vehicle | null;
}

export function VehicleFormModal({
  open,
  onOpenChange,
  onSubmit,
  editingVehicle,
}: VehicleFormModalProps) {
  const [formData, setFormData] = useState({
    tipoVeiculo: "CARRO" as "CARRO" | "MOTO",
    modelo: "",
    fabricante: "",
    ano: new Date().getFullYear(),
    preco: 0,
    quantidadePortas: 4,
    tipoCombustivel: "GASOLINA",
    cilindrada: 150,
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log(BACKEND_URL);

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        tipoVeiculo: editingVehicle.tipoVeiculo,
        modelo: editingVehicle.modelo,
        fabricante: editingVehicle.fabricante,
        ano: editingVehicle.ano,
        preco: editingVehicle.preco,
        quantidadePortas: editingVehicle.quantidadePortas ?? 4,
        tipoCombustivel: editingVehicle.tipoCombustivel ?? "GASOLINA",
        cilindrada: editingVehicle.cilindrada ?? 150,
      });
    } else {
      setFormData({
        tipoVeiculo: "CARRO",
        modelo: "",
        fabricante: "",
        ano: new Date().getFullYear(),
        preco: 0,
        quantidadePortas: 4,
        tipoCombustivel: "GASOLINA",
        cilindrada: 150,
      });
    }
  }, [editingVehicle, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body =
      formData.tipoVeiculo === "CARRO"
        ? {
          modelo: formData.modelo,
          fabricante: formData.fabricante,
          ano: formData.ano,
          preco: formData.preco,
          quantidadePortas: formData.quantidadePortas,
          tipoCombustivel: formData.tipoCombustivel
        }
        : {
          modelo: formData.modelo,
          fabricante: formData.fabricante,
          ano: formData.ano,
          preco: formData.preco,
          cilindrada: formData.cilindrada
        };

    let url = "";
    let method = "";

    if (editingVehicle && editingVehicle.id) {
      url =
        formData.tipoVeiculo === "CARRO"
          ? `${BACKEND_URL}/api/veiculos/carros/${editingVehicle.id}`
          : `${BACKEND_URL}/api/veiculos/motos/${editingVehicle.id}`;
      method = "PUT";
    } else {
      url =
        formData.tipoVeiculo === "CARRO"
          ? `${BACKEND_URL}/api/veiculos/carros`
          : `${BACKEND_URL}/api/veiculos/motos`;
      method = "POST";
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert(
          editingVehicle
            ? `${formData.tipoVeiculo} atualizado com sucesso!`
            : `${formData.tipoVeiculo} cadastrado com sucesso!`
        );

        let savedVehicle = null;
        try {
          savedVehicle = await res.json();
        } catch (err) {
          //ignorar
        }

        onSubmit(savedVehicle);
        window.location.reload()
        onOpenChange(false);
      } else {
        const error = await res.text();
        alert("Erro ao salvar veículo: " + error);
      }
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Linha 1: Tipo de Veículo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipoVeiculo">Tipo de Veículo</Label>
                <Select
                  value={formData.tipoVeiculo}
                  onValueChange={(value: "CARRO" | "MOTO") =>
                    setFormData({ ...formData, tipoVeiculo: value })
                  }
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
            </div>

            {/* Linha 2: Modelo e Fabricante */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            {/* Linha 3: Ano e Preço */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.ano}
                  onChange={(e) =>
                    setFormData({ ...formData, ano: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.preco}
                  onChange={(e) =>
                    setFormData({ ...formData, preco: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            {/* Campos específicos Carro */}
            {formData.tipoVeiculo === "CARRO" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantidadePortas">Quantidade de Portas</Label>
                  <Input
                    id="quantidadePortas"
                    type="number"
                    min={1}
                    max={10}
                    value={formData.quantidadePortas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantidadePortas: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipoCombustivel">Tipo de Combustível</Label>
                  <Select
                    value={formData.tipoCombustivel}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, tipoCombustivel: value })
                    }
                  >
                    <SelectTrigger id="tipoCombustivel">
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GASOLINA">GASOLINA</SelectItem>
                      <SelectItem value="DIESEL">DIESEL</SelectItem>
                      <SelectItem value="FLEX">FLEX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Campos específicos Moto */}
            {formData.tipoVeiculo === "MOTO" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cilindrada">Cilindrada (cc)</Label>
                  <Input
                    id="cilindrada"
                    type="number"
                    min={50}
                    max={2000}
                    value={formData.cilindrada}
                    onChange={(e) =>
                      setFormData({ ...formData, cilindrada: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingVehicle ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
