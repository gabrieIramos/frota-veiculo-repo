import { useState } from "react";
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
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

// Mock data
const initialVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC-1234",
    type: "Carro",
    model: "Civic",
    manufacturer: "Honda",
    year: 2022,
    price: 125000,
    status: "Ativo",
  },
  {
    id: "2",
    plate: "XYZ-5678",
    type: "Moto",
    model: "CG 160",
    manufacturer: "Honda",
    year: 2023,
    price: 15000,
    status: "Ativo",
  },
  {
    id: "3",
    plate: "DEF-9012",
    type: "Carro",
    model: "Corolla",
    manufacturer: "Toyota",
    year: 2021,
    price: 110000,
    status: "Inativo",
  },
  {
    id: "4",
    plate: "GHI-3456",
    type: "Moto",
    model: "Ninja 400",
    manufacturer: "Kawasaki",
    year: 2024,
    price: 35000,
    status: "Ativo",
  },
];

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false, hasSubmenu: false },
  {
    icon: Car,
    label: "Gestão de Frotas",
    active: true,
    hasSubmenu: true,
    submenu: [
      { icon: List, label: "Veículos Cadastrados", active: true },
      { icon: Plus, label: "Cadastrar Novo", active: false },
    ],
  },
  { icon: Wrench, label: "Manutenção", active: false, hasSubmenu: false },
  { icon: FileText, label: "Relatórios", active: false, hasSubmenu: false },
  { icon: Settings, label: "Configurações", active: false, hasSubmenu: false },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
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

  const handleDeleteConfirm = () => {
    if (vehicleToDelete) {
      setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete));
      setVehicleToDelete(null);
    }
    setDeleteDialogOpen(false);
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
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filters.type === "all" || vehicle.type === filters.type;

    const matchesManufacturer =
      !filters.manufacturer ||
      vehicle.manufacturer
        .toLowerCase()
        .includes(filters.manufacturer.toLowerCase());

    const matchesYearFrom =
      !filters.yearFrom || vehicle.year >= parseInt(filters.yearFrom);

    const matchesYearTo =
      !filters.yearTo || vehicle.year <= parseInt(filters.yearTo);

    return (
      matchesSearch &&
      matchesType &&
      matchesManufacturer &&
      matchesYearFrom &&
      matchesYearTo
    );
  });

  const handleLogin = (email: string, password: string) => {
    // TODO: Integrar com backend real
    // Por enquanto, simulando login bem-sucedido
    setCurrentUser({
      name: "Usuário Admin",
      email: email,
    });
    setIsAuthenticated(true);
    console.log("Login:", { email, password });
  };

  const handleRegister = (
    name: string,
    email: string,
    password: string,
    company: string
  ) => {
    // TODO: Integrar com backend real
    // Por enquanto, simulando cadastro bem-sucedido e fazendo login automático
    setCurrentUser({
      name: name,
      email: email,
    });
    setIsAuthenticated(true);
    console.log("Register:", { name, email, password, company });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView("login");
  };

  // Se não estiver autenticado, mostrar telas de login/cadastro
  if (!isAuthenticated) {
    if (currentView === "login") {
      return (
        <LoginForm
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentView("register")}
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

  // Se autenticado, mostrar dashboard
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
                  <span>{currentUser?.name?.substring(0, 2).toUpperCase() || "UA"}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">{currentUser?.name || "Usuário Admin"}</p>
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
                  placeholder="Buscar por placa, modelo ou fabricante..."
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