import { ruta } from "../utils/ruta.js";
import {
  alertaCheck2,
  alertaFallo,
  alertaMal,
} from "../assets/Alertas/Alertas.js";

// ===== SESSION MANAGEMENT =====
const userid = sessionStorage.getItem("Id");
const role = sessionStorage.getItem("Role");

// ===== DOM ELEMENTS =====
const btnCerrar = document.getElementById("btnCerrar");
const btnIniciar = document.getElementById("btnIniciar");
const btnIniciarMobile = document.getElementById("btnIniciarMobile");

// ===== UTILITY FUNCTIONS =====
function cerrarSesion() {
  sessionStorage.clear();
  location.href = "/";
}



// ===== INITIALIZE UI BASED ON SESSION =====
function initializeAuthButtons() {
  if (!userid) {
    // Usuario NO ha iniciado sesión
    if (btnIniciar) {
      btnIniciar.classList.remove("hidden");
      btnIniciar.classList.add("border-2", "border-[#135bec]", "rounded-2xl");
    }
    if (btnIniciarMobile) {
      btnIniciarMobile.classList.remove("hidden");
      btnIniciarMobile.classList.add("border-2", "border-[#135bec]", "rounded-2xl");
    }
    if (btnCerrar) {
      btnCerrar.classList.add("hidden");
    }
  } else {
    // Usuario ha iniciado sesión
    if (btnIniciar) btnIniciar.classList.add("hidden");
    if (btnIniciarMobile) btnIniciarMobile.classList.add("hidden");
    if (btnCerrar) {
      btnCerrar.classList.remove("hidden");
      btnCerrar.addEventListener("click", cerrarSesion);
    }
  }
}

// Inicializar botones de autenticación
initializeAuthButtons();

// ===== EVENT LISTENERS =====

// Evento para abrir modal de login desde mobile
if (btnIniciarMobile) {
  btnIniciarMobile.addEventListener("click", () => {
    const loginDropdown = document.getElementById("loginDropdown");
    if (loginDropdown) loginDropdown.classList.remove("hidden");
  });
}



// ===== MODAL LOGIN =====
document.addEventListener("DOMContentLoaded", function () {
  const loginDropdown = document.getElementById("loginDropdown");
  const closeLogin = document.getElementById("closeLogin");
  const showForgot = document.getElementById("showForgot");
  const forgotForm = document.getElementById("forgotForm");
  const loginForm = document.getElementById("loginForm");
  const backToLogin = document.getElementById("backToLogin");

  // Evento para abrir modal de login desde desktop
  if (btnIniciar && loginDropdown) {
    btnIniciar.addEventListener("click", function () {
      loginDropdown.classList.remove("hidden");
    });
  }

  // Cerrar modal de login
  if (closeLogin && loginDropdown && loginForm && forgotForm) {
    closeLogin.addEventListener("click", function () {
      loginDropdown.classList.add("hidden");
      loginForm.classList.remove("hidden");
      forgotForm.classList.add("hidden");
    });
  }

  // Mostrar formulario de recuperación de contraseña
  if (showForgot && loginForm && forgotForm) {
    showForgot.addEventListener("click", function () {
      loginForm.classList.add("hidden");
      forgotForm.classList.remove("hidden");
    });
  }

  // Volver al formulario de login
  if (backToLogin && forgotForm && loginForm) {
    backToLogin.addEventListener("click", function () {
      forgotForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    });
  }

  // Cerrar modal al hacer click fuera
  if (loginDropdown && loginForm && forgotForm) {
    loginDropdown.addEventListener("click", function (e) {
      if (e.target === loginDropdown) {
        loginDropdown.classList.add("hidden");
        loginForm.classList.remove("hidden");
        forgotForm.classList.add("hidden");
      }
    });
  }
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
            location.href = "CitasAgendadas";
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


