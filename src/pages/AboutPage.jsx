// import React from "react";

// const AboutPage = () => {
//   return (
//     <div className="page-container">
//       <h1>Sobre o Sistema</h1>
//       <div className="about-content">
//         <p>Sistema de Controle de Estoque versão 1.0</p>
//         <p>Desenvolvido com React e JSON Server</p>
//         <p>Funcionalidades principais:</p>
//         <ul>
//           <li>Cadastro de produtos com código de barras</li>
//           <li>Gestão de marcas</li>
//           <li>Controle de estoque mínimo</li>
//           <li>Histórico de movimentações</li>
//         </ul>
//       </div>
//     </div>
//   );
// };
const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-card">
        <h1>Sistema de Controle de Estoque</h1>
        <p className="text-secondary">Versão 2.0 - Gestão Inteligente</p>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">15+</div>
            <div className="stat-label">Funcionalidades</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Disponibilidade</div>
          </div>
        </div>

        <div className="feature-grid">
          <div className="feature-item">
            <h3>📦 Gestão de Produtos</h3>
            <p>Controle completo com código de barras</p>
          </div>
          <div className="feature-item">
            <h3>📈 Relatórios</h3>
            <p>Geração automática de indicadores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
