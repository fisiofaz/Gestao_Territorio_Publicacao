import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Publicadores() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [publicadores, setPublicadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
  });

   // 🔥 TOAST AUTO HIDE
  useEffect(() => {
    if (toast) {
      setTimeout(() => setToast(null), 3000);
    }
  }, [toast]);

  

   // 🔥 FETCH
  const carregarPublicadores = async () => {
    try {
      setLoading(true);
      const res = await api.get("/publicadores");
      setPublicadores(res.data);
    } catch (err) {
      setToast("Erro ao carregar dados", err);
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
    try {   
      if (!form.nome || !form.telefone) {
        alert("Preencha todos os campos");
        return;
      }

      setSaving(true);

      if (editingId) {
        // EDITAR
        await api.put(`/publicadores/${editingId}`, form);
        setToast("Publicador atualizado!");
      } else {
        // CRIAR
        await api.post("/publicadores", form);
        setToast("Publicador criado!");
      }

      await carregarPublicadores();
      setForm({ nome: "", telefone: "" });
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      setToast("Erro ao salvar dados", err);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

   // 🔥 DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`/publicadores/${id}`);
      setToast("Excluído com sucesso!");
      await carregarPublicadores();
    } catch (err) {
      setToast("Erro ao excluir", err);
    }
  }; 

  return (
    <div className="space-y-6">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Publicadores</h1>

        <button
          onClick={() => {
            setForm({ nome: "", telefone: "" });
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Novo Publicador
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Telefone</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {publicadores.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.nome}</td>
                  <td className="p-3">{p.telefone}</td>

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setForm(p);
                        setEditingId(p.id);
                        setShowModal(true);
                      }}
                      className="text-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500"
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
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-[400px]">          

            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Editar" : "Novo"}
            </h2>
           
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
                placeholder-gray-400 dark:placeholder-gray-400
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
                placeholder-gray-400 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />        

            <div className="flex justify-between gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
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