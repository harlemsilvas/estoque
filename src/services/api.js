// src/services/api.js
import axios from "axios";

// Configuração base do Axios
const api = axios.create({
  baseURL: "http://localhost:3003", // JSON Server running on port 3003
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Operações para Produtos
export const getProdutos = () => api.get("/produtos");
export const getProduto = (id) => api.get(`/produtos/${id}`);
export const getProdutoByEan = (ean) => api.get(`/produtos?ean=${ean}`);
export const createProduto = (produto) => api.post("/produtos", produto);
// Adicione a função de atualização
export const updateProduto = (id, produto) =>
  api.put(`/produtos/${id}`, produto);
// export const updateProduto = (id, produto) =>
//   api.put(`/produtos/${id}`, produto);
export const deleteProduto = (id) => api.delete(`/produtos/${id}`);

// Operações para Marcas
export const getMarcas = () => api.get("/marcas");
export const getMarca = (id) => api.get(`/marcas/${id}`);
export const createMarca = (marca) => api.post("/marcas", marca);
export const updateMarca = (id, marca) => api.put(`/marcas/${id}`, marca);
export const deleteMarca = (id) => api.delete(`/marcas/${id}`);
// Adicione estas funções
export const getMovimentacoes = () => api.get("/movimentacoes");
export const createMovimentacao = (data) => api.post("/movimentacoes", data);
export const getMovimentacoesByEan = (ean) =>
  api.get(`/movimentacoes?ean=${ean}`);

// Interceptadores para tratamento global de erros
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} request to:`, config.url);
    if (config.data) {
      console.log("📦 Request data:", config.data);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
