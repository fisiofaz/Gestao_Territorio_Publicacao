import { useEffect, useState } from "react";
import { api } from "../services/api";


export default function Mapa() {
  const [territorios, setTerritorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("ALL");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/territorios", {
        params: {
          busca: busca || undefined,
          status: status === "ALL" ? undefined : status
        }
      });

      setTerritorios(res.data.content || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
        await Promise.resolve(); // 👈 quebra o sync
        fetchData();
    };

    load();
    }, [busca, status]);

  if (loading) {
    return <div className="p-6">Carregando mapa...</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Mapa de Territórios
        </h1>
        <p className="text-gray-500">
          Visualização geral dos territórios
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-3">

        <input
          type="text"
          placeholder="Buscar território..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="p-2 border rounded dark:bg-slate-700 dark:text-white"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded dark:bg-slate-700 dark:text-white"
        >
          <option value="ALL">Todos</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="EM_USO">Em uso</option>
        </select>

      </div>

      {/* GRID DE CARDS */}
      {territorios.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Nenhum território encontrado 😢
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {territorios.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-lg transition p-5 space-y-3"
            >

              {/* HEADER CARD */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  Cartão {t.numero}
                </h2>

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
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Responsável:
                <span className="ml-1 font-medium text-gray-800 dark:text-white">
                  {t.responsavel?.nome || "Disponível"}
                </span>
              </div>

              {/* DESCRIÇÃO */}
              {t.descricao && (
                <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {t.descricao}
                </div>
              )}

              {/* AÇÕES */}
              <div className="flex justify-between items-center pt-3">

                {t.mapaUrl ? (
                  <a
                    href={t.mapaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver mapa
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">
                    Sem mapa
                  </span>
                )}

                <span className="text-xs text-gray-400">
                  #{t.id}
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}