"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";

export default function UserManagementPage() {
    const [users, setUsers] = useState([
        {
            id: 1,
            username: "Player123",
            password: "$2y$10$hash",
            status: "Activo",
        },
    ]);

    useEffect(() => {
        fetch("http://localhost:8000/api/users")
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
                fetch(`http://localhost:8000/api/users/${id}`, { method: "DELETE" }).then(() => {
                    setUsers((prev) => prev.filter((u) => u.id !== id));
                    Swal.fire("Eliminado", `${username} fue eliminado.`, "success");
                });
            }
        });
    };
    const [editingUserId, setEditingUserId] = useState(null);
    const [editForm, setEditForm] = useState({ username: "", password: "" });

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setEditForm({ username: user.username, password: "" });
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
                fetch(`http://localhost:8000/api/users/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editForm),
                })
                    .then((res) => res.json())
                    .then((updatedUser) => {
                        setUsers((prev) =>
                            prev.map((u) => (u.id === userId ? updatedUser : u))
                        );
                        setEditingUserId(null);
                        setEditForm({ username: "", password: "" });
    
                        Swal.fire("Actualizado", "El usuario fue actualizado.", "success");
                    });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header />
            <main className="p-6 mt-20 w-full">
                <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">Gestión de usuarios</h2>

                <table className="w-full border border-gray-300 text-left table-auto">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 w-12">ID</th>
                        <th className="p-2">Usuario</th>
                        <th className="p-2">Contraseña (hash)</th>
                        <th className="p-2">Estado</th>
                        <th className="p-2 w-64">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="p-2">{user.id}</td>
                            <td className="p-2">{user.username}</td>
                            <td className="p-2">{user.password}</td>
                            <td className="p-2">{user.status}</td>
                            <td className="p-2">
                                    {editingUserId === user.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSave(user.id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingUserId(null);
                                                    setEditForm({ username: "", password: "" });
                                                }}
                                                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2 items-start">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id, user.username)}
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

