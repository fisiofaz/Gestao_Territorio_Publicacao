import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function Publicadores() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [publicadores, setPublicadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { user } = useAuth();

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
  });

  // 🔥 FETCH
  const carregarPublicadores = async () => {
    try {
      setLoading(true);

      const res = await api.get("/publicadores", {
        params: {
          page: 0,
          size: 10,
        },
      });

      // suporta backend com ou sem paginação
      setPublicadores(res.data.content || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api.get("/publicadores");

        if (mounted) {
          setPublicadores(res.data.content || res.data);
        }
      } catch (err) {
        if (mounted) toast.error("Erro ao carregar", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // 🔥 FECHAR MODAL COM ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // 🔥 SALVAR
  const handleSave = async () => {
    if (!form.nome || !form.telefone) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/publicadores/${editingId}`, form);
        toast.success("Atualizado com sucesso!");
      } else {
        await api.post("/publicadores", form);
        toast.success("Criado com sucesso!");
      }

      await carregarPublicadores();
      setForm({ nome: "", telefone: "" });
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((msg) => {
          toast.error(msg);
        });
      } else {
        toast.error("Erro ao salvar");
      }
    } finally {
      setSaving(false);
    }
  };

  // 🔥 DELETE COM CONFIRMAÇÃO MODERNA
  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span>Tem certeza que deseja excluir?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              await api.delete(`/publicadores/${id}`);
              toast.dismiss(t.id);
              toast.success("Excluído!");
              carregarPublicadores();
            }}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Sim
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2 py-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">
          Publicadores
        </h1>

        <button
          onClick={() => {
            setForm({ nome: "", telefone: "" });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Novo Publicador
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10 animate-pulse">
          Carregando...
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Telefone</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {publicadores.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-10">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <span className="text-4xl">📭</span>
                      <p>Nenhum publicador cadastrado</p>
                    </div>
                  </td>
                </tr>
              ) : (
                publicadores.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-100">
                      {p.nome}
                    </td>

                    <td className="p-3 text-gray-800 dark:text-gray-100">
                      {p.telefone}
                    </td>

                    <td className="p-3 text-right space-x-3">
                      {user?.role === "ADMIN" && (
                        <>
                          <button
                            onClick={() => {
                              setForm({
                                nome: p.nome,
                                telefone: p.telefone,
                              });
                              setEditingId(p.id);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 hover:underline"
                          >
                            Excluir
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-[400px] shadow-xl">

            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {editingId ? "Editar Publicador" : "Novo Publicador"}
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Nome"
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"
              />

              <input
                placeholder="Telefone"
                value={form.telefone}
                onChange={(e) =>
                  setForm({ ...form, telefone: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div className="flex justify-between mt-5">
              <button onClick={() => setShowModal(false)}>
                Cancelar
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}