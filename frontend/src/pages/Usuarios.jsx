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

  const [errors, setErrors] = useState({});  

  const [form, setForm] = useState({
    email: "",
    senha: "",
    role: "USER"
  });

  // 🔥 SORT
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
  
   // 🔥 FETCH ÚNICO (SEM DUPLICAÇÃO)
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
            sort: getSortParam(),
          },
        });

        if (!mounted) return;

        if (res.data.content) {
          setUsuarios(res.data.content);
          setTotalPaginas(res.data.totalPages);
        } else {
          setUsuarios(res.data);
          setTotalPaginas(1);
        }

      } catch (err) {
        console.error(err);

        if (err.response) {
          setError(err.response.data?.message || "Erro no servidor");
        } else {
          setError("Erro de conexão");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => (mounted = false);
  }, [paginaAtual, busca, filtroRole, getSortParam]);


  // 🔥 SALVAR
  const salvar = async () => {
    try {
      setErrors({});

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
      setPaginaAtual(1);

    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error("Erro ao salvar usuário");
      }
    }
  };

  // 🔥 EDITAR
  const editar = (u) => {
    setForm({ email: u.email, senha: "", role: u.role });
    setEditingId(u.id);
    setErrors({});
    setModalOpen(true);
  };

  // 🔥 EXCLUIR
  const excluir = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      toast.success("Usuário removido!");
      setPaginaAtual(1);
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
        <div className="flex gap-2 flex-wrap">
          {/* BUSCA */}
          <input
            placeholder="Buscar por email..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
            }}
            className="p-2 border rounded"
          />

          {/* FILTRO */}
          <select
            value={filtroRole}
            onChange={(e) => {
              setFiltroRole(e.target.value);
              setPaginaAtual(1);
            }}
             className="p-2 border rounded"
          >
            <option value="ALL">Todos</option>
            <option value="ADMIN">Admins</option>
            <option value="SERVO_TERRITORIO">Servo de Território</option>
            <option value="SERVO_PUBLICACAO">Servo de Publicação</option>
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow">
        {usuarios.map((u) => (
          <div key={u.id} className="flex justify-between p-4 border-b">
            <span className="dark:text-white">{u.email}</span>
            <span className="dark:text-white">{u.role}</span>

            <div className="flex gap-2">
              <button onClick={() => editar(u)} className="dark:text-white">Editar</button>
              <button onClick={() => excluir(u.id)} className="dark:text-white">Excluir</button>
            </div>
          </div>
        ))}
      </div>
      
      {/* PAGINAÇÃO */}
      <div className="flex justify-between">
        <button
          disabled={paginaAtual === 1}
          onClick={() => setPaginaAtual(paginaAtual - 1)}
          className="dark:text-white"
        >
          ← ATRÁS
        </button>

        <span className="dark:text-white">{paginaAtual} / {totalPaginas}</span>

        <button
          disabled={paginaAtual === totalPaginas}
          onClick={() => setPaginaAtual(paginaAtual + 1)}
          className="dark:text-white"
        >
         FRENTE → 
        </button>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded w-[400px]">

            <h2 className="mb-4">
              {editingId ? "Editar" : "Novo"}
            </h2>

            {/* EMAIL */}
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setErrors({ ...errors, email: null });
              }}
              className={`w-full mb-1 p-2 border rounded ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            {/* SENHA */}
            <input
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={(e) => {
                setForm({ ...form, senha: e.target.value });
                setErrors({ ...errors, senha: null });
              }}
              className={`w-full mb-1 p-2 border rounded ${errors.senha ? "border-red-500" : ""}`}
            />
            {errors.senha && (
              <p className="text-red-500 text-sm">{errors.senha}</p>
            )}

            {/* ROLE */}
            <select
              value={form.role}
              onChange={(e) => {
                setForm({ ...form, role: e.target.value });
                setErrors({ ...errors, role: null });
              }}
              className={`w-full mb-2 p-2 border rounded ${errors.role ? "border-red-500" : ""}`}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModalOpen(false)}>Cancelar</button>

              <button
                onClick={salvar}
                className="bg-blue-600 text-white px-4 py-1 rounded"
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
      