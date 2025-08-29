import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const EditUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "MANAGER",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await API.get(`/users/${id}`);
        const user = response.data;
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } catch (err) {
        setError("Erro ao carregar usuário");
        console.error("Erro ao carregar usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Email deve ter um formato válido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      await API.put(`/users/${id}`, formData);
      navigate("/usuarios");
    } catch (err) {
      setError("Erro ao atualizar usuário");
      console.error("Erro ao atualizar usuário:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando usuário...</div>;
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Editar Usuário</h2>

        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Função:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="MANAGER">Gerente</option>
            <option value="OPERATOR">Operador</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-buttons">
          <button type="submit" className="auth-button" disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className="btn-secondary"
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
