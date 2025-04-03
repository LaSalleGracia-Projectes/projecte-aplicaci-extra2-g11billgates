"use client";

import { useState } from "react";
import Header from "@/app/components/Header";

export default function UserQuestionsPage() {

    const [questions, setQuestions] = useState([
        {
            id: 1,
            username: "Player123",
            question: "¿Cómo puedo cambiar mi foto de perfil?",
        },
        {
            id: 2,
            username: "Player245",
            question: "¿Cómo cambio mi usuario?",
        },
    ]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header />
            <main className="p-6 mt-20 w-full">
                <div className="max-w-full">
                    <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2">Preguntas de Usuarios</h2>
                    <p className="mb-4 text-sm text-gray-600">
                        Revisa y responde las preguntas enviadas por los usuarios.
                    </p>
                </div>

                <table className="w-full border border-gray-300 text-left table-auto">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 w-12">ID</th>
                        <th className="p-2 w-40">Usuario</th>
                        <th className="p-2">Pregunta</th>
                        <th className="p-2 w-48">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((q) => (
                        <tr key={q.id} className="border-t">
                            <td className="p-2">{q.id}</td>
                            <td className="p-2">{q.username}</td>
                            <td className="p-2">{q.question}</td>
                            <td className="p-2 flex flex-col gap-2 items-start">
                                <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                    Responder
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                    Borrar
                                </button>
                                <button className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
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
