"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function DownloadLinks() {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({
    url: "",
    description: "",
    type: "descarga",
  });

  const fetchLinks = async () => {
    const token = Cookies.get("sessionToken");
    try {
      const res = await fetch("http://localhost:3005/api/links", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error("Error al cargar enlaces:", error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleAddLink = async () => {
    const token = Cookies.get("sessionToken");

    try {
      const res = await fetch("http://localhost:3005/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLink),
      });

      if (res.ok) {
        setNewLink({ url: "", description: "", type: "descarga" });
        fetchLinks();
      } else {
        Swal.fire("Error", "No se pudo agregar el enlace", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error al conectar con el servidor", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="p-6 mt-20">
        <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">Agregar Nuevo Enlace</h2>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Tipo de Enlace:</label>
          <select
            value={newLink.type}
            onChange={(e) => setNewLink({ ...newLink, type: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="descarga">Descarga</option>
            <option value="actualizacion">Actualización</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">URL del Enlace:</label>
          <input
            type="text"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Descripción:</label>
          <textarea
            value={newLink.description}
            onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
            className="w-full p-3 border rounded-lg"
            rows="4"
          />
        </div>

        <button
          onClick={handleAddLink}
          className="bg-black text-white px-6 py-3 text-lg rounded hover:bg-gray-800"
        >
          Agregar Enlace
        </button>
      </main>
    </div>
  );
}
