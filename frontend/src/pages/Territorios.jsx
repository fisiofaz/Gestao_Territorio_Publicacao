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
  const [selectedTerritorio, setSelectedTerritorio] = useState(null);
  const [publicadorId, setPublicadorId] = useState("");

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("ALL");

  // 🔥 CARREGAR DADOS
  const fetchDataWithParams = async (pageParam, buscaParam, statusParam) => {
    setLoading(true);
    try {
      const res = await api.get("/territorios", {
        params: {
          page: pageParam - 1,
          size: 5,
          busca: buscaParam || undefined,
          status: statusParam === "ALL" ? undefined : statusParam,
          sort: "asc"
        }
      });

      const data = res.data;

      setTerritorios(Array.isArray(data) ? data : data.content || []);
      setTotalPages(data.totalPages || 1);

    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    const loadPublicadores = async () => {
      try {
        const res = await api.get("/publicadores");
        setPublicadores(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadPublicadores();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataWithParams(1, busca, status);
      setPage(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [busca, status]);

  // 🔥 RETIRAR
  const retirar = async () => {
    try {
      await api.post(
        `/territorios/${selectedTerritorio}/retirar/${publicadorId}`
      );

      toast.success("Território retirado!");
      setModalOpen(false);
      setPublicadorId("");
      fetchDataWithParams(page, busca, status);
    } catch {
      toast.error("Erro ao retirar território");
    }
  };

  // 🔥 DEVOLVER
  const devolver = async (id) => {
    try {
      await api.post(`/territorios/${id}/devolver`);
      toast.success("Território devolvido!");
      fetchDataWithParams(page, busca, status);
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
      <div>
        <h1 className="text-2xl font-bold dark:text-white">
          Territórios
        </h1>
        <p className="text-gray-500">
          Gestão de cartões de território
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">

        <input
          type="text"
          placeholder="Buscar território..."
          value={busca}
          onChange={(e) => {
            const value = e.target.value;
            setBusca(value);
            setPage(0);
          }}
          className="p-2 border rounded"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          className="p-2 border rounded"
        >
          <option value="ALL">Todos</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="EM_USO">Em uso</option>
        </select>

      </div>

      {/* TABELA */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">

        {/* HEADER DESKTOP */}
        <div className="hidden md:grid grid-cols-4 px-6 py-3 text-sm font-semibold 
          text-gray-500 dark:text-gray-400 border-b dark:border-slate-700">
          <span>Cartão</span>
          <span>Status</span>
          <span>Responsável</span>
          <span className="text-right">Ações</span>
        </div>

        {/* LINHAS */}
        {territorios.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-1 md:grid-cols-4 px-6 py-4 items-center 
            border-b last:border-none dark:border-slate-700
            hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >

            {/* CARTÃO */}
            <div className="font-medium text-gray-800 dark:text-white">
              {t.numero}
            </div>

            {/* STATUS */}
            <div className="mt-2 md:mt-0">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  t.status === "EM_USO"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {t.status}
              </span>
            </div>

            {/* RESPONSÁVEL */}
            <div className="mt-2 md:mt-0">
              {t.responsavel?.nome || "Disponível"}
            </div>

            {/* AÇÕES */}
            <div className="flex gap-3 justify-end mt-3 md:mt-0">

              {t.status === "DISPONIVEL" ? (
                <button
                  onClick={() => {
                    setSelectedTerritorio(t.id);
                    setModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Retirar
                </button>
              ) : (
                <button
                  onClick={() => devolver(t.id)}
                  className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                >
                  Devolver
                </button>
              )}

              {t.mapaUrl && (
                <a
                  href={t.mapaUrl}
                  target="_blank"
                  className="text-gray-500 hover:text-black text-sm"
                >
                  Ver mapa
                </a>
              )}

            </div>

          </div>
        ))}
      </div>

      {/* MODAL RETIRADA */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-[400px] shadow-lg">

            <h2 className="text-lg font-bold mb-4 dark:text-white">
              Retirar Território
            </h2>

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
              <button onClick={() => setModalOpen(false)}>
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

      <div className="flex justify-between mt-4">

        <button
          disabled={page === 0}
          onClick={() => {
            const newPage = page - 1;
            setPage(newPage);
            fetchDataWithParams(newPage, busca, status);
          }}
        >
           ← Anterior
        </button>

        <span>Página {page + 1} de {totalPages}</span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => {
            const newPage = page + 1;
            setPage(newPage);
            fetchDataWithParams(newPage, busca, status);
          }}
        >
          Próxima →
        </button>

      </div>

    </div>
  );
}