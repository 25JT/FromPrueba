const idElement = document.getElementById("idservicio");
const id = idElement ? idElement.dataset.id : null;

// Ensure ID exists
if (idElement && id) {
    idElement.textContent = "ID Establecimiento: " + id;
}

import { ruta } from "../utils/ruta.js";
import gsap from "gsap";
import {
    alertaCheck4,
    alertaFallo,
    alertaMal,
} from "../assets/Alertas/Alertas.js";
const userid = sessionStorage.getItem("Id");

// State for working days
let diasTrabajoPermitidos = []; // Array of day indices (0=Sun, 1=Mon, ..., 6=Sat)

async function cargarHorasDisponibles() {
    const idServicio = id;
    const fecha = document.getElementById("fecha").value;
    const loader = document.getElementById("loader-servicios");
    const contenedor = document.getElementById("horas");

    if (!idServicio || !fecha) {
        // Silent return or handled by validation
        return;
    }

    // Validate if the selected day is allowed
    const selectedDate = new Date(fecha + "T00:00:00"); // Force local time parsing
    const dayIndex = selectedDate.getDay();
    // Sunday is 0 in JS getDay(), but often people map Mon=1..Sun=7. 
    // We will standardize on JS getDay() (0=Sun...6=Sat).

    // Check if day is in allowed list
    if (diasTrabajoPermitidos.length > 0 && !diasTrabajoPermitidos.includes(dayIndex)) {
        alert("El establecimiento no atiende este día. Por favor seleccione otro.");
        document.getElementById("fecha").value = "";
        contenedor.innerHTML = "";
        return;
    }

    if (loader) loader.classList.remove("hidden");
    contenedor.innerHTML = "";

    try {
        const response = await fetch(`${ruta}/validarHoras`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: idServicio,
                fecha: fecha
            }),
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();

        if (data.success) {
            mostrarHorasDisponibles(data);
            console.log(data);

        } else {
            // throw new Error(data.message || "Error al obtener horas disponibles");
            contenedor.innerHTML = `<div class="col-span-full text-center py-4 text-gray-500">${data.message || "No hay horas disponibles"}</div>`;
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarError("No se pudieron cargar las horas disponibles.");
    } finally {
        if (loader) loader.classList.add("hidden");
    }
}

function mostrarHorasDisponibles(data) {
    const contenedor = document.getElementById("horas");
    contenedor.innerHTML = "";

    if (!data.disponibles || data.disponibles.length === 0) {
        contenedor.innerHTML = `
            <div class="col-span-full text-center py-4 text-gray-500">
                No hay horas disponibles para esta fecha.
            </div>
        `;
        return;
    }

    // Crear botones para cada hora disponible
    data.disponibles.forEach(hora24 => {
        const [hora] = hora24.split(':');
        const horaNum = parseInt(hora);
        const ampm = horaNum >= 12 ? 'PM' : 'AM';
        const hora12 = horaNum % 12 === 0 ? 12 : horaNum % 12; // 0 hour is 12 AM
        // Format to hh:mm
        const minute = hora24.split(':')[1] || "00";
        const labelTime = `${hora12}:${minute}`;

        const boton = document.createElement('button');
        // New Style
        boton.className = 'hora flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 bg-background-light hover:bg-primary hover:text-white hover:border-primary transition-all group';
        boton.dataset.id = hora24;
        boton.type = 'button';

        boton.innerHTML = `
             <span class="text-lg font-bold pointer-events-none">${labelTime}</span>
             <span class="text-xs uppercase font-medium text-slate-500 group-hover:text-blue-100 pointer-events-none">${ampm}</span>
        `;

        boton.addEventListener('click', () => {
            document.querySelectorAll('.hora').forEach(b => {
                // Reset styles
                b.className = 'hora flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 bg-background-light hover:bg-primary hover:text-white hover:border-primary transition-all group';
                const spans = b.querySelectorAll('span');
                if (spans[1]) spans[1].classList.add('text-slate-500');
                if (spans[1]) spans[1].classList.remove('text-blue-800');
            });
            // Active style
            boton.className = 'hora flex flex-col items-center justify-center p-3 rounded-lg border border-blue-500 bg-primary text-black transition-all shadow-md ring-2 ring-primary/20  ';
            const activeSpans = boton.querySelectorAll('span');
            if (activeSpans[1]) activeSpans[1].classList.remove('text-slate-500');
            if (activeSpans[1]) activeSpans[1].classList.add('text-blue-800');

            document.getElementById('hora').value = hora24;
        });

        contenedor.appendChild(boton);
    });
}

function mostrarError(mensaje) {
    const contenedor = document.getElementById("horas");
    contenedor.innerHTML = `
        <div class="col-span-full text-center py-4 text-red-500">
            ${mensaje}
        </div>
    `;
}

// Helper to parse working days string e.g. "Lunes a Viernes" or "Lunes, Miercoles"
function parsearDiasTrabajo(diasStr) {
    if (!diasStr) return [];
    const diasMap = {
        'lunes': 1, 'martes': 2, 'miercoles': 3, 'miércoles': 3,
        'jueves': 4, 'viernes': 5, 'sabado': 6, 'sábado': 6, 'domingo': 0
    };

    diasStr = diasStr.toLowerCase();

    // Simple logic: check inclusion
    let allowed = [];

    // Check ranges like "Lunes a Viernes"
    if (diasStr.includes(' a ')) {
        const parts = diasStr.split(' a ');
        const start = diasMap[parts[0].trim()];
        const end = diasMap[parts[1].trim()];
        if (start !== undefined && end !== undefined) {
            let current = start;
            while (current !== end) {
                allowed.push(current);
                current = (current + 1) % 7;
            }
            allowed.push(end);
        }
    } else {
        // Check individual days
        Object.keys(diasMap).forEach(dayName => {
            if (diasStr.includes(dayName)) {
                allowed.push(diasMap[dayName]);
            }
        });
    }

    // If "Lunes - Viernes" syntax
    if (diasStr.includes('-')) {
        // Fallback for hyphen
        const parts = diasStr.split('-');
        if (parts.length === 2 && diasMap[parts[0].trim()] && diasMap[parts[1].trim()]) {
            const start = diasMap[parts[0].trim()];
            const end = diasMap[parts[1].trim()];
            let current = start;
            while (current !== end) {
                allowed.push(current);
                current = (current + 1) % 7;
            }
            allowed.push(end);
        }
    }

    return [...new Set(allowed)];
}

function actualizarCirculosDias(diasStr) {
    diasTrabajoPermitidos = parsearDiasTrabajo(diasStr);

    const mapDayToName = {
        1: 'Lunes', 2: 'Martes', 3: 'Miercoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sabado', 0: 'Domingo'
    };

    // Reset all circles
    document.querySelectorAll('.dia-circle').forEach(div => {
        const circle = div.querySelector('div');
        if (circle) {
            circle.className = 'w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-300';
        }
    });

    // Highlight allowed
    diasTrabajoPermitidos.forEach(dayIdx => {
        // Find element by data-day or similar
        // BodyId uses names like "Lunes", "Martes"
        // Need to match dayIdx to these
        const name = mapDayToName[dayIdx]; // e.g. "Lunes"
        // Try simple search
        // Note: BodyId uses "Miercoles" no accent in data-day if I set it so. 
        // Let's assume standard names.

        // Improve selector in BodyId to have data-attributes or just query text
    });

    // More robust approach: Iterate circles and check data-day
    const circles = document.querySelectorAll('.dia-circle'); // Added class in BodyId step
    circles.forEach(circleContainer => {
        const dayName = circleContainer.dataset.day; // "Lunes", "Martes"
        // Map dayName to index
        const dayNameLower = dayName.toLowerCase().replace('é', 'e').replace('á', 'a');
        const map = {
            'lunes': 1, 'martes': 2, 'miercoles': 3, 'jueves': 4, 'viernes': 5, 'sabado': 6, 'domingo': 0
        };

        if (diasTrabajoPermitidos.includes(map[dayNameLower])) {
            const div = circleContainer.querySelector('div');
            if (div) {
                div.className = 'w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-xs font-bold shadow-sm';
            }
        }
    });
}


document.getElementById("fecha").addEventListener("change", cargarHorasDisponibles);


fetch(`${ruta}/datosUsuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid, id }),
})
    .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
    })

    .then((data) => {
        //  console.log(data);
        const usuario = data.data[0];
        const Establecimiento = data.rows2[0];

        // Fill hidden fields for submit logic
        if (document.getElementById("nombre")) document.getElementById("nombre").innerHTML = usuario.nombre;
        if (document.getElementById("apellido")) document.getElementById("apellido").innerHTML = usuario.apellidos;
        if (document.getElementById("telefono")) document.getElementById("telefono").innerHTML = usuario.telefono;
        if (document.getElementById("correo")) document.getElementById("correo").innerHTML = usuario.correo;

        if (document.getElementById("dias")) document.getElementById("dias").innerHTML = Establecimiento.dias_trabajo;
        if (document.getElementById("negocio")) document.getElementById("negocio").innerHTML = Establecimiento.nombre_establecimiento;
        if (document.getElementById("telefono_negocio")) document.getElementById("telefono_negocio").innerHTML = Establecimiento.telefono_establecimiento;
        if (document.getElementById("direccion")) document.getElementById("direccion").innerHTML = Establecimiento.direccion;

        // Visual Updates
        const tituloNegocio = document.getElementById("nombre-negocio-titulo");
        if (tituloNegocio) tituloNegocio.textContent = "Agendar en " + Establecimiento.nombre_establecimiento;

        actualizarCirculosDias(Establecimiento.dias_trabajo || "");
    })
    .catch((err) => {
        console.error("Error al obtener datos:", err);
    });

// --- CONTADOR DE CARACTERES MENSAJE ---
const mensajeInput = document.getElementById("mensaje");
const contadorMensaje = document.getElementById("contador-mensaje");
if (mensajeInput && contadorMensaje) {
    mensajeInput.addEventListener("input", function () {
        const restante = 100 - mensajeInput.value.length;
        contadorMensaje.textContent = restante;
    });
}

// --- VALIDACIONES DE FECHA Y HORA ---
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");
const form = document.getElementById("citaForm");
const mensaje2 = document.getElementById("mensaje");

// Bloquear fechas pasadas
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    if (fechaInput) fechaInput.setAttribute("min", minDate);
});

// Validar disponibilidad antes de enviar
if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        const nombre = document.getElementById("nombre").innerHTML;
        const apellido = document.getElementById("apellido").innerHTML;
        const fecha = fechaInput.value;
        const hora = horaInput.value;
        const mensaje = mensaje2 ? mensaje2.value : "";
        const correo = document.getElementById("correo").innerHTML;
        const nombre_establecimiento = document.getElementById("negocio").innerHTML;
        const telefono_establecimiento = document.getElementById("telefono_negocio").innerHTML;
        const direccion = document.getElementById("direccion").innerHTML;

        if (!fecha || !hora) {
            alertaMal("Selecciona una fecha y hora válidas");
            submitButton.disabled = false;
            return;
        }

        const response = await fetch(`${ruta}/agendarcita`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userid,
                id,
                fecha,
                hora,
                mensaje,
                correo,
                nombre_establecimiento,
                telefono_establecimiento,
                nombre,
                apellido,
                direccion,
            }),
        })
            .finally(() => {
                submitButton.disabled = false;
            });

        if (!response.ok) {
            const errorText = await response.text();
            // console.error("Respuesta inesperada:", errorText);
            alertaFallo("Error al agendar");
            return;
        }

        const data = await response.json();
        if (!data.success) {
            alertaMal(data.message);
            return;
        }
        alertaCheck4("Cita agendada correctamente");
    });
}

//volver
const btnVolver = document.getElementById("volver");
if (btnVolver) {
    btnVolver.addEventListener("click", function () {
        history.back();
    });
}

// GSAP
if (form) {
    gsap.from("#citaForm", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
    });
}