import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.get("https://685997d09f6ef9611153a5fd.mockapi.io/login");
      const users = res.data;

      const user = users.find((u) => u.email === email && u.password === senha);

      if (user) {
        login(user);
        navigate("/dashboard"); // ✅ redireciona
      } else {
        setErro("Email ou senha inválidos");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Erro ao tentar logar.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h2 className="text-2xl font-bold mb-4">Login Funcionário</h2>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
        <label className="block mb-2">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="exemplo@vetclinic.com"
            required
          />
        </label>
        <label className="block mb-4">
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Sua senha"
            required
          />
        </label>
        {erro && <p className="text-red-500 mb-2">{erro}</p>}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700">
          Entrar
        </button>
      </form>
    </div>
  );
}
