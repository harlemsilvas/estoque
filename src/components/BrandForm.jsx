import { useState } from "react";
import { createMarca } from "../services/api";
import { getCurrentDateBR } from "../utils/dateUtils";

// eslint-disable-next-line react/prop-types
const BrandForm = ({ onBrandCreated }) => {
  const [marca, setMarca] = useState({ nome: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!marca.nome.trim()) {
      setError("O nome da marca é obrigatório");
      setLoading(false);
      return;
    }

    try {
      const novaMarca = {
        ...marca,
        data_cadastro: getCurrentDateBR(), // Use DD/MM/YYYY format
      };

      const response = await createMarca(novaMarca);

      setSuccess("Marca cadastrada com sucesso!");
      setError("");
      setMarca({ nome: "" });

      if (onBrandCreated) onBrandCreated(response.data);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`Erro: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-form">
      <h2>Cadastro de Marca</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Nome da Marca:
            <input
              type="text"
              value={marca.nome}
              onChange={(e) => setMarca({ ...marca, nome: e.target.value })}
              required
              disabled={loading}
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Marca"}
        </button>
      </form>
    </div>
  );
};

export default BrandForm;
