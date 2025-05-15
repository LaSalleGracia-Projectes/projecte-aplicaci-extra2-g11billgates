"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    role: "",
  });

  useEffect(() => {
    const token = Cookies.get("sessionToken");

    fetch("http://localhost:3003/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  const handleDelete = (id, username) => {
    Swal.fire({
      title: `¿Eliminar a ${username}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = Cookies.get("sessionToken");
        fetch(`http://localhost:3003/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            setUsers((prev) => prev.filter((u) => u._id !== id));
            Swal.fire("Eliminado", `${username} fue eliminado.`, "success");
          })
          .catch(() => {
            Swal.fire("Error", "No se pudo eliminar el usuario", "error");
          });
      }
    });
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      username: user.username,
      role: user.role,
    });
  };

  const handleSave = (userId) => {
    Swal.fire({
      title: "¿Guardar los cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = Cookies.get("sessionToken");
        fetch(`http://localhost:3003/api/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        })
          .then((res) => res.json())
          .then((updatedUser) => {
            setUsers((prev) =>
              prev.map((u) => (u._id === userId ? updatedUser : u))
            );
            setEditingUserId(null);
            setEditForm({ username: "", role: "" });
            Swal.fire("Actualizado", "El usuario fue actualizado.", "success");
          })
          .catch(() => {
            Swal.fire("Error", "No se pudo actualizar el usuario", "error");
          });
      }
    });
  };

  const handleWarn = async (user) => {
    const { value: warningReason } = await Swal.fire({
      title: `Enviar advertencia a ${user.username}`,
      input: 'textarea',
      inputLabel: 'Motivo de la advertencia',
      inputPlaceholder: 'Escribe el motivo de la advertencia...',
      inputAttributes: {
        'aria-label': 'Motivo de la advertencia'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar advertencia',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes escribir un motivo para la advertencia';
        }
      }
    });

    if (warningReason) {
      try {
        const token = Cookies.get("sessionToken");
        const response = await fetch(`http://localhost:3003/api/users/${user._id}/warn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: warningReason }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUsers(prev => prev.map(u => u._id === user._id ? updatedUser : u));
          await Swal.fire({
            title: 'Advertencia enviada',
            text: `Se ha enviado una advertencia a ${user.username}`,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true
          });
        } else {
          throw new Error('Error al enviar la advertencia');
        }
      } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo enviar la advertencia',
          icon: 'error'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="p-6 mt-20 w-full">
        <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">
          Gestión de usuarios
        </h2>

        <table className="w-full border border-gray-300 text-left table-auto bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Usuario</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Advertencias</th>
              <th className="p-2">¿Baneado?</th>
              <th className="p-2 w-48">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm({ ...editForm, username: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    user.username
                  )}
                </td>

                <td className="p-2">
                  {editingUserId === user._id ? (
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    >
                      <option value="Usuario">Usuario</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>

                <td className="p-2">{user.status}</td>
                <td className="p-2 text-center">{user.warnings}</td>
                <td className="p-2">{user.banned ? "Sí" : "No"}</td>

                <td className="p-2">
                  {editingUserId === user._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(user._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setEditingUserId(null);
                          setEditForm({ username: "", role: "" });
                        }}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleWarn(user)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Advertir
                      </button>
                      <button
                        onClick={() => handleDelete(user._id, user.username)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
