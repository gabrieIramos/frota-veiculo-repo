import { Car, DollarSign, Package } from 'lucide-react';
import { Vehicle } from './VehicleTable';
import { Rental } from './RentalTable';
import { Maintenance } from './MaintenanceTable';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useState, useEffect } from 'react';

interface DashboardProps {
  vehicles: Vehicle[];
  currentUser: { usuarioId: number; nome: string; email: string; empresa: string } | null;
}

export function Dashboard({ vehicles, currentUser }: DashboardProps) {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (currentUser) {
      fetch(`${BACKEND_URL}/api/alugueis?usuarioId=${currentUser.usuarioId}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          return [];
        })
        .then(data => setRentals(data || []))
        .catch(err => {
          console.error(err);
          setRentals([]);
        });

      fetch(`${BACKEND_URL}/api/manutencoes?usuarioId=${currentUser.usuarioId}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          return [];
        })
        .then(data => setMaintenances(data || []))
        .catch(err => {
          console.error(err);
          setMaintenances([]);
        });
    }
  }, [currentUser, BACKEND_URL]);

  const totalVehicles = vehicles?.length || 0;
  const totalValue = (vehicles || []).reduce((sum, vehicle) => sum + (Number((vehicle as any).preco) || 0), 0);
  
  const vehiclesByStatus = (vehicles || []).reduce((acc, vehicle) => {
    const status = vehicle.status || 'INDISPONÍVEL';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = [
    { name: 'Disponível', value: vehiclesByStatus['DISPONÍVEL'] || 0 },
    { name: 'Alugado', value: vehiclesByStatus['ALUGADO'] || 0 },
    { name: 'Manutenção', value: vehiclesByStatus['MANUTENÇÃO'] || 0 },
    { name: 'Indisponível', value: vehiclesByStatus['INDISPONÍVEL'] || 0 },
  ];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = rentals
    .filter(r => {
      const rentalDate = new Date(r.dataRetirada);
      return rentalDate.getMonth() === currentMonth && rentalDate.getFullYear() === currentYear;
    })
    .reduce((sum, r) => sum + (r.valor || 0), 0);

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      name: monthNames[date.getMonth()] + '/' + date.getFullYear().toString().slice(-2),
    };
  });

  const monthlyRevenueData = last12Months.map(({ month, year, name }) => {
    const revenue = rentals
      .filter(r => {
        const rentalDate = new Date(r.dataRetirada);
        return rentalDate.getMonth() === month && rentalDate.getFullYear() === year;
      })
      .reduce((sum, r) => sum + (r.valor || 0), 0);
    return { name, receita: revenue };
  });

  const vehiclesRentalCount = rentals.reduce((acc, rental) => {
    const key = `${rental.veiculoModelo} - ${rental.veiculoFabricante}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostRentedVehicles = Object.entries(vehiclesRentalCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const mostExpensiveMaintenances = maintenances
    .map(m => ({
      name: `${m.veiculoModelo} - ${m.tipo}`,
      valor: m.preco || 0,
    }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);

  // Dados por tipo de veículo (campo: tipoVeiculo, valores esperados: 'CARRO' ou 'MOTO')
  const vehiclesByType = (vehicles || []).reduce((acc, vehicle) => {
    const key = (vehicle.tipoVeiculo || 'DESCONHECIDO') as string;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(vehiclesByType).map(([name, value]) => ({
    name,
    value,
  }));

  // Dados por fabricante (campo: fabricante)
  const vehiclesByManufacturer = (vehicles || []).reduce((acc, vehicle) => {
    const m = vehicle.fabricante || 'Desconhecido';
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const manufacturerChartData = Object.entries(vehiclesByManufacturer).map(
    ([name, quantity]) => ({
      name,
      quantity,
    })
  );

  // Preparar ticks inteiros para o eixo Y (quantidade)
  const maxQuantity = manufacturerChartData.reduce(
    (max, item) => Math.max(max, Number(item.quantity || 0)),
    0
  );

  // Se houver poucos valores, mostrar todos os inteiros (0..max). Se muitos, mostrar passos para evitar poluição.
  let yTicks: number[] = [];
  if (maxQuantity <= 20) {
    yTicks = Array.from({ length: maxQuantity + 1 }, (_, i) => i);
  } else {
    const maxTicksDisplayed = 20;
    const step = Math.ceil(maxQuantity / maxTicksDisplayed);
    const ticksCount = Math.floor(maxQuantity / step) + 1;
    yTicks = Array.from({ length: ticksCount }, (_, i) => i * step);
  }

  // Cores para os gráficos
  const COLORS = ['#0891b2', '#14b8a6', '#06b6d4', '#2dd4bf', '#22d3ee'];

  // Formatar moeda (usa o campo `preco` do backend)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da sua frota de veículos
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de Veículos */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total de Veículos</p>
              <p className="mt-2">{totalVehicles}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100">
              <Car className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-green-600">{vehiclesByStatus['DISPONÍVEL'] || 0} disponíveis</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-blue-600">{vehiclesByStatus['ALUGADO'] || 0} alugados</span>
          </div>
        </div>

        {/* Valor Total */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Valor Total</p>
              <p className="mt-2">{formatCurrency(totalValue)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
              <DollarSign className="h-6 w-6 text-teal-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Valor médio: {formatCurrency(totalValue / totalVehicles || 0)}
          </div>
        </div>

        {/* Carros */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Carros</p>
              <p className="mt-2">{vehiclesByType['CARRO'] || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {totalVehicles > 0
              ? `${((vehiclesByType['CARRO'] || 0) / totalVehicles * 100).toFixed(1)}% da frota`
              : '0% da frota'}
          </div>
        </div>

        {/* Motos */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Motos</p>
              <p className="mt-2">{vehiclesByType['MOTO'] || 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {totalVehicles > 0
              ? `${((vehiclesByType['MOTO'] || 0) / totalVehicles * 100).toFixed(1)}% da frota`
              : '0% da frota'}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quantidade de carros por status */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4">Veículos por Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#22c55e', '#3b82f6', '#eab308', '#ef4444'][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Receita total mensal */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4">Receita Mensal (Últimos 12 meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Bar dataKey="receita" fill="#22c55e" name="Receita" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Veículos mais alugados */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4">Veículos Mais Alugados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mostRentedVehicles}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                fill="#0891b2"
                radius={[8, 8, 0, 0]}
                name="Aluguéis"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Manutenções mais caras */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4">Manutenções Mais Caras</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mostExpensiveMaintenances}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Bar
                dataKey="valor"
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
                name="Valor"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Resumo por Fabricante */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6">
          <h3 className="mb-4">Resumo por Fabricante</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm text-muted-foreground">
                    Fabricante
                  </th>
                  <th className="pb-3 text-left text-sm text-muted-foreground">
                    Quantidade
                  </th>
                  <th className="pb-3 text-left text-sm text-muted-foreground">
                    Valor Total
                  </th>
                  <th className="pb-3 text-left text-sm text-muted-foreground">
                    Valor Médio
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(vehiclesByManufacturer).map(
                  ([manufacturer, count]) => {
                    const manufacturerVehicles = vehicles.filter(
                      (v) => v.fabricante === manufacturer
                    );
                    const manufacturerTotal = manufacturerVehicles.reduce(
                      (sum, v) => sum + (Number((v as any).preco) || 0),
                      0
                    );
                    const manufacturerAvg = manufacturerTotal / count;

                    return (
                      <tr key={manufacturer} className="border-b last:border-0">
                        <td className="py-4">{manufacturer}</td>
                        <td className="py-4 text-muted-foreground">{count}</td>
                        <td className="py-4 text-muted-foreground">
                          {formatCurrency(manufacturerTotal)}
                        </td>
                        <td className="py-4 text-muted-foreground">
                          {formatCurrency(manufacturerAvg)}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
