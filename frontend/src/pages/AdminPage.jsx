import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const card =
    "bg-white dark:bg-slate-800 p-5 rounded-xl shadow hover:shadow-xl transition flex items-center justify-between";

  if (user?.role !== "ADMIN") {
    return <div className="text-red-500">Acesso negado</div>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Painel Administrativo
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
               Controle total do sistema
            </p>
        </div>

        {/* INFO USUÁRIO */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow text-white">
            <p className="text-sm opacity-80">Usuário logado</p>
            <h2 className="text-xl font-bold">{user?.email}</h2>

            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs">
            {user?.role}
            </span>
        </div>

        {/* MÉTRICAS */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <motion.div className={card} whileHover={{ scale: 1.03 }}>
            <div>
                <p className="text-sm text-gray-500">Usuários</p>
                <h2 className="text-2xl font-bold text-blue-600">12</h2>
            </div>
            <Users className="text-blue-600" size={28} />
            </motion.div>

            <motion.div className={card} whileHover={{ scale: 1.03 }}>
                <div>
                    <p className="text-sm text-gray-500">Admins</p>
                    <h2 className="text-2xl font-bold text-purple-600">2</h2>
                </div>
                <ShieldCheck className="text-purple-600" size={28} />
            </motion.div>

            <motion.div className={card} whileHover={{ scale: 1.03 }}>
                <div>
                    <p className="text-sm text-gray-500">Ativos</p>
                    <h2 className="text-2xl font-bold text-green-600">10</h2>
                </div>
                <Users className="text-green-600" size={28} />
            </motion.div>
        </div>

        {/* AÇÕES RÁPIDAS */}       
        <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Ações rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate("/usuarios")}
                    className="cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-xl shadow hover:shadow-xl transition"
                >
                    <h3 className="font-semibold text-gray-700 dark:text-white">
                        Gerenciar Usuários
                    </h3>
                    <p className="text-sm text-gray-500">
                        Criar, editar e remover usuários
                    </p>
                </motion.div>  

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate("/configuracoes")}
                    className="cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-xl shadow hover:shadow-xl transition"
                >
                    <h3 className="font-semibold text-gray-700 dark:text-white">
                        Configurações do Sistema
                    </h3>
                    <p className="text-sm text-gray-500">
                        Ajustar parâmetros da aplicação
                    </p>
                </motion.div>                
            </div>        
        </div>
      </div>
    );
}