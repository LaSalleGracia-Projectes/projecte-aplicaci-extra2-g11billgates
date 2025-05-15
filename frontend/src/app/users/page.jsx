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
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("sessionToken");
      if (!token) {
        throw new Error("No hay token de sesión");
      }

      const response = await fetch("http://localhost:3003/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar usuarios");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los usuarios",
        icon: "error",
        confirmButtonColor: "#3085d6"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, username) => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${username}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const token = Cookies.get("sessionToken");
        const response = await fetch(`http://localhost:3003/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al eliminar usuario");
        }

        setUsers((prev) => prev.filter((u) => u._id !== id));
        await Swal.fire({
          title: "Eliminado",
          text: `${username} fue eliminado.`,
          icon: "success",
          timer: 2000,
          timerProgressBar: true
        });
      } catch (error) {
        console.error("Error:", error);
        await Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el usuario",
          icon: "error",
          confirmButtonColor: "#3085d6"
        });
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      username: user.username,
      role: user.role,
    });
  };

  const handleSave = async (userId) => {
    const result = await Swal.fire({
      title: "¿Guardar los cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33"
    });

    if (result.isConfirmed) {
      try {
        const token = Cookies.get("sessionToken");
        const response = await fetch(`http://localhost:3003/api/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar usuario");
        }

        const updatedUser = await response.json();
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? updatedUser : u))
        );
        setEditingUserId(null);
        setEditForm({ username: "", role: "" });
        await Swal.fire({
          title: "Actualizado",
          text: "El usuario fue actualizado.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true
        });
      } catch (error) {
        console.error("Error:", error);
        await Swal.fire({
          title: "Error",
          text: "No se pudo actualizar el usuario",
          icon: "error",
          confirmButtonColor: "#3085d6"
        });
      }
    }
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

        if (!response.ok) {
          throw new Error('Error al enviar la advertencia');
        }

        const updatedUser = await response.json();
        setUsers(prev => prev.map(u => {
          if (u._id === user._id) {
            return {
              ...u,
              warnings: updatedUser.warnings,
              lastWarning: updatedUser.lastWarning
            };
          }
          return u;
        }));

        await Swal.fire({
          title: 'Advertencia enviada',
          text: `Se ha enviado una advertencia a ${user.username}`,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true
        });
      } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo enviar la advertencia',
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Header />
        <main className="p-6 mt-20 w-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="p-6 mt-20 w-full">
        <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">
          Gestión de usuarios
        </h2>

        {users.length === 0 ? (
          <div className="text-center py-8 bg-white rounded shadow">
            <p className="text-gray-600">No hay usuarios para mostrar</p>
          </div>
        ) : (
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
                <tr key={user._id} className="border-t hover:bg-gray-50">
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

                  <td className="p-2">{user.status || "Activo"}</td>
                  <td className="p-2 text-center">{user.warnings || 0}</td>
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
        )}
      </main>
    </div>
  );
}
