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

        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Layout envolvendo tudo */}
        <Route element={<MainLayout />}>

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