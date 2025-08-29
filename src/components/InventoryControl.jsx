import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProdutoByEan, createMovimentacao } from "../services/api";
import "../assets/styles/InventoryControl.css";

const InventoryControl = () => {
  const [ean, setEan] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [quantidade, setQuantidade] = useState("");
  const [produto, setProduto] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!ean.trim()) {
      setError("Digite um EAN para buscar");
      return;
    }

    try {
      console.log("🔍 Searching product with EAN:", ean);
      const response = await getProdutoByEan(ean);
      console.log("📋 Search response:", response.data);

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setProduto(response.data[0]);
        setError("");
        console.log("✅ Product found:", response.data[0]);
      } else {
        setError("Produto não encontrado com este EAN");
        setProduto(null);
        console.log("⚠️ No product found for EAN:", ean);
      }
    } catch (err) {
      console.error("❌ Search error:", err);
      setError("Erro ao buscar produto");
      setProduto(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantidade || parseInt(quantidade) <= 0) {
      setError("Digite uma quantidade válida");
      return;
    }

    try {
      const movimentacao = {
        id: Date.now().toString(), // Generate unique ID
        ean: ean,
        tipo: tipo,
        quantidade: parseInt(quantidade),
        data: new Date().toISOString(),
        usuario: "usuario_logado", // TODO: Get from auth context
        produto_descricao: produto.descricao, // Add product description for reference
      };

      console.log("📦 Creating movement:", movimentacao);
      const response = await createMovimentacao(movimentacao);
      console.log("✅ Movement created successfully:", response.data);

      // Clear form
      setEan("");
      setQuantidade("");
      setProduto(null);
      setError("");

      // Show success message
      alert(
        `✅ Movimentação de ${tipo} registrada com sucesso!\nQuantidade: ${quantidade}\nProduto: ${produto.descricao}`
      );

      // Navigate to movements list
      navigate("/movimentacoes");
    } catch (err) {
      console.error("❌ Error creating movement:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Erro desconhecido";
      setError(`Erro ao registrar movimentação: ${errorMessage}`);
    }
  };

  return (
    <div className="inventory-control">
      <h2>Controle de Movimentações</h2>

      <div className="search-section">
        <h3>🔍 Buscar Produto</h3>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Digite o EAN (13 dígitos)"
            value={ean}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Only numbers
              setEan(value);
              if (produto) setProduto(null); // Clear product when EAN changes
            }}
            maxLength="13"
            pattern="\d{13}"
          />
          <button
            onClick={handleSearch}
            disabled={ean.length !== 13}
            style={{
              backgroundColor: ean.length === 13 ? "#28a745" : "#6c757d",
              cursor: ean.length === 13 ? "pointer" : "not-allowed",
            }}
          >
            Buscar Produto
          </button>
        </div>
        {ean.length > 0 && ean.length !== 13 && (
          <p style={{ color: "#ffc107", fontSize: "12px", margin: "5px 0" }}>
            ⚠️ EAN deve ter exatamente 13 dígitos (atual: {ean.length})
          </p>
        )}
      </div>

      {produto && (
        <div className="product-section">
          <h3>✅ Produto Encontrado</h3>
          <div className="product-info">
            <p>
              <strong>Descrição:</strong> {produto.descricao}
            </p>
            <p>
              <strong>EAN:</strong> {produto.ean}
            </p>
            <p>
              <strong>Estoque Atual:</strong> {produto.estoque_atual || 0}
            </p>
            <p>
              <strong>Estoque Mínimo:</strong> {produto.estoque_minimo}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tipo de Operação:</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="ENTRADA">🟢 Entrada</option>
                <option value="SAIDA">🔴 Saída</option>
                <option value="INVENTARIO">🟡 Inventário</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantidade:</label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                min="1"
                required
                placeholder="Digite a quantidade"
              />
            </div>

            <button
              type="submit"
              disabled={!quantidade || parseInt(quantidade) <= 0}
              style={{
                backgroundColor:
                  quantidade && parseInt(quantidade) > 0
                    ? "#007bff"
                    : "#6c757d",
                cursor:
                  quantidade && parseInt(quantidade) > 0
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              📦 Registrar Movimentação
            </button>
          </form>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InventoryControl;
