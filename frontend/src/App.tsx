/// <reference types="vite/client" />

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Car,
  Plus,
  Search,
  LogOut,
  ChevronDown,
  List,
  LayoutDashboard,
  Calendar,
  Wrench,
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
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { VehicleFilters } from "./components/VehicleFilters";
import { Dashboard } from "./components/Dashboard";
import { RentalManagement } from "./components/RentalManagement";
import { MaintenanceManagement } from "./components/MaintenanceManagement";
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
    key: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    active: false,
    hasSubmenu: false,
  },
  {
    key: "gestao",
    icon: Car,
    label: "Gestão de Frotas",
    active: true,
    hasSubmenu: true,
    submenu: [
      { key: "veiculos", icon: List, label: "Veículos Cadastrados" },
    ],
  },
  {
    key: "alugueis",
    icon: Calendar,
    label: "Gestão de Aluguéis",
    active: false,
    hasSubmenu: false,
  },
  {
    key: "manutencoes",
    icon: Wrench,
    label: "Manutenções",
    active: false,
    hasSubmenu: false,
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
    status: "",
    quantidadePortas: "",
    tipoCombustivel: "",
    cilindrada: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<{ usuarioId: number; nome: string; email: string; empresa: string } | null>(null);
  const [activeView, setActiveView] = useState<"veiculos" | "dashboard" | "alugueis" | "manutencoes">("dashboard");
  const [authLoading, setAuthLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchVehicles = async () => {
    if (!currentUser) return;
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/veiculos?usuarioId=${currentUser.usuarioId}`);
      if (!res.ok) throw new Error("Erro ao buscar veículos");
      const data = await res.json();
      
      // Mapear dados do backend para o formato do frontend
      const mappedVehicles: Vehicle[] = data.map((v: any) => ({
        id: v.id.toString(),
        modelo: v.modelo,
        fabricante: v.fabricante,
        ano: v.ano,
        preco: v.preco,
        status: v.status,
        tipoVeiculo: v.tipoVeiculo,
        quantidadePortas: v.quantidadePortas,
        tipoCombustivel: v.tipoCombustivel,
        cilindrada: v.cilindrada,
      }));
      
      setVehicles(mappedVehicles);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao buscar veículos");
    }
  };

  useEffect(() => {
    if (!BACKEND_URL) {
      console.error("VITE_BACKEND_URL não definido");
      return;
    }
    if (isAuthenticated && currentUser) {
      fetchVehicles();
    }
  }, [BACKEND_URL, isAuthenticated, currentUser]);


  const handleAddVehicle = async (vehicleData: any) => {
    if (!currentUser) return;

    const endpoint = vehicleData.tipoVeiculo === "CARRO" 
      ? `${BACKEND_URL}/api/veiculos/carros` 
      : `${BACKEND_URL}/api/veiculos/motos`;

    const payload = vehicleData.tipoVeiculo === "CARRO" 
      ? {
          modelo: vehicleData.modelo,
          fabricante: vehicleData.fabricante,
          ano: vehicleData.ano,
          preco: vehicleData.preco,
          usuarioId: currentUser.usuarioId,
          status: vehicleData.status,
          quantidadePortas: vehicleData.quantidadePortas,
          tipoCombustivel: vehicleData.tipoCombustivel
        }
      : {
          modelo: vehicleData.modelo,
          fabricante: vehicleData.fabricante,
          ano: vehicleData.ano,
          preco: vehicleData.preco,
          usuarioId: currentUser.usuarioId,
          status: vehicleData.status,
          cilindrada: vehicleData.cilindrada
        };

    try {
      if (vehicleData.id) {
        // Atualizar
        const updateEndpoint = vehicleData.tipoVeiculo === "CARRO"
          ? `${BACKEND_URL}/api/veiculos/carros/${vehicleData.id}`
          : `${BACKEND_URL}/api/veiculos/motos/${vehicleData.id}`;
        
        const res = await fetch(updateEndpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.erro || "Erro ao atualizar veículo");
        }
      } else {
        // Criar
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.erro || "Erro ao cadastrar veículo");
        }
      }

      await fetchVehicles();
      setEditingVehicle(null);
      toast.success(vehicleData.id ? "Veículo atualizado com sucesso!" : "Veículo cadastrado com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao salvar veículo");
    }
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
        const errorData = await res.json();
        throw new Error(errorData.erro || "Erro ao deletar veículo");
      }
      
      await fetchVehicles();
      setVehicleToDelete(null);
      setDeleteDialogOpen(false);
      toast.success("Veículo deletado com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao deletar veículo");
    }
  };

  const handleClearFilters = () => {
    setFilters({
      type: "all",
      manufacturer: "",
      yearFrom: "",
      yearTo: "",
      status: "",
      quantidadePortas: "",
      tipoCombustivel: "",
      cilindrada: "",
    });
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    try {
      const matchesSearch =
        (vehicle.modelo?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false) ||
        (vehicle.fabricante?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false);

      const matchesType =
        filters.type === "all" || (vehicle.tipoVeiculo || "").toUpperCase() === (filters.type || "").toUpperCase();

      const matchesManufacturer =
        !filters.manufacturer ||
        (vehicle.fabricante?.toLowerCase()?.includes(filters.manufacturer.toLowerCase()) ?? false);

      const matchesYearFrom =
        !filters.yearFrom || vehicle.ano >= parseInt(filters.yearFrom);

      const matchesYearTo =
        !filters.yearTo || vehicle.ano <= parseInt(filters.yearTo);

      const matchesStatus =
        !filters.status || vehicle.status === filters.status;

      const matchesQuantidadePortas =
        !filters.quantidadePortas ||
        (vehicle.quantidadePortas !== undefined && vehicle.quantidadePortas === parseInt(filters.quantidadePortas));

      const matchesTipoCombustivel =
        !filters.tipoCombustivel || (vehicle.tipoCombustivel !== undefined && vehicle.tipoCombustivel === filters.tipoCombustivel);

      const matchesCilindrada =
        !filters.cilindrada || (vehicle.cilindrada !== undefined && vehicle.cilindrada >= parseInt(filters.cilindrada));

      return (
        matchesSearch &&
        matchesType &&
        matchesManufacturer &&
        matchesYearFrom &&
        matchesYearTo &&
        matchesStatus &&
        matchesQuantidadePortas &&
        matchesTipoCombustivel &&
        matchesCilindrada
      );
    } catch (err) {
      console.error("Erro ao filtrar veículos:", err);
      return false;
    }
  });

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || "Email ou senha inválidos");
      }

      const data = await res.json();
      setCurrentUser({
        usuarioId: data.usuarioId,
        nome: data.nome,
        email: data.email,
        empresa: data.empresa,
      });
      setIsAuthenticated(true);
      toast.success(data.mensagem || "Login realizado com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao fazer login");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    company: string
  ) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: name, email, senha: password, empresa: company }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || "Erro ao cadastrar");
      }

      const data = await res.json();
      setCurrentUser({
        usuarioId: data.usuarioId,
        nome: data.nome,
        email: data.email,
        empresa: data.empresa,
      });
      setIsAuthenticated(true);
      toast.success(data.mensagem || "Cadastro realizado com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao cadastrar");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView("login");
    setVehicles([]);
  };

  // Se não estiver autenticado, mostrar telas de login/cadastro
  if (!isAuthenticated) {
    if (currentView === "login") {
      return (
        <LoginForm
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentView("register")}
          loading={authLoading}
        />
      );
    } else {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onNavigateToLogin={() => setCurrentView("login")}
        />
      );
    }
  }

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
                                  isActive={item.submenu?.some((s: any) => s.key === activeView)}
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
                                                isActive={subItem.key === activeView}
                                                onClick={() => setActiveView((subItem as any).key)}
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
                            isActive={(item as any).key === activeView}
                            tooltip={item.label}
                            onClick={() => setActiveView((item as any).key)}
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
                  <span>{currentUser?.nome?.substring(0, 2).toUpperCase() || "UA"}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">{currentUser?.nome || "Usuário Admin"}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email || "admin@fleet.com"}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
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
            {activeView === "dashboard" ? (
              <div>
                <Dashboard vehicles={vehicles} currentUser={currentUser} />
              </div>
            ) : activeView === "alugueis" ? (
              <RentalManagement currentUser={currentUser} vehicles={vehicles} onVehiclesUpdate={fetchVehicles} />
            ) : activeView === "manutencoes" ? (
              <MaintenanceManagement currentUser={currentUser} vehicles={vehicles} onVehiclesUpdate={fetchVehicles} />
            ) : (
              <>
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
              </>
            )}
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
