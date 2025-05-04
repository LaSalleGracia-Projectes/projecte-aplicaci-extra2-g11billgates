"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function UserReportsPage() {
  const [reportedUsers, setReportedUsers] = useState([]);

  const token = Cookies.get("sessionToken");

  const fetchReportedUsers = () => {
    if (!token) return;

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
      .catch((err) =>
        console.error("Error al cargar usuarios reportados:", err)
      );
  };

  useEffect(() => {
    fetchReportedUsers();
  }, []);

  const handleWarn = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:3003/api/users/${userId}/warn`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Advertencia aplicada", data.message, "success");
        fetchReportedUsers();
      } else {
        Swal.fire("Error", data.error || "No se pudo aplicar advertencia", "error");
      }
    } catch (err) {
      console.error("❌ Error en warn:", err);
      Swal.fire("Error", "No se pudo aplicar advertencia", "error");
    }
  };

  const handleRemoveWarning = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:3003/api/users/remove-warning/${userId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Advertencia eliminada", data.message, "success");
        fetchReportedUsers();
      } else {
        Swal.fire("Error", data.error || "No se pudo eliminar la advertencia", "error");
      }
    } catch (err) {
      console.error("❌ Error en remove-warning:", err);
      Swal.fire("Error", "No se pudo eliminar la advertencia", "error");
    }
  };

  const handleBanToggle = async (userId, isBanned) => {
    if (!userId || typeof userId !== "string") {
      console.error("❌ ID de usuario inválido:", userId);
      Swal.fire("Error", "ID de usuario no válido", "error");
      return;
    }

    try {
      const endpoint = isBanned
        ? `unban/${userId}`       // ← para desbanear
        : `${userId}/ban`;        // ← para banear

      const res = await fetch(
        `http://localhost:3003/api/users/${endpoint}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire(
          isBanned ? "Usuario desbaneado" : "Usuario baneado",
          data.message,
          "success"
        );
        fetchReportedUsers();
      } else {
        console.error("❌ Error en respuesta:", res.status, data);
        Swal.fire("Error", data.error || "Acción fallida", "error");
      }
    } catch (err) {
      console.error("❌ Error en catch:", err);
      Swal.fire("Error", "No se pudo procesar la solicitud", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="p-6 mt-20 w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-2 border-b-2 pb-2">
          Gestión de Contenido para TeamUp
        </h2>
        <p className="mb-6 text-gray-600">
          Aquí puedes ver los jugadores que han sido reportados por otros por mal comportamiento durante las partidas o en el chat. Toma medidas si es necesario.
        </p>

        <table className="w-full border border-gray-300 text-left table-auto bg-white rounded shadow text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Motivo</th>
              <th className="p-2 text-center">Advertencias</th>
              <th className="p-2 text-center">Baneado</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportedUsers.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="p-2 break-all">{user._id}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.reason || "Sin motivo"}</td>
                <td className="p-2 text-center font-semibold">{user.warnings ?? 0}</td>
                <td className="p-2 text-center">{user.banned ? "Sí" : "No"}</td>
                <td className="p-2 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleWarn(user._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Advertencia
                  </button>

                  {user.warnings > 0 && (
                    <button
                      onClick={() => handleRemoveWarning(user._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Quitar advertencia
                    </button>
                  )}

                  <button
                    onClick={() => handleBanToggle(user._id, user.banned)}
                    className={`${
                      user.banned
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white px-3 py-1 rounded text-xs`}
                  >
                    {user.banned ? "Desbanear" : "Banear"}
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
