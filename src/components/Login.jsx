import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login } from "../services/authService";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(credentials);
      authLogin(user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Credenciais inválidas");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="auth-button">
          Entrar
        </button>

        <div className="auth-links">
          <button
            type="button"
            onClick={() => navigate("/registrar")}
            className="link-button"
          >
            Não tem uma conta? Cadastre-se
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
