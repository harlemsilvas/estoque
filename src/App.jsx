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
        <Route path="/" element={<HomePage />} />

        {/* Protected Routes - All require authentication */}
        <Route
          path="/usuarios"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios/novo"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <Register />
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
            <PrivateRoute roles={["ADMIN", "MANAGER", "OPERATOR"]}>
              <ProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/produtos/editar/:id"
          element={
            <PrivateRoute roles={["ADMIN", "MANAGER"]}>
              <EditProductForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/produtos/historico/:id"
          element={
            <PrivateRoute>
              <ProductHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/marcas"
          element={
            <PrivateRoute roles={["ADMIN", "MANAGER", "OPERATOR"]}>
              <BrandsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/marcas/editar/:id"
          element={
            <PrivateRoute roles={["ADMIN", "MANAGER"]}>
              <EditBrandForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/marcas/historico/:id"
          element={
            <PrivateRoute>
              <BrandHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/movimentacao"
          element={
            <PrivateRoute roles={["ADMIN", "MANAGER", "OPERATOR"]}>
              <MovementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/movimentacoes"
          element={
            <PrivateRoute>
              <MovementsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/controle-inventario"
          element={
            <PrivateRoute roles={["ADMIN", "MANAGER"]}>
              <InventoryControl />
            </PrivateRoute>
          }
        />
        <Route
          path="/sobre"
          element={
            <PrivateRoute>
              <AboutPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
