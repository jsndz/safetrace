import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/input";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    const result = await signup(formData);
    if (result.success) {
      navigate("/", { replace: true });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="p-8">
        <h1 className="font-bold text-4xl">Safetrace</h1>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center ">
        <div className="w-full max-w-md border border-white/20  p-8 rounded-lg">
        <h1 className="text-3xl mb-6">Signup</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />

            {error && (
              <p className="text-sm underline">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg border border-white bg-white py-2 text-black disabled:opacity-60"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-sm text-white/50 text-center">
        © Safetrace
      </footer>
    </div>
  );
};
