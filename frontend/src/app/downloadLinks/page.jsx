"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default function EnlacesPage() {
  const [links, setLinks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    type: "Descarga",
    url: "",
    description: "",
  });

  const token = Cookies.get("sessionToken");

  const fetchLinks = () => {
    fetch("http://localhost:3005/api/links", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLinks(data))
      .catch((err) => {
        console.error("Error al cargar enlaces:", err);
        Swal.fire("Error", "No se pudieron cargar los enlaces", "error");
      });
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = selectedId ? "PUT" : "POST";
    const endpoint = selectedId
      ? `http://localhost:3005/api/links/${selectedId}`
      : "http://localhost:3005/api/links";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire(
          selectedId ? "Enlace actualizado" : "Enlace creado",
          data.message || "",
          "success"
        );
        setForm({ type: "Descarga", url: "", description: "" });
        setSelectedId(null);
        fetchLinks();
      } else {
        Swal.fire("Error", data.error || "No se pudo guardar el enlace", "error");
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Error", "No se pudo guardar el enlace", "error");
    }
  };

  const handleEdit = (link) => {
    setForm({
      type: link.type,
      url: link.url,
      description: link.description,
    });
    setSelectedId(link._id);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="p-6 mt-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2">
          Gestión de Enlaces
        </h2>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-10">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Tipo de Enlace:</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="Descarga">Descarga</option>
              <option value="Actualización">Actualización</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">URL del Enlace:</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Descripción:</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {selectedId ? "Actualizar Enlace" : "Agregar Enlace"}
          </button>
        </form>

        {links.length > 0 && (
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-3">Enlaces existentes</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li
                  key={link._id}
                  className="flex justify-between items-start p-2 border-b"
                >
                  <div>
                    <p><strong>Tipo:</strong> {link.type}</p>
                    <p><strong>URL:</strong> {link.url}</p>
                    <p><strong>Descripción:</strong> {link.description}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(link)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
