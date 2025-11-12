import { Car, DollarSign, Package } from 'lucide-react';
import { Vehicle } from './VehicleTable';
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
} from 'recharts';

interface DashboardProps {
  vehicles: Vehicle[];
}

export function Dashboard({ vehicles }: DashboardProps) {
  // Calcular estatísticas usando os campos vindos do backend
  const totalVehicles = vehicles?.length || 0;
  const totalValue = (vehicles || []).reduce((sum, vehicle) => sum + (Number((vehicle as any).preco) || 0), 0);
  const activeVehicles = (vehicles || []).filter((v) => v.status === 'ATIVO').length;
  const inactiveVehicles = totalVehicles - activeVehicles;

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
            <span className="text-green-600">{activeVehicles} ativos</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-red-600">{inactiveVehicles} inativos</span>
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
        {/* Gráfico por Tipo */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4">Distribuição por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeChartData}
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
                {typeChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico por Fabricante */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4">Quantidade por Fabricante</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={manufacturerChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis ticks={yTicks} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar
                dataKey="quantity"
                fill="#0891b2"
                radius={[8, 8, 0, 0]}
                name="Quantidade"
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
