import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/input";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  useEffect(() => {
    if (error) clearError();
  }, [formData, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      navigate("/", { replace: true });
    }
  };

  const handleChange = (e:
     React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="container mx-auto p-10">
        <h1 className="text-4xl font-bold">Safetrace</h1>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-white/20 bg-black p-8">
          <h1 className="text-3xl mb-6">Login</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {error && <p className="text-sm underline">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                rounded-lg
                bg-white
                py-2
                font-medium
                text-black
                transition
                hover:bg-white/90
                disabled:opacity-60
              "
            >
              {isLoading ? "Signing In..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className=" mx-auto p-10 text-sm text-white/50">
        © Safetrace
      </footer>
    </div>
  );
};
