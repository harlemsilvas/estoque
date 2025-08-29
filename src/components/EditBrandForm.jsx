import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMarca, updateMarca } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { formatDateBR } from "../utils/dateUtils";

const EditBrandForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [marca, setMarca] = useState({
    nome: "",
    data_cadastro: "",
  });
  const [originalMarca, setOriginalMarca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMarca = async () => {
      try {
        const response = await getMarca(id);
        setMarca(response.data);
        setOriginalMarca(response.data); // Save original data for comparison
      } catch (error) {
        setError("Erro ao carregar marca");
        console.error("Erro ao carregar marca:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarca();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Compare original data with current data to track changes
      const changes = {};
      Object.keys(marca).forEach((key) => {
        if (originalMarca[key] !== marca[key]) {
          changes[key] = [originalMarca[key], marca[key]];
        }
      });

      // Only proceed if there are actual changes
      if (Object.keys(changes).length === 0) {
        navigate("/marcas", {
          state: { info: "Nenhuma alteração foi feita." },
        });
        return;
      }

      // Create updated brand object with history
      const updatedMarca = {
        ...marca,
        historico: [
          ...(originalMarca.historico || []),
          {
            data: new Date().toISOString(),
            usuario: user?.name || "Sistema",
            alteracoes: changes,
          },
        ],
      };

      await updateMarca(id, updatedMarca);
      navigate("/marcas", {
        state: { success: "Marca atualizada com sucesso!" },
      });
    } catch (err) {
      setError("Erro ao atualizar marca: " + err.message);
    }
  };

  const handleChange = (e) => {
    setMarca({
      ...marca,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-form-container">
      <h2>Editar Marca</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome da Marca:</label>
          <input
            type="text"
            name="nome"
            value={marca.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Data de Cadastro:</label>
          <input
            type="text"
            name="data_cadastro"
            value={formatDateBR(marca.data_cadastro)}
            disabled
            style={{
              backgroundColor: "#f8f9fa",
              color: "#6c757d",
            }}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/marcas")}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button type="submit" className="save-button">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBrandForm;
