# 📦 Sistema de Controle de Estoque

Um sistema moderno de gestão de inventário construído com React 19 e Vite, oferecendo controle completo de produtos, marcas e movimentações de estoque.

## ✨ Funcionalidades

- **Gestão de Usuários**: Sistema de autenticação com diferentes níveis de acesso (Admin, Gerente, Operador)
- **Controle de Produtos**: Cadastro, edição e gerenciamento de produtos com códigos EAN
- **Gestão de Marcas**: Cadastro e controle de marcas com histórico de alterações
- **Movimentações de Estoque**: Controle de entrada, saída e inventário com rastreamento em tempo real
- **Histórico Completo**: Auditoria de todas as alterações com timestamps e usuários
- **Design Responsivo**: Interface otimizada para desktop e mobile
- **Formatação Brasileira**: Datas no formato DD/MM/YYYY

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório ao Vercel**:

   ```bash
   # No terminal do seu projeto
   vercel
   ```

2. **Configure as variáveis de ambiente** no dashboard da Vercel:

   - `VITE_API_URL`: URL da sua API de produção

3. **Deploy automático**: Toda push para a branch main fará deploy automático

### Build Local

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar mock API (em outro terminal)
npm run server
```

## 📋 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── context/            # Context providers
├── utils/              # Funções utilitárias
├── assets/             # Estilos e recursos
data/
└── db.json            # Dados de desenvolvimento
```

## 🔧 Tecnologias

- **Frontend**: React 19, Vite 6.2.0
- **Roteamento**: React Router DOM 7.2.0
- **Estilização**: CSS Modules + Global CSS
- **HTTP Client**: Axios
- **Ícones**: React Icons
- **Autenticação**: JWT + bcryptjs
- **Build**: Vite

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (últimas versões)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ✅ Tablets e desktops

---

**Desenvolvido com ❤️ usando React e Vite**

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Running the app
