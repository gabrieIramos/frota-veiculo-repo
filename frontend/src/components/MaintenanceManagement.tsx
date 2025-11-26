import { useState, useEffect } from "react";
import { authFetch } from "../utils/api";
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
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchMaintenances = async () => {
    if (!currentUser) return;
    
    setTableLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/api/manutencoes?usuarioId=${currentUser.usuarioId}`);
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
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMaintenances();
    }
  }, [currentUser]);

  const handleAddMaintenance = async (maintenanceData: any) => {
    if (!currentUser || loading) return;

    const payload = {
      ...maintenanceData,
      usuarioId: currentUser.usuarioId,
    };

    setLoading(true);
    try {
      let res;
      if (maintenanceData.id) {
        res = await authFetch(`${BACKEND_URL}/api/manutencoes/${maintenanceData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await authFetch(`${BACKEND_URL}/api/manutencoes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Erro ao salvar manutenção";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.erro || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      await fetchMaintenances();
      if (onVehiclesUpdate) {
        await onVehiclesUpdate();
      }
      setEditingMaintenance(null);
      setIsModalOpen(false);
      toast.success(maintenanceData.id ? "Manutenção atualizada com sucesso!" : "Manutenção cadastrada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar manutenção:", err);
      toast.error(err.message || "Erro ao salvar manutenção");
      throw err;
    } finally {
      setLoading(false);
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
    if (!maintenanceToDelete || deleteLoading) return;

    setDeleteLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/api/manutencoes/${maintenanceToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.erro || "Erro ao deletar manutenção");
      }
      
      await fetchMaintenances();
      if (onVehiclesUpdate) {
        try {
          await onVehiclesUpdate();
        } catch (updateErr) {
          console.error("Erro ao atualizar veículos:", updateErr);
        }
      }
      setMaintenanceToDelete(null);
      setDeleteDialogOpen(false);
      toast.success("Manutenção deletada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao deletar manutenção:", err);
      toast.error(err.message || "Erro ao deletar manutenção");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFinalizeClick = (id: number) => {
    setMaintenanceToFinalize(id);
    setFinalizeDialogOpen(true);
  };

  const handleFinalizeConfirm = async () => {
    if (!maintenanceToFinalize || finalizeLoading) return;

    setFinalizeLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/api/manutencoes/${maintenanceToFinalize}/finalizar`, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.erro || "Erro ao finalizar manutenção");
      }
      
      await fetchMaintenances();
      if (onVehiclesUpdate) {
        try {
          await onVehiclesUpdate();
        } catch (updateErr) {
          console.error("Erro ao atualizar veículos:", updateErr);
        }
      }
      setMaintenanceToFinalize(null);
      setFinalizeDialogOpen(false);
      toast.success("Manutenção finalizada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao finalizar manutenção:", err);
      toast.error(err.message || "Erro ao finalizar manutenção");
    } finally {
      setFinalizeLoading(false);
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
          disabled={vehicles.length === 0}
        >
          <Plus className="h-4 w-4" />
          Cadastrar Nova Manutenção
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 shadow-sm text-center">
          <p className="text-lg font-semibold mb-2">Nenhum veículo cadastrado</p>
          <p className="text-muted-foreground">
            É necessário cadastrar pelo menos um veículo para poder registrar manutenções.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {maintenances.length}{" "}
              {maintenances.length === 1 ? "manutenção encontrada" : "manutenções encontradas"}
            </p>
          </div>

          <div className="hidden md:block">
            {tableLoading ? (
              <div className="rounded-lg border bg-card p-12 shadow-md flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-muted-foreground">Carregando manutenções...</p>
                </div>
              </div>
            ) : (
              <MaintenanceTable
                maintenances={maintenances}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onFinalize={handleFinalizeClick}
              />
            )}
          </div>
        </div>
      )}

      <MaintenanceFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!loading) {
            setIsModalOpen(open);
            if (!open) setEditingMaintenance(null);
          }
        }}
        onSubmit={handleAddMaintenance}
        editingMaintenance={editingMaintenance}
        vehicles={vehicles}
        loading={loading}
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
            <AlertDialogTitle>Finalizar Manutenção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar esta manutenção? O veículo será marcado como disponível.
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

