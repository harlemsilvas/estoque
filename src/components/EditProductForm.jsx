import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduto, updateProduto, getMarcas } from "../services/api";

const EditProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState({
    ean: "",
    descricao: "",
    marca_id: "",
    estoque_minimo: 0,
  });
  const [marcas, setMarcas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodResponse, marcResponse] = await Promise.all([
          getProduto(id),
          getMarcas(),
        ]);

        setProduto(prodResponse.data);
        setMarcas(marcResponse.data);
      } catch (err) {
        setError("Erro ao carregar dados do produto");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduto(id, produto);
      navigate("/produtos", {
        state: { success: "Produto atualizado com sucesso!" },
      });
    } catch (err) {
      setError("Erro ao atualizar produto: " + err.message);
    }
  };

  const handleChange = (e) => {
    setProduto({
      ...produto,
      [e.target.name]:
        e.target.name === "estoque_minimo"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="edit-product-form">
      <h2>Editar Produto</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>EAN:</label>
          <input
            type="text"
            name="ean"
            value={produto.ean}
            onChange={handleChange}
            required
            pattern="\d{13}"
          />
        </div>

        <div className="form-group">
          <label>Descrição:</label>
          <input
            type="text"
            name="descricao"
            value={produto.descricao}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Marca:</label>
          <select
            name="marca_id"
            value={produto.marca_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma marca</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Estoque Mínimo:</label>
          <input
            type="number"
            name="estoque_minimo"
            value={produto.estoque_minimo}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <button type="submit" className="save-button">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;
