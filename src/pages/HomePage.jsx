import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/global.css";
//import "../assets/styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="page-container">
      <h1>Controle de Estoque Inteligente</h1>
      <div className="home-links">
        <Link to="/produtos" className="nav-button">
          <span>📦 Gerenciar Produtos</span>
        </Link>
        <Link to="/marcas" className="nav-button">
          <span>🏷️ Gerenciar Marcas</span>
        </Link>
        <Link to="/sobre" className="nav-button">
          <span>ℹ️ Sobre o Sistema</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
