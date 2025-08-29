import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createProduto, getMarcas, getProdutoByEan } from "../services/api";

const ProductForm = ({ onProductCreated }) => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [existingProduct, setExistingProduct] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const [produto, setProduto] = useState({
    ean: "",
    descricao: "",
    marca_id: "",
    estoque_minimo: 0,
  });

  // Buscar marcas e configurar máscara do EAN
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await getMarcas();
        setMarcas(response.data);
      } catch (err) {
        setError(`Erro ao carregar marca: ${err.message}`);
      }
    };
    fetchMarcas();
  }, []);

  // Busca automática de produto ao alterar EAN
  useEffect(() => {
    const searchProduct = async () => {
      if (validateEAN(produto.ean)) {
        try {
          const response = await getProdutoByEan(produto.ean);
          // Check if response has data and if array has items
          if (
            response.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            setExistingProduct(response.data[0]);
            setError("Produto já cadastrado! Deseja editar?");
          } else {
            // No existing product found, clear any previous warnings
            setExistingProduct(null);
            setError("");
          }
        } catch (err) {
          console.warn("Product search error:", err);
          // If search fails (like 404), assume product doesn't exist
          setExistingProduct(null);
          setError("");
        }
      } else {
        // Invalid EAN, clear existing product
        setExistingProduct(null);
        setError("");
      }
    };

    const delaySearch = setTimeout(searchProduct, 500);
    return () => clearTimeout(delaySearch);
  }, [produto.ean]);

  // Validação e formatação do EAN
  const validateEAN = (ean) => /^\d{13}$/.test(ean);

  const formatEAN = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .slice(0, 13)
      .replace(/(\d{2})(\d{5})(\d{5})(\d{1})/, "$1 $2 $3 $4");
  };

  // Manipulação do scanner
  const handleScan = (data) => {
    if (data) {
      setProduto({ ...produto, ean: data.replace(/\D/g, "") });
      setShowScanner(false);
    }
  };

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Validate required fields
    if (!produto.ean.trim()) {
      setError("EAN é obrigatório");
      setLoading(false);
      return;
    }

    if (!produto.descricao.trim()) {
      setError("Descrição é obrigatória");
      setLoading(false);
      return;
    }

    if (!produto.marca_id) {
      setError("Marca é obrigatória");
      setLoading(false);
      return;
    }

    if (existingProduct) {
      setError("Produto já existe! Use a edição ou altere o EAN");
      setLoading(false);
      return;
    }

    if (!validateEAN(produto.ean)) {
      setError("EAN inválido - deve conter exatamente 13 dígitos");
      setLoading(false);
      return;
    }

    try {
      const novoProduto = {
        id: Date.now().toString(), // Generate unique ID
        ean: produto.ean,
        descricao: produto.descricao.trim(),
        marca_id: produto.marca_id,
        estoque_minimo: parseInt(produto.estoque_minimo) || 0,
        estoque_atual: 0, // Start with 0 stock
        data_cadastro: new Date().toISOString().split("T")[0],
        ativo: true,
      };

      console.log("Creating product:", novoProduto);
      const response = await createProduto(novoProduto);
      console.log("Product created successfully:", response.data);

      setSuccessMessage("Produto cadastrado com sucesso!");
      setError("");

      // Reset form
      setProduto({ ean: "", descricao: "", marca_id: "", estoque_minimo: 0 });
      setExistingProduct(null);

      if (onProductCreated) {
        onProductCreated(response.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error creating product:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Erro desconhecido ao cadastrar produto";
      setError(`Erro ao cadastrar produto: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h2>
        Cadastro de Produto {loading && <span className="loading-spinner" />}
      </h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className={showScanner ? "blurred" : ""}>
        <div className="form-group">
          <label>
            Código EAN:
            <div className="ean-input-group">
              <input
                type="text"
                name="ean"
                value={formatEAN(produto.ean)}
                onChange={(e) =>
                  setProduto({
                    ...produto,
                    ean: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="00 00000 00000 0"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="scanner-button"
                disabled={loading}
              >
                📷
              </button>
            </div>
          </label>
        </div>

        {existingProduct && (
          <div className="existing-product-warning">
            <p>Produto já cadastrado em {existingProduct.data_cadastro}</p>
            <p>Última movimentação: {existingProduct.ultima_movimentacao}</p>
          </div>
        )}

        <div className="form-group">
          <label>
            Descrição:
            <input
              type="text"
              name="descricao"
              value={produto.descricao}
              onChange={(e) =>
                setProduto({ ...produto, descricao: e.target.value })
              }
              disabled={loading || !!existingProduct}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Marca:
            <select
              name="marca_id"
              value={produto.marca_id}
              onChange={(e) =>
                setProduto({ ...produto, marca_id: e.target.value })
              }
              disabled={loading || !!existingProduct}
              required
            >
              <option value="">Selecione uma marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nome}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            Estoque Mínimo:
            <input
              type="number"
              name="estoque_minimo"
              value={produto.estoque_minimo}
              onChange={(e) =>
                setProduto({
                  ...produto,
                  estoque_minimo: Math.max(0, parseInt(e.target.value) || 0),
                })
              }
              disabled={loading || !!existingProduct}
              min="0"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading || !!existingProduct}
        >
          {loading ? "Cadastrando..." : "Cadastrar Produto"}
        </button>
      </form>
    </div>
  );
};
ProductForm.propTypes = {
  onProductCreated: PropTypes.func.isRequired, // ou .func se não for obrigatório
};

export default ProductForm;
