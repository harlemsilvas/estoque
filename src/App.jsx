// src/App.jsx
import { useContext } from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import BrandsPage from "./pages/BrandsPage";
import AboutPage from "./pages/AboutPage";
import UsersPage from "./pages/UsersPage";
import MovementPage from "./pages/MovementPage";
import Login from "./components/Login";
import Register from "./components/Register";
import EditProductForm from "./components/EditProductForm";
import EditBrandForm from "./components/EditBrandForm";
import EditUserForm from "./components/EditUserForm";
import ProductHistory from "./components/ProductHistory";
import BrandHistory from "./components/BrandHistory";
import MovementsList from "./components/MovementsList";
import InventoryControl from "./components/InventoryControl";
import PrivateRoute from "./components/PrivateRoute";
import "./assets/styles/UsersPage.css";

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      {/* Menu de Navegação */}
      <nav className="main-nav">
        <div className="nav-brand">
          <Link to="/">Controle de Estoque</Link>
        </div>

        <div className="nav-links">
          {user && (
            <>
              <NavLink
                to="/produtos"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Produtos
              </NavLink>
              <NavLink to="/marcas">Marcas</NavLink>
              <NavLink to="/movimentacao">Movimentação</NavLink>
              <NavLink to="/movimentacoes">Histórico</NavLink>
              {user.role === "ADMIN" && (
                <NavLink to="/usuarios">Usuários</NavLink>
              )}
            </>
          )}
        </div>

        <div className="nav-auth">
          {user ? (
            <>
              <span>Olá, {user.name}</span>
              <button onClick={logout}>Sair</button>
            </>
          ) : (
            <NavLink to="/">Entrar</NavLink>
          )}
        </div>
      </nav>

      {/* Resto das rotas */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/usuarios/novo" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios/editar/:id"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <EditUserForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/produtos"
          element={
            <PrivateRoute roles={["ADMIN", "MANAGER"]}>
              <ProductsPage />
            </PrivateRoute>
          }
        />
        <Route path="/marcas" element={<BrandsPage />} />
        <Route path="/movimentacao" element={<MovementPage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/produtos/editar/:id" element={<EditProductForm />} />
        <Route path="/marcas/editar/:id" element={<EditBrandForm />} />
        <Route path="/produtos/historico/:id" element={<ProductHistory />} />
        <Route path="/marcas/historico/:id" element={<BrandHistory />} />
        <Route path="/movimentacoes" element={<MovementsList />} />
        <Route path="/controle-inventario" element={<InventoryControl />} />
        <Route path="/produtos/historico/:id" element={<ProductHistory />} />
      </Routes>
    </div>
  );
}

export default App;
