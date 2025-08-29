import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { register } from "../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "MANAGER", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

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

    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não coincidem");
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

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await register(userData);

      // Auto-login after successful registration
      await authLogin(response.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Criar Nova Conta</h2>

        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Função:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="MANAGER">Gerente</option>
            <option value="OPERATOR">Operador</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Criando..." : "Criar Conta"}
        </button>

        <div className="auth-links">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="link-button"
            disabled={loading}
          >
            Já tem uma conta? Faça login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
