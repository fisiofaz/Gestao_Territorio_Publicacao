import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import MainLayout from "./layout/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Publicadores from "./pages/Publicadores";
import Territorios from "./pages/Territorios";
import Publicacoes from "./pages/Publicacoes";
import Pedidos from "./pages/Pedidos";


function App() {
  const { user } = useAuth();

  // 🔥 BLOQUEIA enquanto valida autenticação
  if (user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

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