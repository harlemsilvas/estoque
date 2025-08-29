import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProduto, getMovimentacoesByEan } from "../services/api";
import "../assets/styles/InventoryControl.css";

const ProductHistory = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // First load the product to get the EAN
        console.log("📦 Loading product with ID:", id);
        const prodResponse = await getProduto(id);
        const productData = prodResponse.data;
        setProduto(productData);

        console.log("📊 Product loaded:", productData);

        // Then load movements using the product's EAN
        if (productData && productData.ean) {
          console.log("📈 Loading movements for EAN:", productData.ean);
          const movResponse = await getMovimentacoesByEan(productData.ean);
          console.log("📉 Movements loaded:", movResponse.data);
          setMovimentacoes(movResponse.data || []);
        } else {
          console.warn("⚠️ Product has no EAN, cannot load movements");
          setMovimentacoes([]);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar histórico:", err);
        setError(`Erro ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="product-history">
        <div className="loading">🔄 Carregando histórico...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-history">
        <div className="error-message">{error}</div>
        <button onClick={() => window.history.back()}>Voltar</button>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="product-history">
        <div className="error-message">Produto não encontrado</div>
        <button onClick={() => window.history.back()}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="product-history">
      <div className="product-info">
        <h2>Histórico de Movimentações</h2>
        <div className="product-details">
          <p>
            <strong>Produto:</strong> {produto.descricao}
          </p>
          <p>
            <strong>EAN:</strong> {produto.ean}
          </p>
          <p>
            <strong>Estoque Atual:</strong> {produto.estoque_atual || 0}
          </p>
        </div>
      </div>

      {movimentacoes.length === 0 ? (
        <div className="no-movements">
          <p>📎 Nenhuma movimentação encontrada para este produto.</p>
          <p>As movimentações aparecerão aqui quando forem registradas.</p>
        </div>
      ) : (
        <div className="movements-table">
          <h3>Movimentações ({movimentacoes.length})</h3>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Usuário</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((mov) => (
                <tr key={mov.id}>
                  <td>{new Date(mov.data).toLocaleString("pt-BR")}</td>
                  <td className={`type-${mov.tipo.toLowerCase()}`}>
                    {mov.tipo === "ENTRADA"
                      ? "🟢"
                      : mov.tipo === "SAIDA"
                      ? "🔴"
                      : "🟡"}{" "}
                    {mov.tipo}
                  </td>
                  <td>{mov.quantidade}</td>
                  <td>{mov.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="actions">
        <button onClick={() => window.history.back()} className="btn-back">
          ← Voltar
        </button>
      </div>
    </div>
  );
};

export default ProductHistory;
