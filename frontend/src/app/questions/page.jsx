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

  const handleSendResponse = async () => {
    if (!activeQuestion || !response) return;
  
    try {
      const res = await fetch("http://localhost:3001/api/emails/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: activeQuestion.username,
          subject: `Respuesta a tu mensaje`,
          text: response,
        }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        Swal.fire(
          "Respuesta Enviada",
          `Tu respuesta a ${activeQuestion.username} ha sido enviada.`,
          "success"
        );
        setActiveQuestion(null);
        setResponse("");
      } else {
        Swal.fire("Error", "No se pudo enviar el correo", "error");
      }
    } catch (error) {
      console.error("Error al enviar correo:", error);
      Swal.fire("Error", "No se pudo enviar la respuesta", "error");
    }
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
        fetch(`http://localhost:3001/api/emails/${questionToDelete._id}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) throw new Error("No se pudo eliminar");
            setQuestions((prev) =>
              prev.filter((q) => q._id !== questionToDelete._id)
            );
            loadedIdsRef.current.delete(questionToDelete._id);
            Swal.fire("¡Eliminado!", "La pregunta fue eliminada.", "success");
          })
          .catch(() => {
            Swal.fire("Error", "No se pudo eliminar el mensaje", "error");
          });
      }
    });
  };

  const showResponseModal = (question) => {
    setActiveQuestion(question);
    Swal.fire({
      title: 'Responder Pregunta',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Usuario:</strong> ${question.username}</p>
          <p class="mb-4"><strong>Pregunta:</strong> ${question.question}</p>
          <label class="block font-medium mb-2">Respuesta:</label>
          <textarea id="response-text" class="w-full border p-2 rounded mb-4" rows="5"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Enviar Respuesta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        const responseText = document.getElementById('response-text').value;
        if (!responseText) {
          Swal.showValidationMessage('Por favor, escribe una respuesta');
          return false;
        }
        setResponse(responseText);
        return responseText;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleSendResponse();
      } else {
        setActiveQuestion(null);
        setResponse("");
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
                onRespond={showResponseModal}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
