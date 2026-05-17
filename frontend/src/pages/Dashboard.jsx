import {
  Users,
  AlertTriangle,
  Map
} from "lucide-react";

import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {

  const data = [
    { name: "Jan", pedidos: 10 },
    { name: "Fev", pedidos: 20 },
    { name: "Mar", pedidos: 15 },
    { name: "Abr", pedidos: 25 },
  ];

  return (
    <div className="space-y-6">

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Publicadores</p>
            <h2 className="text-3xl font-bold text-blue-600">120</h2>
          </div>
          <Users className="text-blue-600" size={32} />
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Estoque Baixo</p>
            <h2 className="text-3xl font-bold text-red-500">3</h2>
          </div>
          <AlertTriangle className="text-red-500" size={32} />
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Territórios Pendentes</p>
            <h2 className="text-3xl font-bold text-yellow-500">5</h2>
          </div>
          <Map className="text-yellow-500" size={32} />
        </div>

      </div>

      {/* GRÁFICO */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Crescimento de Pedidos
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="pedidos"
              stroke="#2563eb"
              fill="#93c5fd"
            />

            <Line
              type="monotone"
              dataKey="pedidos"
              stroke="#1d4ed8"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}