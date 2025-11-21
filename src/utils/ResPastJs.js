  import {
    alertaCheck,
    alertaFallo,
    alertaMal,
  } from "../assets/Alertas/Alertas.js";
  import gsap from "gsap";
  import { ruta } from "../utils/ruta.js";

  // Animación de entrada del formulario
  gsap.to("#formContainer", {
    duration: 0.8,
    opacity: 1,
    y: 0,
    ease: "power2.out",
  });

  const token = new URLSearchParams(window.location.search).get("id_token");
  const btn = document.getElementById("submitBtn");
  const msg = document.getElementById("message");
  console.log(token);

  btn.addEventListener("click", async () => {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validar campos
    if (!password || !confirmPassword) {
      msg.textContent = "Todos los campos son obligatorios";
      msg.className = "mt-4 text-center font-semibold text-red-500";
      return;
    }
    if (password !== confirmPassword) {
      msg.textContent = "Las contraseñas no coinciden";
      msg.className = "mt-4 text-center font-semibold text-red-500";
      return;
    }

    try {
      const res = await fetch(`${ruta}/cambiar-password?id_token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, password: password }),
      });

      const data = await res.json();
      msg.textContent = data.message;
      msg.className = `mt-4 text-center font-semibold $   {
          data.success ? "text-green-500" : "text-red-500"
        }`;
      // Redirigir al inicio
      setTimeout(() => {
        alertaCheck(data.message);
        location.href = "/";
      }, 1500);

      // Animación de éxito
      if (data.success) {
        gsap.to("#formContainer", {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        });
      }
    } catch (error) {
      msg.textContent = "Error de conexión con el servidor";
      msg.className = "mt-4 text-center font-semibold text-red-500";
      alertaFallo("Error de conexión con el servidor");
    }
  });