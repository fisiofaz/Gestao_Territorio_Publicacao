import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Territorios() {
  const [territorios, setTerritorios] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [publicadores, setPublicadores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRetirar, setModalRetirar] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedTerritorio, setSelectedTerritorio] = useState(null);

  const [publicadorId, setPublicadorId] = useState("");

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("ALL");

  // Criar Cartão
  const [form, setForm] = useState({
    numero: "",
    mapaUrl: ""
  });

  // 🔥 CARREGAR DADOS
  const fetchData = async (pageParam = page) => {
    setLoading(true);
    try {
      const res = await api.get("/territorios", {
        params: {
          page: pageParam,
          size: 5,
          busca: busca || undefined,
          status: status === "ALL" ? undefined : status,
          sort: "asc"
        }
      });

      setTerritorios(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (mounted) {
        await fetchData(0);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const delay = setTimeout(() => {
      if (mounted) {
        setPage(0);
        fetchData(0);
      }
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(delay);
    };
  }, [busca, status]);

  useEffect(() => {
    let mounted = true;

    api.get("/publicadores").then((res) => {
      if (mounted) {
        setPublicadores(res.data);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);



   // 🔥 SALVAR (CRIAR / EDITAR)
  const salvar = async () => {
    try {
      if (editingId) {
        await api.put(`/territorios/${editingId}`, form);
        toast.success("Território atualizado!");
      } else {
        await api.post("/territorios", form);
        toast.success("Território criado!");
      }

      setModalOpen(false);
      setEditingId(null);
      setForm({ numero: "", mapaUrl: "" });
       fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar");
    }
  };

  // 🔥 EDITAR
  const editar = (t) => {
    setForm({
      numero: t.numero,
      mapaUrl: t.mapaUrl || ""
    });
    setEditingId(t.id);
    setModalOpen(true);
  };

  // 🔥 EXCLUIR
  const excluir = async (id) => {
    if (!confirm("Deseja excluir este território?")) return;

    try {
      await api.delete(`/territorios/${id}`);
      toast.success("Excluído!");
      fetchData();
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  // 🔥 RETIRAR
  const retirar = async () => {
    try {
      await api.post(
        `/territorios/${selectedTerritorio}/retirar/${publicadorId}`
      );

      toast.success("Retirado!");
      setModalRetirar(false);
      setPublicadorId("");
      fetchData();
    } catch {
      toast.error("Erro ao retirar território");
    }
  };

  // 🔥 DEVOLVER
  const devolver = async (id) => {
    try {
      await api.post(`/territorios/${id}/devolver`);
      toast.success("Território devolvido!");
      fetchData();
    } catch {
      toast.error("Erro ao devolver");
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Territórios</h1>
          <p className="text-gray-400">Gestão de cartões</p>
        </div>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditingId(null);
            setForm({ numero: "", mapaUrl: "" });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Novo Terriório
        </button>
      </div>

      {/* FILTROS */}

      <div className="flex gap-3">   
        <input
          type="text"
          placeholder="Buscar território..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
           className="p-2 rounded border"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="ALL">Todos</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="EM_USO">Em uso</option>
        </select>   
      </div>

      {/* TABELA */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">

        {/* HEADER DESKTOP */}
        <div className="grid grid-cols-4 p-3 text-gray-400 border-b">
          <span>Cartão</span>
          <span>Status</span>
          <span>Responsável</span>
          <span className="text-right">Ações</span>
        </div>

        {/* LINHAS */}
        {territorios.map((t) => (
          <div key={t.id} className="grid grid-cols-4 p-3 border-b items-center">

            <span>{t.numero}</span>

            <span>{t.status}</span>

            <span>{t.responsavel?.nome || "-"}</span>    

            {/* AÇÕES */}
            <div className="flex justify-end gap-2">

              <button onClick={() => editar(t)}>✏️</button>

              <button onClick={() => excluir(t.id)}>🗑️</button>

              {t.status === "DISPONIVEL" ? (
                <button
                  onClick={() => {
                    setSelectedTerritorio(t.id);
                    setModalRetirar(true);
                  }}
                >
                  Retirar
                </button>
              ) : (
                <button onClick={() => devolver(t.id)}>
                  Devolver
                </button>
              )}
              
            </div>
          </div>
        ))}
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex justify-between">
        <button
          disabled={page === 0}
          onClick={() => {
            const p = page - 1;
            setPage(p);
            fetchData(p);
          }}
        >
          ← Anterior
        </button>

        <span>Página {page + 1} de {totalPages}</span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => {
            const p = page + 1;
            setPage(p);
            fetchData(p);
          }}
        >
          Próxima →
        </button>
      </div>

      {/* MODAL CRUD */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">

            <h2 className="mb-4 font-bold">
              {editingId ? "Editar" : "Novo"} Território
            </h2>

            <input
              placeholder="Número"
              value={form.numero}
              onChange={(e) =>
                setForm({ ...form, numero: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

             <input
              placeholder="URL do mapa"
              value={form.mapaUrl}
              onChange={(e) =>
                setForm({ ...form, mapaUrl: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)}>
                Cancelar
              </button>

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

      {/* MODAL RETIRAR */}
      {modalRetirar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">

            <h2 className="mb-4 font-bold">Retirar</h2>

            <select
              value={publicadorId}
              onChange={(e) => setPublicadorId(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Selecione um publicador</option>
              {publicadores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setModalRetirar(false)}>
                Cancelar
              </button>

              <button
                onClick={retirar}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
     
  );
}