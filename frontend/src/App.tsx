/// <reference types="vite/client" />

import { useState, useEffect } from "react";
import {
  Car,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Plus,
  Search,
  Wrench,
  LogOut,
  ChevronDown,
  List,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./components/ui/collapsible";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { VehicleTable, Vehicle } from "./components/VehicleTable";
import { VehicleCard } from "./components/VehicleCard";
import { VehicleFormModal } from "./components/VehicleFormModal";
import { VehicleFilters } from "./components/VehicleFilters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";

const menuItems = [
  {
    icon: Car,
    label: "Gestão de Frotas",
    active: true,
    hasSubmenu: true,
    submenu: [
      { icon: List, label: "Veículos Cadastrados", active: true },
    ]
  },
];

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    manufacturer: "",
    yearFrom: "",
    yearTo: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/veiculos`);
      if (!res.ok) throw new Error("Erro ao buscar veículos");
      const data = await res.json();
      setVehicles(data); // Atualiza o estado direto
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
  if (!BACKEND_URL) {
    console.error("REACT_APP_BACKEND_URL não definido");
    return;
  }
  fetchVehicles();
}, [BACKEND_URL]);


  const handleAddVehicle = (
    vehicleData: Omit<Vehicle, "id"> & { id?: string }
  ) => {
    if (vehicleData.id) {
      setVehicles(
        vehicles.map((v) =>
          v.id === vehicleData.id ? (vehicleData as Vehicle) : v
        )
      );
    } else {
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: Date.now().toString(),
      };
      setVehicles([...vehicles, newVehicle]);
    }
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/veiculos/${vehicleToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Erro ao deletar veículo");
      }
      setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete));
      setVehicleToDelete(null);
      setDeleteDialogOpen(false);
      alert("Veículo deletado com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert("Erro ao deletar veículo: " + err.message);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      type: "all",
      manufacturer: "",
      yearFrom: "",
      yearTo: "",
    });
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.fabricante.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filters.type === "all" || vehicle.tipoVeiculo === filters.type;

    const matchesManufacturer =
      !filters.manufacturer ||
      vehicle.fabricante
        .toLowerCase()
        .includes(filters.manufacturer.toLowerCase());

    const matchesYearFrom =
      !filters.yearFrom || vehicle.ano >= parseInt(filters.yearFrom);

    const matchesYearTo =
      !filters.yearTo || vehicle.ano <= parseInt(filters.yearTo);

    return (
      matchesSearch &&
      matchesType &&
      matchesManufacturer &&
      matchesYearFrom &&
      matchesYearTo
    );
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <h2>FleetManager</h2>
                <p className="text-muted-foreground">Sistema de Frotas</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    item.hasSubmenu ? (
                      <Collapsible
                        key={item.label}
                        defaultOpen={item.active}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={item.active}
                              tooltip={item.label}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                              <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.submenu?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.label}>
                                  <SidebarMenuSubButton
                                    isActive={subItem.active}
                                  >
                                    <subItem.icon className="h-4 w-4" />
                                    <span>{subItem.label}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          isActive={item.active}
                          tooltip={item.label}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span>UA</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">Usuário Admin</p>
                  <p className="text-xs text-muted-foreground">admin@fleet.com</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1" />
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1>Gestão de Veículos</h1>
                <p className="text-muted-foreground">
                  Gerencie sua frota de carros e motos
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingVehicle(null);
                  setIsModalOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Cadastrar Novo Veículo
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por modelo ou fabricante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <VehicleFilters
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  {filteredVehicles.length}{" "}
                  {filteredVehicles.length === 1 ? "veículo encontrado" : "veículos encontrados"}
                </p>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <VehicleTable
                  vehicles={filteredVehicles}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {filteredVehicles.length === 0 ? (
                  <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
                    Nenhum veículo cadastrado. Clique em "Cadastrar Novo Veículo" para começar.
                  </div>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <VehicleFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingVehicle(null);
        }}
        onSubmit={handleAddVehicle}
        editingVehicle={editingVehicle}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este veículo? Esta ação não pode
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
    </SidebarProvider>
  );
}
