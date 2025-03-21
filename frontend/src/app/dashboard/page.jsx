"use client";

import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
    const [reports, setReports] = useState(0);
    const [unansweredQuestions, setUnansweredQuestions] = useState(0);
    const [active, setActiveUsers] = useState(0);
}