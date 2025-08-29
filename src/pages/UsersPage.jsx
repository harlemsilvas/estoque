import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { formatDateBR } from "../utils/dateUtils";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users");
      setUsers(response.data);
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }

    try {
      await API.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Erro ao excluir usuário");
      console.error("Erro ao excluir usuário:", err);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      ADMIN: "Administrador",
      MANAGER: "Gerente",
      OPERATOR: "Operador",
    };
    return roleNames[role] || role;
  };

  const formatDate = (dateString) => {
    return formatDateBR(dateString);
  };

  if (loading) {
    return <div className="loading">Carregando usuários...</div>;
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Gerenciamento de Usuários</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/usuarios/novo")}
        >
          + Novo Usuário
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`role-badge role-${user.role.toLowerCase()}`}
                  >
                    {getRoleDisplayName(user.role)}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/usuarios/editar/${user.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="empty-state">
            <p>Nenhum usuário encontrado.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/usuarios/novo")}
            >
              Criar Primeiro Usuário
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
