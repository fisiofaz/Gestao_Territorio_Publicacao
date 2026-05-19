import { motion } from "framer-motion";
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

   const cardClass =
    "p-5 rounded-xl shadow transition flex items-center justify-between " +
    "bg-white dark:bg-slate-800 hover:shadow-xl hover:scale-[1.02]";

  return (
    <div className="space-y-6">

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <motion.div
          className={cardClass}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Publicadores
            </p>
            <h2 className="text-3xl font-bold text-blue-600">120</h2>
          </div>
          <Users className="text-blue-600" size={32} />
        </motion.div>       
        <motion.div
          className={cardClass}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Estoque Baixo
            </p>
            <h2 className="text-3xl font-bold text-red-500">3</h2>
          </div>
          <AlertTriangle className="text-red-500" size={32} />
        </motion.div>
         <motion.div
          className={cardClass}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Territórios Pendentes
            </p>
            <h2 className="text-3xl font-bold text-yellow-500">5</h2>
          </div>
          <Map className="text-yellow-500" size={32} />
        </motion.div>     
      </div>

      {/* GRÁFICO */}
      <motion.div
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Crescimento de Pedidos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>              
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="pedidos"
              stroke="#2563eb"
              fill="url(#colorPedidos)"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="pedidos"
              stroke="#1d4ed8"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </AreaChart>  
        </ResponsiveContainer>
      </motion.div>   
    </div>
  );
}