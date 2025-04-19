"use client";

import React from "react";
import Swal from "sweetalert2";

const QuestionRow = React.memo(function QuestionRow({ q, index, onRespond, onDelete }) {
    return (
        <tr key={q.id || index} className="border-t">
            <td className="p-2">{index + 1}</td>
            <td className="p-2">{q.username}</td>
            <td className="p-2">{q.question}</td>
            <td className="p-2 flex flex-col gap-2 items-start">
                <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => onRespond(q)}
                >
                    Responder
                </button>
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => onDelete(q)}
                >
                    Borrar
                </button>
                <button
                    className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
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
    );
});

export default QuestionRow;
