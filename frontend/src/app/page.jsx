"use client"; 

import { useState, useEffect } from "react";
import { useRouter} from "next/navigation";

export default function Login () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe,setRememberMe] = useState("");
  const router = useRouter();

}