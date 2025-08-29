import { useState, useEffect } from "react";
import { getMarcas, deleteMarca } from "../services/api";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { formatDateBR } from "../utils/dateUtils";

const BrandList = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await getMarcas();
        setMarcas(response.data);
      } catch (err) {
        setError(`Erro ao excluir marca: ${err.message}`);
        // console.error("Erro detalhado:", err); // Opcional para debug
      } finally {
        setLoading(false);
      }
    };
    fetchMarcas();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta marca?")) {
      try {
        await deleteMarca(id);
        setMarcas(marcas.filter((marca) => marca.id !== id));
      } catch (err) {
        setError(`Erro ao excluir marca: ${err.message}`);
        console.error("Erro detalhado:", err); // Opcional para debug
      }
    }
  };

  if (loading) return <div>Carregando marcas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="brand-list">
      <h3>Marcas Cadastradas</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Data de Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {marcas.map((marca) => (
            <tr key={marca.id}>
              <td>{marca.id}</td>
              <td>{marca.nome}</td>
              <td>{formatDateBR(marca.data_cadastro)}</td>
              <td>
                <Link
                  to={`/marcas/historico/${marca.id}`}
                  className="history-link"
                  title="Histórico de alterações"
                >
                  <FiClock />
                </Link>
                {/* Outros botões */}
                <Link
                  to={`/marcas/editar/${marca.id}`}
                  className="icon-button edit"
                >
                  ✏️ Editar
                </Link>
                <button
                  onClick={() => handleDelete(marca.id)}
                  className="icon-button danger"
                >
                  🗑️ Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandList;
