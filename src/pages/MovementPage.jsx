import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProdutoByEan,
  createMovimentacao,
  updateProduto,
} from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/InventoryControl.css";

const MovementPage = () => {
  const [ean, setEan] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [quantidade, setQuantidade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [produto, setProduto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!ean.trim()) {
      setError("Digite um EAN para buscar");
      return;
    }

    if (ean.length !== 13) {
      setError("EAN deve ter exatamente 13 dígitos");
      return;
    }

    setSearchLoading(true);
    try {
      console.log("🔍 Searching product with EAN:", ean);
      const response = await getProdutoByEan(ean);
      console.log("📋 Search response:", response.data);

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const foundProduct = response.data[0];
        setProduto(foundProduct);
        setError("");
        console.log("✅ Product found:", foundProduct);
      } else {
        setError("Produto não encontrado com este EAN");
        setProduto(null);
        console.log("⚠️ No product found for EAN:", ean);
      }
    } catch (err) {
      console.error("❌ Search error:", err);
      setError("Erro ao buscar produto");
      setProduto(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const calculateNewStock = () => {
    const currentStock = produto?.estoque_atual || 0;
    const qty = parseInt(quantidade) || 0;

    switch (tipo) {
      case "ENTRADA":
        return currentStock + qty;
      case "SAIDA":
        return Math.max(0, currentStock - qty); // Don't allow negative stock
      case "INVENTARIO":
        return qty; // Set exact quantity
      default:
        return currentStock;
    }
  };

  const validateMovement = () => {
    if (!produto) {
      setError("Busque um produto primeiro");
      return false;
    }

    if (!quantidade || parseInt(quantidade) < 0) {
      setError("Digite uma quantidade válida");
      return false;
    }

    if (tipo === "SAIDA") {
      const currentStock = produto.estoque_atual || 0;
      const requestedQty = parseInt(quantidade);
      if (requestedQty > currentStock) {
        setError(
          `Estoque insuficiente. Disponível: ${currentStock}, Solicitado: ${requestedQty}`
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateMovement()) {
      return;
    }

    setLoading(true);

    try {
      const newStock = calculateNewStock();
      const movementData = {
        id: Date.now().toString(),
        ean: produto.ean,
        tipo: tipo,
        quantidade: parseInt(quantidade),
        estoque_anterior: produto.estoque_atual || 0,
        estoque_novo: newStock,
        data: new Date().toISOString(),
        usuario: user?.name || "usuario_logado",
        observacoes: observacoes.trim() || null,
        produto_descricao: produto.descricao,
      };

      console.log("📦 Creating movement:", movementData);

      // Create movement record
      const movementResponse = await createMovimentacao(movementData);
      console.log("✅ Movement created:", movementResponse.data);

      // Update product stock
      const updatedProduct = {
        ...produto,
        estoque_atual: newStock,
        ultima_movimentacao: new Date().toISOString(),
      };

      console.log("📊 Updating product stock:", updatedProduct);
      const productResponse = await updateProduto(produto.id, updatedProduct);
      console.log("✅ Product updated:", productResponse.data);

      // Show success message
      const successMessage = `✅ Movimentação registrada com sucesso!
Tipo: ${tipo}
Quantidade: ${quantidade}
Estoque anterior: ${produto.estoque_atual || 0}
Novo estoque: ${newStock}
Produto: ${produto.descricao}`;

      alert(successMessage);

      // Reset form
      setEan("");
      setQuantidade("");
      setObservacoes("");
      setProduto(null);
      setError("");

      // Navigate to movements list
      navigate("/movimentacoes");
    } catch (err) {
      console.error("❌ Error processing movement:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Erro desconhecido";
      setError(`Erro ao processar movimentação: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const formatEAN = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.slice(0, 13);
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case "ENTRADA":
        return "📥";
      case "SAIDA":
        return "📤";
      case "INVENTARIO":
        return "📊";
      default:
        return "📦";
    }
  };

  const getMovementDescription = (type) => {
    switch (type) {
      case "ENTRADA":
        return "Adiciona produtos ao estoque";
      case "SAIDA":
        return "Remove produtos do estoque";
      case "INVENTARIO":
        return "Define o estoque exato (substitui o valor atual)";
      default:
        return "";
    }
  };

  return (
    <div className="movement-page">
      <div className="page-header">
        <h1>📦 Movimentação de Produtos</h1>
        <p>Registre entradas, saídas e inventários de produtos</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Search Section */}
      <div className="search-section">
        <h3>🔍 Buscar Produto</h3>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Digite o EAN (13 dígitos)"
            value={ean}
            onChange={(e) => {
              const formattedEAN = formatEAN(e.target.value);
              setEan(formattedEAN);
              if (produto) setProduto(null); // Clear product when EAN changes
              if (error) setError(""); // Clear error when typing
            }}
            maxLength="13"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={ean.length !== 13 || searchLoading || loading}
            className="search-button"
          >
            {searchLoading ? "🔄 Buscando..." : "Buscar"}
          </button>
        </div>
        {ean.length > 0 && ean.length !== 13 && (
          <p className="validation-message">
            ⚠️ EAN deve ter exatamente 13 dígitos (atual: {ean.length})
          </p>
        )}
      </div>

      {/* Product Information */}
      {produto && (
        <div className="product-section">
          <h3>✅ Produto Encontrado</h3>
          <div className="product-info">
            <div className="product-details">
              <p>
                <strong>Descrição:</strong> {produto.descricao}
              </p>
              <p>
                <strong>EAN:</strong> {produto.ean}
              </p>
              <p>
                <strong>Estoque Atual:</strong>{" "}
                <span className="stock-current">
                  {produto.estoque_atual || 0}
                </span>
              </p>
              <p>
                <strong>Estoque Mínimo:</strong> {produto.estoque_minimo}
              </p>
              {produto.estoque_atual <= produto.estoque_minimo && (
                <p className="stock-warning">⚠️ Estoque abaixo do mínimo!</p>
              )}
            </div>
          </div>

          {/* Movement Form */}
          <form onSubmit={handleSubmit} className="movement-form">
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Operação:</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  disabled={loading}
                >
                  <option value="ENTRADA">📥 Entrada</option>
                  <option value="SAIDA">📤 Saída</option>
                  <option value="INVENTARIO">📊 Inventário</option>
                </select>
                <small className="form-help">
                  {getMovementIcon(tipo)} {getMovementDescription(tipo)}
                </small>
              </div>

              <div className="form-group">
                <label>
                  {tipo === "INVENTARIO" ? "Estoque Final:" : "Quantidade:"}
                </label>
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="0"
                  required
                  placeholder={
                    tipo === "INVENTARIO"
                      ? "Estoque atual total"
                      : "Quantidade a movimentar"
                  }
                  disabled={loading}
                />
                {tipo === "INVENTARIO" && quantidade && (
                  <small className="form-help">
                    📊 O estoque será definido como: {quantidade}
                  </small>
                )}
                {tipo !== "INVENTARIO" && quantidade && (
                  <small className="form-help">
                    📈 Novo estoque será: {calculateNewStock()}
                  </small>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Observações (opcional):</label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Adicione observações sobre esta movimentação..."
                rows="3"
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={loading || !quantidade || parseInt(quantidade) < 0}
                className="submit-button"
              >
                {loading
                  ? "🔄 Processando..."
                  : `${getMovementIcon(tipo)} Registrar ${tipo}`}
              </button>

              <button
                type="button"
                onClick={() => navigate("/movimentacoes")}
                className="cancel-button"
                disabled={loading}
              >
                📋 Ver Movimentações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Instructions */}
      {!produto && !error && (
        <div className="instructions">
          <h3>📖 Como usar</h3>
          <ol>
            <li>
              <strong>Digite o EAN:</strong> Código de 13 dígitos do produto
            </li>
            <li>
              <strong>Busque o produto:</strong> Clique em "Buscar" para
              localizar
            </li>
            <li>
              <strong>Selecione o tipo:</strong>
              <ul>
                <li>
                  <strong>📥 Entrada:</strong> Adiciona produtos (recebimento,
                  devolução)
                </li>
                <li>
                  <strong>📤 Saída:</strong> Remove produtos (venda, uso
                  interno)
                </li>
                <li>
                  <strong>📊 Inventário:</strong> Define estoque exato (contagem
                  física)
                </li>
              </ul>
            </li>
            <li>
              <strong>Informe a quantidade:</strong> Digite a quantidade a
              movimentar
            </li>
            <li>
              <strong>Registre:</strong> Confirme para atualizar o estoque
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default MovementPage;
