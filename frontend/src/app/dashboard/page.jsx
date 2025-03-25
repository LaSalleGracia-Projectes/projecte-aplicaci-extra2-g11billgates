"use client";

import { useState } from "react";
import Header from "@/app/components/Header"

export default function Dashboard() {
    const [reports, setReports] = useState(0);
    const [unansweredQuestions, setUnansweredQuestions] = useState(0);
    const [active, setActiveUsers] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <Header/>
        </div>
    );
}