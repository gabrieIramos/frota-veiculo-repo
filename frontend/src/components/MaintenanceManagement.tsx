import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { MaintenanceTable, Maintenance } from "./MaintenanceTable";
import { MaintenanceFormModal } from "./MaintenanceFormModal";
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

interface MaintenanceManagementProps {
  currentUser: { usuarioId: number; nome: string; email: string; empresa: string } | null;
  vehicles: Vehicle[];
  onVehiclesUpdate?: () => void;
}

export function MaintenanceManagement({ currentUser, vehicles, onVehiclesUpdate }: MaintenanceManagementProps) {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<number | null>(null);
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const [maintenanceToFinalize, setMaintenanceToFinalize] = useState<number | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchMaintenances = async () => {
    if (!currentUser) return;
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/manutencoes?usuarioId=${currentUser.usuarioId}`);
      if (!res.ok) {
        if (res.status === 500) {
          setMaintenances([]);
          return;
        }
        throw new Error("Erro ao buscar manutenções");
      }
      const data = await res.json();
      setMaintenances(data || []);
    } catch (err: any) {
      console.error(err);
      setMaintenances([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMaintenances();
    }
  }, [currentUser]);

  const handleAddMaintenance = async (maintenanceData: any) => {
    if (!currentUser) return;

    const payload = {
      ...maintenanceData,
      usuarioId: currentUser.usuarioId,
    };

    try {
      if (maintenanceData.id) {
        const res = await fetch(`${BACKEND_URL}/api/manutencoes/${maintenanceData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.erro || "Erro ao atualizar manutenção");
        }
      } else {
        const res = await fetch(`${BACKEND_URL}/api/manutencoes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.erro || "Erro ao cadastrar manutenção");
        }
      }

      await fetchMaintenances();
      if (onVehiclesUpdate) {
        await onVehiclesUpdate();
      }
      setEditingMaintenance(null);
      setIsModalOpen(false);
      toast.success(maintenanceData.id ? "Manutenção atualizada com sucesso!" : "Manutenção cadastrada com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao salvar manutenção");
    }
  };


  const handleEdit = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setMaintenanceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!maintenanceToDelete) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/manutencoes/${maintenanceToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || "Erro ao deletar manutenção");
      }
      
      await fetchMaintenances();
      if (onVehiclesUpdate) {
        await onVehiclesUpdate();
      }
      setMaintenanceToDelete(null);
      setDeleteDialogOpen(false);
      toast.success("Manutenção deletada com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao deletar manutenção");
    }
  };

  const handleFinalizeClick = (id: number) => {
    setMaintenanceToFinalize(id);
    setFinalizeDialogOpen(true);
  };

  const handleFinalizeConfirm = async () => {
    if (!maintenanceToFinalize) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/manutencoes/${maintenanceToFinalize}/finalizar`, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || "Erro ao finalizar manutenção");
      }
      
      await fetchMaintenances();
      if (onVehiclesUpdate) {
        await onVehiclesUpdate();
      }
      setMaintenanceToFinalize(null);
      setFinalizeDialogOpen(false);
      toast.success("Manutenção finalizada com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao finalizar manutenção");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1>Manutenções</h1>
          <p className="text-muted-foreground">
            Gerencie as manutenções de veículos
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingMaintenance(null);
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Cadastrar Nova Manutenção
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {maintenances.length}{" "}
            {maintenances.length === 1 ? "manutenção encontrada" : "manutenções encontradas"}
          </p>
        </div>

        <div className="hidden md:block">
          <MaintenanceTable
            maintenances={maintenances}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onFinalize={handleFinalizeClick}
          />
        </div>
      </div>

      <MaintenanceFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingMaintenance(null);
        }}
        onSubmit={handleAddMaintenance}
        editingMaintenance={editingMaintenance}
        vehicles={vehicles}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta manutenção? Esta ação não pode
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
            <AlertDialogTitle>Finalizar Manutenção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar esta manutenção? O veículo será marcado como disponível.
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

