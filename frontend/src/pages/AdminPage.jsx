import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
                Área exclusiva para administradores
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Usuários</p>
            <h2 className="text-2xl font-bold text-blue-600">12</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Admins</p>
            <h2 className="text-2xl font-bold text-purple-600">2</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Ativos</p>
            <h2 className="text-2xl font-bold text-green-600">10</h2>
        </div>

        </div>

        {/* INFO DO USUÁRIO */}
        <div className="flex items-center  gap-4  bg-white dark:bg-slate-800 p-4 rounded-xl shadow">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg dark:bg-white">
                👤
            </div>

            <div className="flex-1 flex flex-col items-start gap-1"> 
                <p className="text-sm opacity-80 dark:text-white">Usuário logado</p>
                <h2 className="text-xl font-bold dark:text-white">{user?.email}</h2>

                <span className="inline-block mt-1 px-3 py-1 bg-white/20 rounded-full text-xs dark:text-white">
                    {user?.role}
                </span>
            </div>
        </div>

        {/* AÇÕES ADMIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div
            onClick={() => navigate("/usuarios")}
            className="cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-xl shadow 
                r:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
            <h3 className="font-semibold text-gray-700 dark:text-white">
                Gerenciar Usuários
            </h3>
            <p className="text-sm text-gray-500">
                Criar, editar e remover usuários
            </p>
        </div>

        <div
          onClick={() => navigate("/configuracoes")}
          className="cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-xl shadow 
            hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <h3 className="font-semibold text-gray-700 dark:text-white">
            Configurações do Sistema
          </h3>
          <p className="text-sm text-gray-500">
            Ajustar parâmetros gerais da aplicação
          </p>
        </div>

      </div>

    </div>
  );
}