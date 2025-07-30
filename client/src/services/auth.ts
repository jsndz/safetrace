import axios from "axios";
import {
  User,
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
} from "../types/auth";

const API_BASE = import.meta.env.CLIENT_VITE_API;
const SESSION_KEY = "safetrace_session";

function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
}

function getCurrentUser(): User | null {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const { user } = JSON.parse(session);
      return user;
    }
  } catch {
    localStorage.removeItem(SESSION_KEY);
  }
  return null;
}

function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  try {
    const res = await axios.post(
      `${API_BASE}/auth/signup`,
      {
        email: credentials.email,
        password: credentials.password,
        username: credentials.name,
      },
      {
        withCredentials: true,
      }
    );

    const { data: user } = res.data;
    saveSession(user);

    return { success: true, user };
  } catch (err: any) {
    console.error("Signup error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Signup failed",
    };
  }
}

async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const res = await axios.post(
      `${API_BASE}/auth/signin`,
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        withCredentials: true,
      }
    );

    const { data: user } = res.data;
    saveSession(user);

    return { success: true, user };
  } catch (err: any) {
    console.error("Login error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Login failed",
    };
  }
}

export const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  saveSession,
};
