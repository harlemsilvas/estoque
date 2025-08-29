import API from "./api";
import bcrypt from "bcryptjs";
import { getCurrentDateBR } from "../utils/dateUtils";

export const login = async (credentials) => {
  try {
    // Get all users from JSON server
    const response = await API.get("/users");
    const users = response.data;

    // Find user by email
    const user = users.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Check password (handle both plain text for development and hashed passwords)
    let passwordMatch = false;

    try {
      if (user.password.startsWith("$2")) {
        // It's a bcrypt hash
        passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
      } else {
        // It's plain text (for development)
        passwordMatch = credentials.password === user.password;
      }
    } catch (bcryptError) {
      console.warn("Password comparison error:", bcryptError);
      // Fallback to plain text comparison
      passwordMatch = credentials.password === user.password;
    }

    if (!passwordMatch) {
      throw new Error("Senha incorreta");
    }

    // Generate a mock token (in a real app, this would be done server-side)
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    localStorage.setItem("token", token);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.message || "Autenticação falhou");
  }
};

export const register = async (userData) => {
  try {
    // Check if user already exists
    const existingUsers = await API.get("/users");
    const userExists = existingUsers.data.some(
      (user) => user.email === userData.email
    );

    if (userExists) {
      throw new Error("Usuário já existe com este email");
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      createdAt: getCurrentDateBR(), // Use DD/MM/YYYY format
    };

    const response = await API.post("/users", newUser);

    if (!response.data) {
      throw new Error("Erro ao criar usuário no servidor");
    }

    // Generate token (in a real app, this would be done server-side)
    const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Erro de conexão com o servidor");
    }
    throw new Error(error.message || "Erro ao criar usuário");
  }
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token || !token.startsWith("mock-jwt-token-")) {
    return null;
  }

  try {
    // Extract user ID from mock token
    const tokenParts = token.split("-");
    const userId = tokenParts[3]; // mock-jwt-token-{userId}-{timestamp}

    // Get user data from JSON server
    const response = await API.get(`/users/${userId}`);
    const user = response.data;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error("getCurrentUser error:", error);
    localStorage.removeItem("token");
    return null;
  }
};
