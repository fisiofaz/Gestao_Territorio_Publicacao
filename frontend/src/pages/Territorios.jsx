import { useEffect, useState, useCallback } from "react";
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

  const [form, setForm] = useState({
    numero: "",
    mapaUrl: ""
  });

  // 🔥 FETCH
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/territorios", {
        params: {
          page,
          size: 6,
          busca: busca || undefined,
          status: status === "ALL" ? undefined : status
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
  }, [page, busca, status]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await api.get("/territorios", {
          params: {
            page,
            size: 6,
            busca: busca || undefined,
            status: status === "ALL" ? undefined : status
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

    load();
  }, [page, busca, status]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(0);
    }, 300);

    return () => clearTimeout(delay);
  }, [busca, status]);

  useEffect(() => {
    api.get("/publicadores").then((res) => {
      setPublicadores(res.data);
    });
  }, []);

  // 🔥 SALVAR
  const salvar = async () => {
    try {
      if (editingId) {
        await api.put(`/territorios/${editingId}`, form);
        toast.success("Atualizado!");
      } else {
        await api.post("/territorios", form);
        toast.success("Criado!");
      }

      setModalOpen(false);
      setEditingId(null);
      setForm({ numero: "", mapaUrl: "" });
      fetchData();

    } catch {
      toast.error("Erro ao salvar");
    }
  };

  const excluir = async (id) => {
    if (!confirm("Excluir território?")) return;

    await api.delete(`/territorios/${id}`);
    toast.success("Excluído!");
    fetchData();
  };

  const retirar = async () => {
    if (!publicadorId) {
      toast.error("Selecione um publicador");
      return;
    }

    await api.post(`/territorios/${selectedTerritorio}/retirar/${publicadorId}`);
    toast.success("Retirado!");
    setModalRetirar(false);
    setPublicadorId("");
    fetchData();
  };

  const devolver = async (id) => {
    await api.post(`/territorios/${id}/devolver`);
    toast.success("Devolvido!");
    fetchData();
  };

  // 🔥 DASHBOARD STATS
  const total = territorios.length;
  const disponiveis = territorios.filter(t => t.status === "DISPONIVEL").length;
  const emUso = territorios.filter(t => t.status === "EM_USO").length;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Territórios</h1>

        <button
          onClick={() => {
            setModalOpen(true);
            setEditingId(null);
            setForm({ numero: "", mapaUrl: "" });
          }}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          + Novo
        </button>
      </div>

      {/* DASHBOARD */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-gray-400">Total</p>
          <h2 className="text-2xl font-bold text-white">{total}</h2>
        </div>

        <div className="bg-green-700 p-4 rounded-xl">
          <p className="text-green-100">Disponíveis</p>
          <h2 className="text-2xl font-bold">{disponiveis}</h2>
        </div>

        <div className="bg-yellow-600 p-4 rounded-xl">
          <p className="text-yellow-100">Em uso</p>
          <h2 className="text-2xl font-bold">{emUso}</h2>
        </div>

      </div>

      {/* FILTROS */}
      <div className="flex gap-3">
        <input
          placeholder="Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="p-2 rounded border w-full"
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

      {/* CARDS */}
      {loading ? (
        <div className="text-center text-gray-400">Carregando...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">

          {territorios.map((t) => (
            <div key={t.id} className="bg-slate-800 p-4 rounded-xl shadow">

              <div className="flex justify-between">
                <h3 className="text-lg font-bold text-white">
                  #{t.numero}
                </h3>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    t.status === "DISPONIVEL"
                      ? "bg-green-200 text-green-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {t.status}
                  
                  {t.atrasado && (
                    <span className="text-red-500 text-xs font-semibold">
                      ⚠ Atrasado
                    </span>
                  )}
                </span>
              </div>

              <p className="text-gray-400 mt-2">
                {t.responsavel?.nome || "Sem responsável"}
              </p>

              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => {
                    setEditingId(t.id);
                    setForm(t);
                    setModalOpen(true);
                  }}
                  className="text-blue-400"
                >
                  Editar
                </button>

                <button
                  onClick={() => excluir(t.id)}
                  className="text-red-400"
                >
                  Excluir
                </button>

                {t.status === "DISPONIVEL" ? (
                  <button
                    onClick={() => {
                      setSelectedTerritorio(t.id);
                      setModalRetirar(true);
                    }}
                    className="text-yellow-400"
                  >
                    Retirar
                  </button>
                ) : (
                  <button
                    onClick={() => devolver(t.id)}
                    className="text-green-400"
                  >
                    Devolver
                  </button>
                )}

              </div>
            </div>
          ))}

        </div>
      )}

      {/* PAGINAÇÃO */}
      <div className="flex justify-between">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          ←
        </button>

        <span className="text-gray-400">
          Página {page + 1} de {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          →
        </button>
      </div>

      {/* MODAL RETIRAR */}
      {modalRetirar && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded">

            <select
              value={publicadorId}
              onChange={(e) => setPublicadorId(e.target.value)}
              className="p-2 border w-full mb-4"
            >
              <option value="">Selecione</option>
              {publicadores.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>

            <button
              onClick={retirar}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Confirmar
            </button>

          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="font-bold mb-4">
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
              placeholder="Mapa URL"
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
    </div>
  );
}