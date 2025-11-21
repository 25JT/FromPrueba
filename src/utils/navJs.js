  import { ruta } from "../utils/ruta.js";
    import {
      alertaCheck2,
      alertaFallo,
      alertaMal,
    } from "../assets/Alertas/Alertas.js";

    const userid = sessionStorage.getItem("Id");
    const role = sessionStorage.getItem("Role");

    

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const closeSidebar = document.getElementById("closeSidebar");

    const btnCerrar = document.getElementById("btnCerrar");
    const btnIniciar = document.getElementById("btnIniciar");

    const btnIniciarMobile = document.getElementById("btnIniciarMobile");

    if (!userid) {
      btnIniciar.classList.remove("hidden");
      btnIniciarMobile.classList.remove("hidden");
      btnCerrar.classList.add("hidden");
    } else {
      btnIniciar.classList.add("hidden");
      btnIniciarMobile.classList.add("hidden");
      btnCerrar.classList.remove("hidden");
      btnCerrar.addEventListener("click", cerrarSesion);
    }

    function cerrarSesion() {
      sessionStorage.clear();
      location.href = "/";
    }

    // Evento para abrir modal de login desde mobile
    btnIniciarMobile.addEventListener("click", () => {
      document.getElementById("loginDropdown").classList.remove("hidden");
    });

    // Mostrar botón hamburguesa si hay sesión
    if (userid) {
      menuToggle.classList.remove("hidden");
    }

    // Estado botones login/cerrar
    if (!userid) {
      btnIniciar.classList.remove("hidden");
      btnCerrar.classList.add("hidden");
    } else {
      btnIniciar.classList.add("hidden");
      btnCerrar.classList.remove("hidden");
      btnCerrar.addEventListener("click", () => {
        sessionStorage.clear();
        location.href = "/";
      });
    }

    // Funciones menú lateral
    menuToggle.addEventListener("click", () => {
      sidebar.classList.remove("-translate-x-full");
      overlay.classList.remove("hidden");
    });

    closeSidebar.addEventListener("click", cerrarMenu);
    overlay.addEventListener("click", cerrarMenu);

    function cerrarMenu() {
      sidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    }

    document
      .getElementById("btnCerrarSidebar")
      .addEventListener("click", () => {
        sessionStorage.clear();
        location.href = "/";
      });

    // Modal login original
    document.addEventListener("DOMContentLoaded", function () {
      const loginDropdown = document.getElementById("loginDropdown");
      const closeLogin = document.getElementById("closeLogin");
      const showForgot = document.getElementById("showForgot");
      const forgotForm = document.getElementById("forgotForm");
      const loginForm = document.getElementById("loginForm");
      const backToLogin = document.getElementById("backToLogin");

      btnIniciar.addEventListener("click", function () {
        loginDropdown.classList.remove("hidden");
      });
      closeLogin.addEventListener("click", function () {
        loginDropdown.classList.add("hidden");
        loginForm.classList.remove("hidden");
        forgotForm.classList.add("hidden");
      });
      showForgot.addEventListener("click", function () {
        loginForm.classList.add("hidden");
        forgotForm.classList.remove("hidden");
      });
      backToLogin.addEventListener("click", function () {
        forgotForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
      });
      loginDropdown.addEventListener("click", function (e) {
        if (e.target === loginDropdown) {
          loginDropdown.classList.add("hidden");
          loginForm.classList.remove("hidden");
          forgotForm.classList.add("hidden");
        }
      });
    });

    // Login BD original
    const formData = document.getElementById("loginForm");
    const correo = document.getElementById("loginEmail");
    const contrasena = document.getElementById("loginPassword");

    if (formData && !formData.dataset.listenerAdded) {
      formData.addEventListener("submit", (e) => {
        e.preventDefault();
        fetch(`${ruta}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correo: correo.value,
            contrasena: contrasena.value,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              sessionStorage.setItem("Id", data.id);
              sessionStorage.setItem("Role", data.role);
              sessionStorage.setItem("StatusNegocio", data.negocio_creado);
              if (data.role === "profesional") {
                if (data.negocio_creado === 1) location.href = "MenuNegocio";
                else location.href = "RegNegocio";
              } else if (data.role === "cliente") {
                location.href = "PrincipalCliente";
              }
            } else {
              alertaMal(data.message);
            }
          })
          .catch((err) => {
            console.error(err);
            alertaFallo("Error al enviar el formulario");
          });
      });
    }

    //restablecer contraseña
    const forgotForm = document.getElementById("forgotForm");
    const correo2 = document.getElementById("forgotEmail");
    const submitBtn = forgotForm?.querySelector('button[type="submit"]');

    if (forgotForm && !forgotForm.dataset.listenerAdded) {
      forgotForm.dataset.listenerAdded = true; // Evita agregar el listener más de una vez

      forgotForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // 🔹 Deshabilitar el botón inmediatamente
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Enviando..."; // Opcional
        }

        fetch(`${ruta}/restablecer-contrasena`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: correo2.value }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alertaCheck2(data.message);
            } else {
              alertaFallo(data.message);
              if (submitBtn) submitBtn.disabled = false; // Reactivar si hubo error
            }
          })
          .catch((err) => {
            console.error(err);
            alertaFallo("Error al enviar el formulario");
            if (submitBtn) submitBtn.disabled = false; // Reactivar si hubo error
          });
      });
    }


    //funciones de la barra lateral
    if (role === "cliente") {
      document.getElementById("Negocio").classList.add("hidden");
      document.getElementById("Citas").classList.remove("hidden");
    }else{
      document.getElementById("Negocio").classList.remove("hidden");
      document.getElementById("Citas").classList.add("hidden");
    }
    
    document.getElementById("Negocio").addEventListener("click", () => {
      location.href = "MenuNegocio";
    });

    document.getElementById("Citas").addEventListener("click", () => {
      location.href = "PrincipalCliente";
    });

