import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export default function Publicadores() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [publicadores, setPublicadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);  

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
  });   

   // 🔥 FETCH
  const carregarPublicadores = async () => {
    try {
      setLoading(true);
      const res = await api.get("/publicadores");
      setPublicadores(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await carregarPublicadores();
    };
    fetchData();
  }, []);
    
  // 🔥 SALVAR (CREATE / UPDATE)
  const handleSave = async () => { 
    if (!form.nome || !form.telefone) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        // EDITAR
        await api.put(`/publicadores/${editingId}`, form);
        toast.success("Atualizado com sucesso!");
      } else {
        // CRIAR
        await api.post("/publicadores", form);
        toast.success("Criado com sucesso!");
      }

      await carregarPublicadores();
      setForm({ nome: "", telefone: "" });
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      toast.error("Erro ao salvar dados");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

   // 🔥 DELETE
  const handleDelete = async (id) => {
    const confirmar = confirm("Tem certeza que deseja excluir?");
    if (!confirmar) return;

    try {
      await api.delete(`/publicadores/${id}`);
      toast.success("Excluído com sucesso!");
      await carregarPublicadores();
    } catch (err) {
      toast.error("Erro ao excluir");
      console.error(err);
    }
  }; 

  return (
    <div className="space-y-6">      

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Publicadores</h1>

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
              {publicadores.map((p) => (
                <tr 
                  key={p.id} 
                  className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="p-3 gap-2 text-gray-800 dark:text-gray-100">
                    {p.nome}
                  </td>
                  <td className="p-3 text-gray-800 dark:text-gray-100">
                    {p.telefone}
                  </td>

                  <td className="p-3 text-right space-x-3">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-[400px] shadow-xl">          

            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
               {editingId ? "Editar Publicador" : "Novo Publicador"}
            </h2>
           
            <div className="space-y-3">           
              <input
                type="text"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
                className="
                  w-full p-2 rounded border
                 bg-gray-100 text-gray-900 border-gray-300
                 dark:bg-slate-700 dark:text-white dark:border-slate-600
                 placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
              <input
                type="text"
                placeholder="Telefone"
                value={form.telefone}
                onChange={(e) =>
                  setForm({ ...form, telefone: e.target.value })
                }
                className="
                  w-full p-2 rounded border
                 bg-gray-100 text-gray-900 border-gray-300
                 dark:bg-slate-700 dark:text-white dark:border-slate-600
                 placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
            </div>
            <div className="flex justify-between gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
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