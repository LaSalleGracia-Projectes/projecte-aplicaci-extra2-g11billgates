"use client";

import { useState } from "react";
import Swal from "sweetalert2";
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
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [response, setResponse] = useState("");

    const handleSendResponse = () => {
        if (!activeQuestion) return;
    
        Swal.fire(
            "Respuesta Enviada",
            `Tu respuesta a ${activeQuestion.username} ha sido registrada.`,
            "success"
        );
    
        setActiveQuestion(null);
        setResponse("");
    };    
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
                                <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                onClick={() => setActiveQuestion(q)}
                                >
                                    Responder
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => {
                                    Swal.fire({
                                        title: `¿Estás seguro?`,
                                        text: `Esto eliminará la pregunta de ${q.username}.`,
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#d33",
                                        cancelButtonColor: "#3085d6",
                                        confirmButtonText: "Sí, borrar",
                                        cancelButtonText: "Cancelar",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            setQuestions(questions.filter(item => item.id !== q.id));
                                            Swal.fire("¡Eliminado!", "La pregunta fue eliminada.", "success");
                                        }
                                    });
                                }}                                
                                >
                                    Borrar
                                </button>
                                <button className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                                onClick={() => {
                                    Swal.fire({
                                        title: `¿Banear a ${q.username}?`,
                                        text: "Esta acción no se puede deshacer.",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#000",
                                        cancelButtonColor: "#3085d6",
                                        confirmButtonText: "Sí, banear",
                                        cancelButtonText: "Cancelar",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            Swal.fire("Usuario Baneado", `${q.username} ha sido baneado.`, "success");
                                        }
                                    });
                                }}
                                >
                                    Banear
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {activeQuestion && (
                <div className="bg-white border rounded p-6 shadow mt-10 max-w-2xl">
                    <h3 className="text-xl font-semibold mb-4">Responder Pregunta:</h3>
                    <p className="mb-2">
                        <strong>Usuario:</strong> {activeQuestion.username}
                    </p>
                    <p className="mb-4">
                        <strong>Pregunta:</strong> {activeQuestion.question}
                    </p>

                    <label className="block font-medium mb-2">Respuesta:</label>
                    <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="w-full border p-2 rounded mb-4"
                        rows="5"
                    />

                    <button
                        onClick={handleSendResponse}
                        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                    >
                        Enviar Respuesta
                    </button>
                </div>
            )}
            </main>
        </div>
    );
}
