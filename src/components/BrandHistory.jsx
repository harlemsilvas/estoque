import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMarca } from "../services/api";
import { formatDateTimeBR } from "../utils/dateUtils";

const BrandHistory = () => {
  const { id } = useParams();
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getMarca(id);
        if (response.data && response.data.historico) {
          setHistorico(response.data.historico);
        } else {
          setError("Nenhum histórico encontrado para esta marca");
        }
      } catch (error) {
        setError("Erro ao carregar histórico");
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [id]);

  const renderChanges = (changes) => {
    return Object.entries(changes).map(([campo, valores]) => {
      // Formatar valores específicos
      let valorAntigo = valores[0];
      let valorNovo = valores[1];

      return (
        <div key={campo} className="change-item">
          <span className="change-field">{campo.replace("_", " ")}:</span>
          <span className="change-from">{valorAntigo}</span>
          <span>→</span>
          <span className="change-to">{valorNovo}</span>
        </div>
      );
    });
  };

  return (
    <div className="history-container">
      <h2>Histórico de Alterações da Marca</h2>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : historico.length === 0 ? (
        <div className="no-history">Nenhuma alteração registrada</div>
      ) : (
        <div className="timeline">
          {historico.map((entry, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-header">
                <span className="timeline-date">
                  {formatDateTimeBR(entry.data)}
                </span>
                <span className="timeline-user">{entry.usuario}</span>
              </div>
              <div className="timeline-changes">
                {renderChanges(entry.alteracoes)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandHistory;
