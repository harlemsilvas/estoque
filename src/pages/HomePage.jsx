import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Login";
import "../assets/styles/global.css";
//import "../assets/styles/HomePage.css";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  // If user is not authenticated, show login form
  if (!user) {
    return (
      <div className="page-container">
        <div className="login-container">
          <h1>Controle de Estoque Inteligente</h1>
          <p>Faça login para acessar o sistema</p>
          <Login />
          <div className="auth-links">
            <Link to="/registrar">Não tem conta? Registre-se</Link>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  return (
    <div className="page-container">
      <h1>Bem-vindo, {user.name}!</h1>
      <h2>Controle de Estoque Inteligente</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>📊 Dashboard</h3>
          <p>Visão geral do sistema</p>
        </div>
      </div>

      <div className="home-links">
        <Link to="/produtos" className="nav-button">
          <span>📦 Gerenciar Produtos</span>
        </Link>
        <Link to="/marcas" className="nav-button">
          <span>🏷️ Gerenciar Marcas</span>
        </Link>
        <Link to="/movimentacao" className="nav-button">
          <span>📋 Nova Movimentação</span>
        </Link>
        <Link to="/movimentacoes" className="nav-button">
          <span>📈 Histórico de Movimentações</span>
        </Link>
        {(user.role === "ADMIN" || user.role === "MANAGER") && (
          <Link to="/controle-inventario" className="nav-button">
            <span>🎯 Controle de Inventário</span>
          </Link>
        )}
        {user.role === "ADMIN" && (
          <Link to="/usuarios" className="nav-button">
            <span>👥 Gerenciar Usuários</span>
          </Link>
        )}
        <Link to="/sobre" className="nav-button">
          <span>ℹ️ Sobre o Sistema</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
