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
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchRentals = async () => {
    if (!currentUser) return;
    
    setTableLoading(true);
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
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRentals();
    }
  }, [currentUser]);

  const handleAddRental = async (rentalData: any) => {
    if (!currentUser || loading) return;

    const payload = {
      ...rentalData,
      usuarioId: currentUser.usuarioId,
    };

    setLoading(true);
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

      const data = await res.json();
      
      await fetchRentals();
      if (onVehiclesUpdate) {
        try {
          await onVehiclesUpdate();
        } catch (updateErr) {
          console.error("Erro ao atualizar veículos:", updateErr);
        }
      }
      setEditingRental(null);
      setIsModalOpen(false);
      toast.success(rentalData.id ? "Aluguel atualizado com sucesso!" : "Aluguel cadastrado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar aluguel:", err);
      const errorMessage = err?.message || err?.toString() || "Erro ao salvar aluguel";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
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
    if (!rentalToDelete || deleteLoading) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/alugueis/${rentalToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.erro || "Erro ao deletar aluguel");
      }
      
      await fetchRentals();
      if (onVehiclesUpdate) {
        try {
          await onVehiclesUpdate();
        } catch (updateErr) {
          console.error("Erro ao atualizar veículos:", updateErr);
        }
      }
      setRentalToDelete(null);
      setDeleteDialogOpen(false);
      toast.success("Aluguel deletado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao deletar aluguel:", err);
      const errorMessage = err?.message || err?.toString() || "Erro ao deletar aluguel";
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFinalizeClick = (id: number) => {
    setRentalToFinalize(id);
    setFinalizeDialogOpen(true);
  };

  const handleFinalizeConfirm = async () => {
    if (!rentalToFinalize || finalizeLoading) return;

    setFinalizeLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/alugueis/${rentalToFinalize}/finalizar`, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.erro || "Erro ao finalizar aluguel");
      }
      
      await fetchRentals();
      if (onVehiclesUpdate) {
        try {
          await onVehiclesUpdate();
        } catch (updateErr) {
          console.error("Erro ao atualizar veículos:", updateErr);
        }
      }
      setRentalToFinalize(null);
      setFinalizeDialogOpen(false);
      toast.success("Aluguel finalizado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao finalizar aluguel:", err);
      const errorMessage = err?.message || err?.toString() || "Erro ao finalizar aluguel";
      toast.error(errorMessage);
    } finally {
      setFinalizeLoading(false);
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
          disabled={vehicles.length === 0}
        >
          <Plus className="h-4 w-4" />
          Cadastrar Novo Aluguel
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 shadow-sm text-center">
          <p className="text-lg font-semibold mb-2">Nenhum veículo cadastrado</p>
          <p className="text-muted-foreground">
            É necessário cadastrar pelo menos um veículo para poder criar aluguéis.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {rentals.length}{" "}
              {rentals.length === 1 ? "aluguel encontrado" : "aluguéis encontrados"}
            </p>
          </div>

          <div className="hidden md:block">
            {tableLoading ? (
              <div className="rounded-lg border bg-card p-12 shadow-md flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-muted-foreground">Carregando aluguéis...</p>
                </div>
              </div>
            ) : (
              <RentalTable
                rentals={rentals}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onFinalize={handleFinalizeClick}
              />
            )}
          </div>
        </div>
      )}

      <RentalFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!loading) {
            setIsModalOpen(open);
            if (!open) setEditingRental(null);
          }
        }}
        onSubmit={handleAddRental}
        editingRental={editingRental}
        vehicles={vehicles}
        loading={loading}
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
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Excluindo..." : "Excluir"}
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
            <AlertDialogCancel disabled={finalizeLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalizeConfirm}
              disabled={finalizeLoading}
            >
              {finalizeLoading ? "Finalizando..." : "Finalizar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

