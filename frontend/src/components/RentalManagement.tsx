import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { RentalTable, Rental } from "./RentalTable";
import { RentalFormModal } from "./RentalFormModal";
import { Vehicle } from "./VehicleTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface RentalManagementProps {
  currentUser: { usuarioId: number; nome: string; email: string; empresa: string } | null;
  vehicles: Vehicle[];
  onVehiclesUpdate?: () => void;
}

export function RentalManagement({ currentUser, vehicles, onVehiclesUpdate }: RentalManagementProps) {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState<Rental | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rentalToDelete, setRentalToDelete] = useState<number | null>(null);
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const [rentalToFinalize, setRentalToFinalize] = useState<number | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchRentals = async () => {
    if (!currentUser) return;
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/alugueis?usuarioId=${currentUser.usuarioId}`);
      if (!res.ok) {
        if (res.status === 500) {
          setRentals([]);
          return;
        }
        throw new Error("Erro ao buscar aluguéis");
      }
      const data = await res.json();
      setRentals(data || []);
    } catch (err: any) {
      console.error(err);
      setRentals([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRentals();
    }
  }, [currentUser]);

  const handleAddRental = async (rentalData: any) => {
    if (!currentUser) return;

    const payload = {
      ...rentalData,
      usuarioId: currentUser.usuarioId,
    };

    try {
      let res;
      if (rentalData.id) {
        res = await fetch(`${BACKEND_URL}/api/alugueis/${rentalData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BACKEND_URL}/api/alugueis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Erro ao salvar aluguel";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.erro || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      await fetchRentals();
      if (onVehiclesUpdate) {
        await onVehiclesUpdate();
      }
      setEditingRental(null);
      setIsModalOpen(false);
      toast.success(rentalData.id ? "Aluguel atualizado com sucesso!" : "Aluguel cadastrado com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao salvar aluguel");
    }
  };

  const handleEdit = (rental: Rental) => {
    setEditingRental(rental);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setRentalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!rentalToDelete) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/alugueis/${rentalToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || "Erro ao deletar aluguel");
      }
      
      await fetchRentals();
      if (onVehiclesUpdate) {
        await onVehiclesUpdate();
      }
      setRentalToDelete(null);
      setDeleteDialogOpen(false);
      toast.success("Aluguel deletado com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao deletar aluguel");
    }
  };

  const handleFinalizeClick = (id: number) => {
    setRentalToFinalize(id);
    setFinalizeDialogOpen(true);
  };

  const handleFinalizeConfirm = async () => {
    if (!rentalToFinalize) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/alugueis/${rentalToFinalize}/finalizar`, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || "Erro ao finalizar aluguel");
      }
      
      await fetchRentals();
      if (onVehiclesUpdate) {
        await onVehiclesUpdate();
      }
      setRentalToFinalize(null);
      setFinalizeDialogOpen(false);
      toast.success("Aluguel finalizado com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao finalizar aluguel");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1>Gestão de Aluguéis</h1>
          <p className="text-muted-foreground">
            Gerencie os aluguéis de veículos
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRental(null);
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Cadastrar Novo Aluguel
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {rentals.length}{" "}
            {rentals.length === 1 ? "aluguel encontrado" : "aluguéis encontrados"}
          </p>
        </div>

        <div className="hidden md:block">
          <RentalTable
            rentals={rentals}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onFinalize={handleFinalizeClick}
          />
        </div>
      </div>

      <RentalFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingRental(null);
        }}
        onSubmit={handleAddRental}
        editingRental={editingRental}
        vehicles={vehicles}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este aluguel? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={finalizeDialogOpen} onOpenChange={setFinalizeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Aluguel</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar este aluguel? O veículo será marcado como disponível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalizeConfirm}
            >
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

