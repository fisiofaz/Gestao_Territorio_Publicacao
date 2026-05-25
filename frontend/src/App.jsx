import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layout/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";
import Loader from "./components/Loader";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Publicadores from "./pages/Publicadores";
import Territorios from "./pages/Territorios";
import Publicacoes from "./pages/Publicacoes";
import Pedidos from "./pages/Pedidos";
import AdminPage from "./pages/AdminPage";


function App() {
  const { user, loading } = useAuth();

  // 🔥 BLOQUEIA APP INTEIRO (SEM FLICKER)
  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>

        {/* LOGIN */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* REDIRECIONAMENTO */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

       {/* ROTAS PROTEGIDAS */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="/admin"
            element={
              <PrivateRoute role="ADMIN">
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/publicadores" element={<Publicadores />} />
          <Route path="/territorios" element={<Territorios />} />
          <Route path="/publicacoes" element={<Publicacoes />} />
          <Route path="/pedidos" element={<Pedidos />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;