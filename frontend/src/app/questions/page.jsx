"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Header from "@/app/components/Header";
import QuestionRow from "@/app/components/QuestionRow";

export default function UserQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [response, setResponse] = useState("");
  const loadedIdsRef = useRef(new Set());

  const fetchEmails = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/emails/all");
      const data = await res.json();

      const newQuestions = data.filter((q) => !loadedIdsRef.current.has(q._id));

      if (newQuestions.length > 0) {
        setQuestions((prev) => [...newQuestions, ...prev]);
        newQuestions.forEach((q) => loadedIdsRef.current.add(q._id));
      }
    } catch (err) {
      console.error("Error al cargar correos:", err);
    }
  };

  useEffect(() => {
    fetchEmails();

    const interval = setInterval(() => {
      fetchEmails();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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

  const handleDelete = (questionToDelete) => {
    Swal.fire({
      title: `¿Estás seguro?`,
      text: `Esto eliminará la pregunta de ${questionToDelete.username}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setQuestions((prev) =>
          prev.filter((q) => q._id !== questionToDelete._id)
        );
        loadedIdsRef.current.delete(questionToDelete._id);
        Swal.fire("¡Eliminado!", "La pregunta fue eliminada.", "success");
      }
    });
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
            {questions.map((q, index) => (
              <QuestionRow
                key={q._id || index}
                q={q}
                index={index}
                onRespond={setActiveQuestion}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        {activeQuestion && (
          <div className="bg-white border rounded p-6 shadow mt-10 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Responder Pregunta:</h3>
            <p className="mb-2"><strong>Usuario:</strong> {activeQuestion.username}</p>
            <p className="mb-4"><strong>Pregunta:</strong> {activeQuestion.question}</p>

            <label className="block font-medium mb-2">Respuesta:</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              rows="5"
            />

            <div className="flex space-x-4">
              <button
                onClick={handleSendResponse}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Enviar Respuesta
              </button>

              <button
                onClick={() => {
                  setActiveQuestion(null);
                  setResponse("");
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
