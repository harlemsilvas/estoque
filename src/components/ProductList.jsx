import { useState, useEffect } from "react";
import { getProdutos, deleteProduto, getMarcas } from "../services/api";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";

const ProductList = () => {
  const [produtos, setProdutos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodResponse, marcResponse] = await Promise.all([
          getProdutos(),
          getMarcas(),
        ]);

        setProdutos(prodResponse.data);
        setMarcas(marcResponse.data);
      } catch (err) {
        setError("Erro ao carregar dados: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMarcaNome = (marcaId) => {
    const marca = marcas.find((m) => m.id === marcaId);
    return marca ? marca.nome : "Marca não encontrada";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduto(id);
        setProdutos(produtos.filter((prod) => prod.id !== id));
      } catch (err) {
        setError("Erro ao excluir produto: " + err.message);
      }
    }
  };

  const filteredProducts = produtos.filter(
    (prod) =>
      prod.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.ean.includes(searchTerm)
  );

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>Produtos Cadastrados</h2>
        <input
          type="text"
          placeholder="Buscar por descrição ou EAN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total de Produtos</span>
          <h3>{produtos.length}</h3>
        </div>
        <div className="stat-card">
          <span>Estoque Médio</span>
          <h3>
            {produtos.reduce((acc, curr) => acc + curr.estoque_minimo, 0) /
              produtos.length || 0}
          </h3>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>EAN</th>
              <th>Descrição</th>
              <th>Marca</th>
              <th>Estoque Mín.</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((produto) => (
              <tr key={produto.id}>
                <td>
                  <span className="ean-badge">{produto.ean}</span>
                </td>
                <td>
                  <Link to={`/produtos/${produto.id}`} className="product-link">
                    {produto.descricao}
                  </Link>
                </td>
                <td>{getMarcaNome(produto.marca_id)}</td>
                <td className={produto.estoque_minimo <= 5 ? "low-stock" : ""}>
                  {produto.estoque_minimo}
                </td>
                <td>{new Date(produto.data_cadastro).toLocaleDateString()}</td>
                {/* <td>
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="icon-button danger"
                  >
                    🗑️ Excluir
                  </button>
                </td> */}
                <td>
                  <Link
                    to={`/produtos/editar/${produto.id}`}
                    className="icon-button edit"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="icon-button danger"
                  >
                    🗑️ Excluir
                  </button>
                  <Link
                    to={`/produtos/historico/${produto.id}`}
                    className="history-link"
                  >
                    <FiClock /> Histórico de Alterações
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;

// import React, { useState, useEffect } from "react";
// import { getProdutos, deleteProduto } from "../services/api";

// const ProductList = () => {
//   const [produtos, setProdutos] = useState([]);
//   const [marcas, setMarcas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [prodResponse, marcResponse] = await Promise.all([
//           getProdutos(),
//           getMarcas(),
//         ]);

//         setProdutos(prodResponse.data);
//         setMarcas(marcResponse.data);
//       } catch (err) {
//         setError("Erro ao carregar dados");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getMarcaNome = (marcaId) => {
//     const marca = marcas.find((m) => m.id === marcaId);
//     return marca ? marca.nome : "Desconhecida";
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Tem certeza que deseja excluir este produto?")) {
//       try {
//         await deleteProduto(id);
//         setProdutos(produtos.filter((prod) => prod.codigo !== id));
//       } catch (err) {
//         setError("Erro ao excluir produto");
//       }
//     }
//   };

//   if (loading) return <div>Carregando produtos...</div>;
//   if (error) return <div className="error-message">{error}</div>;

//   return (
//     <div className="product-list">
//       <h3>Produtos Cadastrados</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Código</th>
//             <th>EAN</th>
//             <th>Descrição</th>
//             <th>Marca</th>
//             <th>Estoque Mínimo</th>
//             <th>Ações</th>
//           </tr>
//         </thead>
//         <tbody>
//           {produtos.map((produto) => (
//             <tr key={produto.codigo}>
//               <td>{produto.codigo}</td>
//               <td>{produto.ean}</td>
//               <td>{produto.descricao}</td>
//               <td>{getMarcaNome(produto.marca_id)}</td>
//               <td>{produto.estoque_minimo}</td>
//               <td>
//                 <button
//                   onClick={() => handleDelete(produto.codigo)}
//                   className="delete-button"
//                 >
//                   Excluir
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProductList;
