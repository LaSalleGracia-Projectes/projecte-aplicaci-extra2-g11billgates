"use client"; 

import { useState, useEffect } from "react";
import { useRouter} from "next/navigation";

export default function Login () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe,setRememberMe] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Iniciar sesión con:", email, password);

      if(rememberMe) {
        localStorage.setItem("email",email);
        localStorage.setItem("passwoed",passwoed);
      }else {
        localStorage.removeItem("email",email);
        localStorage.removetem("passwoed",passwoed);
      }
      router.push("/dashboard");
   };

    useEffect(() => {
      const savedEmail = localStorage.getItem("email");
      const savedPassword = localStorage.getItem("password");

      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    },[]);
}