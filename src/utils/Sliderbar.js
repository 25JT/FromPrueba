
import { ruta } from "../utils/ruta.js";
// ===== SIDEBAR MANAGEMENT =====
// Este archivo maneja toda la funcionalidad del sidebar (menú lateral)

// ===== SESSION MANAGEMENT =====
const userid = sessionStorage.getItem("Id");
const role = sessionStorage.getItem("Role");




// ===== DOM ELEMENTS =====
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeSidebar = document.getElementById("closeSidebar");
const btnCerrarSidebar = document.getElementById("btnCerrarSidebar");

// ===== UTILITY FUNCTIONS =====
function cerrarSesion() {
    sessionStorage.clear();
    location.href = "/";
}

function cerrarMenu() {
    if (sidebar) sidebar.classList.add("-translate-x-full");
    if (overlay) overlay.classList.add("hidden");
}

// ===== INITIALIZE SIDEBAR VISIBILITY =====
function initializeSidebar() {
    // Mostrar botón hamburguesa solo si hay sesión activa
    if (userid && menuToggle) {
        menuToggle.classList.remove("hidden");
    }
}

// Inicializar sidebar
initializeSidebar();

// ===== EVENT LISTENERS =====

// Abrir sidebar
if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.remove("-translate-x-full");
        overlay.classList.remove("hidden");
    });
}

// Cerrar sidebar con botón X
if (closeSidebar) {
    closeSidebar.addEventListener("click", cerrarMenu);
}

// Cerrar sidebar al hacer click en el overlay
if (overlay) {
    overlay.addEventListener("click", cerrarMenu);
}

// Botón cerrar sesión desde sidebar
if (btnCerrarSidebar) {
    btnCerrarSidebar.addEventListener("click", cerrarSesion);
}

// ===== SIDEBAR ROLE-BASED NAVIGATION =====
const negocioLink = document.getElementById("Negocio");
const citasLink = document.getElementById("Citas");

if (negocioLink && citasLink) {
    // Mostrar/ocultar links según el rol del usuario
    if (role === "cliente") {
        negocioLink.classList.add("hidden");
        citasLink.classList.remove("hidden");
    } else {
        negocioLink.classList.remove("hidden");
        citasLink.classList.add("hidden");
    }

    // Navegación a MenuNegocio
    negocioLink.addEventListener("click", () => {
        location.href = "MenuNegocio";
    });

    // Navegación a PrincipalCliente
    citasLink.addEventListener("click", () => {
        location.href = "PrincipalCliente";
    });
}


//funciones conexion server

if (userid) {
    window.addEventListener("load", function () {
        const cachedName = sessionStorage.getItem("userName");
        const cachedEmail = sessionStorage.getItem("userEmail");

        const nombreUserEl = document.getElementById("nombreUser");
        const correoUserEl = document.getElementById("correoUser");

        if (cachedName && cachedEmail) {
            if (nombreUserEl) nombreUserEl.textContent = cachedName;
            if (correoUserEl) correoUserEl.textContent = cachedEmail;
        } else {
            fetch(`${ruta}/nombreUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error en respuesta: " + response.statusText);
                    }
                    return response.json();
                })
                .then((data) => {
                    sessionStorage.setItem("userName", data.nombre);
                    sessionStorage.setItem("userEmail", data.correo);

                    if (nombreUserEl) nombreUserEl.textContent = data.nombre;
                    if (correoUserEl) correoUserEl.textContent = data.correo;
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    });
}
