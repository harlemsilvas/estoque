// src/services/api.js
import axios from "axios";
import { staticAPI } from "./staticDataService";

// Get API base URL from environment or use relative path for IIS
const getBaseURL = () => {
  // Check if we should use static data only
  if (import.meta.env.VITE_USE_STATIC_DATA === "true") {
    return null; // Will force static data usage
  }

  // For IIS deployment, use relative path or full server URL
  if (import.meta.env.PROD) {
    // In production (IIS), use your server API
    return import.meta.env.VITE_API_URL || "http://192.168.0.192:85/api";
  }
  // Development with JSON Server
  return "http://localhost:3003";
};

// Flag to use static data when API is not available
let useStaticData = import.meta.env.VITE_USE_STATIC_DATA === "true" || false;

// Configuração base do Axios
const baseURL = getBaseURL();
const api = baseURL
  ? axios.create({
      baseURL: baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    })
  : null; // No axios instance if using static data only

// Helper function to try API first, fallback to static data
const apiCall = async (apiFunction, staticFunction) => {
  if (useStaticData || !api) {
    return staticFunction();
  }

  try {
    return await apiFunction();
  } catch (error) {
    console.warn(
      "🚨 API not available, switching to static data:",
      error.message
    );
    useStaticData = true;
    return staticFunction();
  }
};

// Operações para Produtos
export const getProdutos = () =>
  apiCall(
    () => api.get("/produtos"),
    () => staticAPI.getProdutos()
  );

export const getProduto = (id) =>
  apiCall(
    () => api.get(`/produtos/${id}`),
    () => staticAPI.getProduto(id)
  );

export const getProdutoByEan = (ean) =>
  apiCall(
    () => api.get(`/produtos?ean=${ean}`),
    () => staticAPI.getProdutoByEan(ean)
  );

export const createProduto = (produto) =>
  apiCall(
    () => api.post("/produtos", produto),
    () => staticAPI.createProduto(produto)
  );

export const updateProduto = (id, produto) =>
  apiCall(
    () => api.put(`/produtos/${id}`, produto),
    () => staticAPI.updateProduto(id, produto)
  );

export const deleteProduto = (id) =>
  apiCall(
    () => api.delete(`/produtos/${id}`),
    () => staticAPI.deleteProduto(id)
  );

// Operações para Marcas
export const getMarcas = () =>
  apiCall(
    () => api.get("/marcas"),
    () => staticAPI.getMarcas()
  );

export const getMarca = (id) =>
  apiCall(
    () => api.get(`/marcas/${id}`),
    () => staticAPI.getMarca(id)
  );

export const createMarca = (marca) =>
  apiCall(
    () => api.post("/marcas", marca),
    () => staticAPI.createMarca(marca)
  );

export const updateMarca = (id, marca) =>
  apiCall(
    () => api.put(`/marcas/${id}`, marca),
    () => staticAPI.updateMarca(id, marca)
  );

export const deleteMarca = (id) =>
  apiCall(
    () => api.delete(`/marcas/${id}`),
    () => staticAPI.deleteMarca(id)
  );

// Operações para Movimentações
export const getMovimentacoes = () =>
  apiCall(
    () => api.get("/movimentacoes"),
    () => staticAPI.getMovimentacoes()
  );

export const createMovimentacao = (data) =>
  apiCall(
    () => api.post("/movimentacoes", data),
    () => staticAPI.createMovimentacao(data)
  );

export const getMovimentacoesByEan = (ean) =>
  apiCall(
    () => api.get(`/movimentacoes?ean=${ean}`),
    () => staticAPI.getMovimentacoesByEan(ean)
  );

// Interceptadores para tratamento global de erros (only if api exists)
if (api) {
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
}

export default api;
