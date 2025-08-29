import React, { useState, useEffect } from "react";
import { getMovimentacoes } from "../services/api";

const MovementsList = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovimentacoes = async () => {
      try {
        const response = await getMovimentacoes();
        setMovimentacoes(response.data);
      } catch (err) {
        console.error("Erro ao carregar movimentações:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMovimentacoes();
  }, []);

  return (
    <div className="movements-list">
      <h2>Histórico de Movimentações</h2>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>EAN</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Usuário</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((mov) => (
            <tr key={mov.id}>
              <td>{new Date(mov.data).toLocaleString()}</td>
              <td>{mov.ean}</td>
              <td className={`type-${mov.tipo.toLowerCase()}`}>{mov.tipo}</td>
              <td>{mov.quantidade}</td>
              <td>{mov.usuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovementsList;
