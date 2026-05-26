import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export default function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroRole, setFiltroRole] = useState("ALL");
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState("email_asc");
  

  const [form, setForm] = useState({
    email: "",
    senha: "",
    role: "USER"
  });

  // 🔥 CARREGAR USUÁRIOS
  const carregarUsuarios = async () => {
    setLoading(true);

    try {
      const res = await api.get("/usuarios");
      console.log("USUARIOS:", res.data);
      setUsuarios(res.data);
    } catch (error) {
      if (error.response) {
        setError(`Erro ${error.response.status}: ${error.response.data}`);
      } else {
        setError("Erro de conexão com o servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  const getSortParam = useCallback(() => {
    switch (ordenacao) {
      case "email_asc":
        return "email,asc";
      case "email_desc":
        return "email,desc";
      case "role":
        return "role,asc";
      default:
        return "email,asc";
    }
  }, [ordenacao]);

  // 🔥 USE EFFECT CORRETO (SEM DUPLICAÇÃO)
 useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api.get("/usuarios", {
          params: {
            page: paginaAtual - 1,
            size: 5,
            search: busca || null,
            role: filtroRole === "ALL" ? null : filtroRole,
            sort: getSortParam()
          }
        });

        if (mounted) {
          setUsuarios(res.data.content);
          setTotalPaginas(res.data.totalPages);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [paginaAtual, busca, filtroRole, getSortParam]);
 
  // 🔥 SALVAR
  const salvar = async () => {
    try {
      if (editingId) {
        await api.put(`/usuarios/${editingId}`, form);
        toast.success("Usuário atualizado!");
      } else {
        await api.post("/usuarios", form);
        toast.success("Usuário criado!");
      }

      setModalOpen(false);
      setForm({ email: "", senha: "", role: "USER" });
      setEditingId(null);
      carregarUsuarios();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar usuário!");
    }
  };

  // 🔥 EDITAR
  const editar = (u) => {
    setForm({ email: u.email, senha: "", role: u.role });
    setEditingId(u.id);
    setModalOpen(true);
  };

  // 🔥 EXCLUIR
  const excluir = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      toast.success("Usuário removido!");
      carregarUsuarios();
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  // 🔥 LOADING
  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-10 bg-gray-300 rounded"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>
    );
  } 
   
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Usuários
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* BUSCA */}
          <input
            type="text"
            placeholder="Buscar por email..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
            }}
            className="w-full sm:flex-1 p-2 border rounded dark:bg-slate-700 dark:text-white"
          />

          {/* FILTRO */}
          <select
            value={filtroRole}
            onChange={(e) => {
              setFiltroRole(e.target.value);
              setPaginaAtual(1);
            }}
            className="p-2 border rounded dark:bg-slate-700 dark:text-white"
          >
            <option value="ALL">Todos</option>
            <option value="ADMIN">Admins</option>
            <option value="USER">Usuários</option>
          </select>
          <select
            value={ordenacao}
            onChange={(e) => {
              setOrdenacao(e.target.value);
              setPaginaAtual(1);
            }}
            className="p-2 border rounded dark:bg-slate-700 dark:text-white"
          >
            <option value="email_asc">Email A-Z</option>
            <option value="email_desc">Email Z-A</option>
            <option value="role">Por Role</option>
          </select>

        </div>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditingId(null);
            setForm({ email: "", senha: "", role: "USER" });
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Novo usuário
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!usuarios || usuarios.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Nenhum usuário encontrado 😢
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">

          {/* HEADER */}
          <div className="hidden md:grid grid-cols-3 px-6 py-3 text-sm font-semibold 
            text-gray-500 dark:text-gray-400 border-b dark:border-slate-700">
            <span>Email</span>
            <span>Role</span>
            <span className="text-right">Ações</span>
          </div>

          {/* LINHAS */} 
          {usuarios.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-1 md:grid-cols-3 px-6 py-4 items-center 
              border-b last:border-none dark:border-slate-700
               hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              {/* EMAIL */}
              <div className="font-medium text-gray-800 dark:text-white">
                {u.email}
              </div>

              {/* ROLE */}
              <div className="mt-2 md:mt-0">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    u.role === "ADMIN"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {u.role}
                </span>
              </div>
              
              {/* AÇÕES */}
              <div className="flex gap-3 justify-end sm:justify-end">
                <button
                  onClick={() => editar(u)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>

                <button
                  onClick={() => excluir(u.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">

        <span className="text-sm text-gray-500">
          Página {paginaAtual} de {totalPaginas}
        </span>

        <div className="flex gap-2">

          <button
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Anterior
          </button>

          <button
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Próxima →
          </button>

        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-[90%] sm:w-[400px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {editingId ? "Editar Usuário" : "Novo Usuário"}
            </h2>

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={(e) =>
                setForm({ ...form, senha: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500"
              >
                Cancelar
              </button>

              <button
                onClick={salvar}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}