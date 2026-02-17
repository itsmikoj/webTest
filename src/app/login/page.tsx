"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: handleLogin, loading, error } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await handleLogin(email, password);
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-black text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Tracker</h1>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-6">Iniciar sesión</h2>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="correo@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Recuérdame
              </label>
              <a href="#" className="text-gray-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Iniciando..." : "Entrar"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿No tienes cuenta?{" "}
            <a href="#" className="font-medium text-black hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
