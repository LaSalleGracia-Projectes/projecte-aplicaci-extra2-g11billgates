"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function UserReportsPage() {
  const [reportedUsers, setReportedUsers] = useState([]);

  const fetchReportedUsers = () => {
    const token = Cookies.get("sessionToken");

    fetch("http://localhost:3003/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((user) => user.reported === true);
        setReportedUsers(filtered);
      })
      .catch((err) => console.error("Error al cargar usuarios reportados:", err));
  };

  useEffect(() => {
    fetchReportedUsers();
  }, []);

  const handleWarn = async (userId) => {
    const token = Cookies.get("sessionToken");

    try {
      const res = await fetch(`http://localhost:3003/api/users/${userId}/warn`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Advertencia aplicada", data.message, "success");
        fetchReportedUsers(); 
      } else {
        Swal.fire("Error", data.error || "No se pudo aplicar advertencia", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo aplicar advertencia", "error");
    }
  };

  const handleBan = async (userId) => {
    const token = Cookies.get("sessionToken");

    try {
      const res = await fetch(`http://localhost:3003/api/users/${userId}/ban`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Usuario baneado", data.message, "success");
        fetchReportedUsers(); 
      } else {
        Swal.fire("Error", data.error || "No se pudo banear al usuario", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo banear al usuario", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="p-6 mt-20 w-full">
        <h2 className="text-2xl font-bold mb-2 border-b-2 pb-2">Gestión de Contenido para TeamUp</h2>
        <p className="mb-6 text-gray-600">
          Aquí puedes ver los jugadores que han sido reportados por otros por mal comportamiento durante las partidas o en el chat. Toma medidas si es necesario.
        </p>

        <table className="w-full border border-gray-300 text-left table-auto bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Motivo</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {reportedUsers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user._id}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.reason || "Sin motivo"}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleWarn(user._id)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded"
                  >
                    Advertencia
                  </button>
                  <button
                    onClick={() => handleBan(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Banear
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
