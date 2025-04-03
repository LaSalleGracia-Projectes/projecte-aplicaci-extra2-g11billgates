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
                            <button
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                onClick={() => handleDelete(user.id, user.username)}
                            >
                                Eliminar
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

