"use client"; 

import { useState, useEffect } from "react";
import { useRouter} from "next/navigation";

export default function Login () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe,setRememberMe] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  },[]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Iniciar sesión con:", email, password);

      if(rememberMe) {
        localStorage.setItem("email",email);
        localStorage.setItem("passwoed",passwoed);
      }else {
        localStorage.removeItem("email",email);
        localStorage.removetem("passwoed",passwoed);
      }
      router.push("/dashboard");
   };
   return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Recordarme
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 transition">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

