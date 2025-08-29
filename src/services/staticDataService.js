// Static data service for IIS deployment when no backend API is available
import { formatDateBR } from "../utils/dateUtils";

// Static data that matches the JSON server structure
const staticData = {
  marcas: [
    {
      id: "e74c",
      nome: "Teste",
      data_cadastro: "17/02/2025",
      historico: [
        {
          data: "2025-08-29T15:35:43.902Z",
          usuario: "Admin",
          alteracoes: {
            nome: ["Teste 1", "Teste"],
          },
        },
      ],
    },
    {
      id: "40ed",
      nome: "Cobreq",
      data_cadastro: "17/02/2025",
      historico: [
        {
          data: "2025-08-29T15:35:56.677Z",
          usuario: "Admin",
          alteracoes: {
            nome: ["Cobreq Novas", "Cobreq"],
          },
        },
      ],
    },
    {
      id: "3b0f",
      nome: "Potenza",
      data_cadastro: "17/02/2025",
    },
    {
      id: "866e",
      nome: "Vedamotors - Gsket",
      data_cadastro: "17/02/2025",
    },
    {
      id: "2d25",
      nome: "Cobreq Tradicional",
      data_cadastro: "28/02/2025",
    },
  ],
  produtos: [
    {
      id: "1",
      ean: "7891234567890",
      descricao: "Produto Principal",
      marca_id: "3b0f",
      estoque_minimo: 10,
      estoque_atual: 28,
      data_cadastro: "29/08/2025",
      ultima_movimentacao: "2025-08-29T14:23:47.938Z",
      ativo: true,
    },
    {
      id: "1756475213325",
      ean: "1234567890123",
      descricao: "Produto Teste Movimentação",
      marca_id: "e74c",
      estoque_minimo: 4,
      estoque_atual: 15,
      data_cadastro: "29/08/2025",
      ultima_movimentacao: "2025-08-29T15:00:00.000Z",
      ativo: true,
    },
  ],
  movimentacoes: [
    {
      id: "1",
      ean: "7891234567890",
      tipo: "ENTRADA",
      quantidade: 20,
      estoque_anterior: 5,
      estoque_novo: 25,
      data: "2025-08-29T10:30:00.000Z",
      usuario: "admin",
      observacoes: "Recebimento inicial",
      produto_descricao: "Produto Principal",
    },
    {
      id: "2",
      ean: "7891234567890",
      tipo: "SAIDA",
      quantidade: 3,
      estoque_anterior: 25,
      estoque_novo: 22,
      data: "2025-08-29T14:20:00.000Z",
      usuario: "vendedor1",
      observacoes: "Venda balcão",
      produto_descricao: "Produto Principal",
    },
  ],
  users: [
    {
      id: "1",
      name: "Admin",
      email: "admin@estoque.com",
      password: "admin123",
      role: "ADMIN",
      createdAt: "30/10/2023",
    },
    {
      id: "2",
      name: "Gerente",
      email: "gerente@estoque.com",
      password: "gerente123",
      role: "MANAGER",
      createdAt: "30/10/2023",
    },
  ],
};

// Simulate async operations with delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate new ID
const generateId = () => Date.now().toString();

// Static API functions that match the real API interface
export const staticAPI = {
  // Produtos
  async getProdutos() {
    await delay(300);
    return { data: staticData.produtos };
  },

  async getProduto(id) {
    await delay(200);
    const produto = staticData.produtos.find((p) => p.id === id);
    if (!produto) throw new Error("Produto não encontrado");
    return { data: produto };
  },

  async getProdutoByEan(ean) {
    await delay(200);
    const produtos = staticData.produtos.filter((p) => p.ean === ean);
    return { data: produtos };
  },

  async createProduto(produto) {
    await delay(500);
    const newProduto = {
      ...produto,
      id: generateId(),
      data_cadastro: formatDateBR(new Date()),
      ativo: true,
    };
    staticData.produtos.push(newProduto);
    return { data: newProduto };
  },

  async updateProduto(id, produto) {
    await delay(400);
    const index = staticData.produtos.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Produto não encontrado");
    staticData.produtos[index] = { ...staticData.produtos[index], ...produto };
    return { data: staticData.produtos[index] };
  },

  async deleteProduto(id) {
    await delay(300);
    const index = staticData.produtos.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Produto não encontrado");
    staticData.produtos.splice(index, 1);
    return { data: { success: true } };
  },

  // Marcas
  async getMarcas() {
    await delay(200);
    return { data: staticData.marcas };
  },

  async getMarca(id) {
    await delay(200);
    const marca = staticData.marcas.find((m) => m.id === id);
    if (!marca) throw new Error("Marca não encontrada");
    return { data: marca };
  },

  async createMarca(marca) {
    await delay(400);
    const newMarca = {
      ...marca,
      id: generateId(),
      data_cadastro: formatDateBR(new Date()),
    };
    staticData.marcas.push(newMarca);
    return { data: newMarca };
  },

  async updateMarca(id, marca) {
    await delay(400);
    const index = staticData.marcas.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Marca não encontrada");
    staticData.marcas[index] = { ...staticData.marcas[index], ...marca };
    return { data: staticData.marcas[index] };
  },

  async deleteMarca(id) {
    await delay(300);
    const index = staticData.marcas.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Marca não encontrada");
    staticData.marcas.splice(index, 1);
    return { data: { success: true } };
  },

  // Movimentações
  async getMovimentacoes() {
    await delay(200);
    return { data: staticData.movimentacoes };
  },

  async createMovimentacao(movimentacao) {
    await delay(500);
    const newMovimentacao = {
      ...movimentacao,
      id: generateId(),
      data: new Date().toISOString(),
    };
    staticData.movimentacoes.push(newMovimentacao);
    return { data: newMovimentacao };
  },

  async getMovimentacoesByEan(ean) {
    await delay(200);
    const movimentacoes = staticData.movimentacoes.filter((m) => m.ean === ean);
    return { data: movimentacoes };
  },

  // Users
  async getUsers() {
    await delay(200);
    return { data: staticData.users };
  },

  async getUser(id) {
    await delay(200);
    const user = staticData.users.find((u) => u.id === id);
    if (!user) throw new Error("Usuário não encontrado");
    return { data: user };
  },

  async createUser(user) {
    await delay(400);
    const newUser = {
      ...user,
      id: generateId(),
      createdAt: formatDateBR(new Date()),
    };
    staticData.users.push(newUser);
    return { data: newUser };
  },

  async updateUser(id, user) {
    await delay(400);
    const index = staticData.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Usuário não encontrado");
    staticData.users[index] = { ...staticData.users[index], ...user };
    return { data: staticData.users[index] };
  },

  async deleteUser(id) {
    await delay(300);
    const index = staticData.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Usuário não encontrado");
    staticData.users.splice(index, 1);
    return { data: { success: true } };
  },
};
