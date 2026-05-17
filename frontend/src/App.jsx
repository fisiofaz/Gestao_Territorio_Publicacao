import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Publicadores from "./pages/Publicadores";
import Territorios from "./pages/Territorios";
import Publicacoes from "./pages/Publicacoes";
import Pedidos from "./pages/Pedidos";


function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* REDIRECIONAMENTO */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* ROTAS PROTEGIDAS */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/publicadores"
          element={
            <MainLayout>
              <Publicadores />
            </MainLayout>
          }
        />

        <Route
          path="/territorios"
          element={
            <MainLayout>
              <Territorios />
            </MainLayout>
          }
        />

        <Route
          path="/publicacoes"
          element={
            <MainLayout>
              <Publicacoes />
            </MainLayout>
          }
        />

        <Route
          path="/pedidos"
          element={
            <MainLayout>
              <Pedidos />
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;