import { validarInicioProfesional } from "./validarInicio.js";
import { ruta } from "./ruta.js";


validarInicioProfesional();

const userid = sessionStorage.getItem("Id");
const userRole = sessionStorage.getItem("Role");

// Variables globales para el calendario
let diasTrabajo = [];
let diasTrabajoNumeros = [];
let diasExcepciones = {}; // Objeto para almacenar excepciones por fecha: "2025-11-25": boolean
let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();
//calendario
// Función para convertir nombres de días a números
function convertirDiasANumeros(diasTexto) {
    const mapaDias = {
        "Domingo": 0,
        "Lunes": 1,
        "Martes": 2,
        "Miércoles": 3,
        "Jueves": 4,
        "Viernes": 5,
        "Sábado": 6
    };

    if (!diasTexto || diasTexto.length === 0) return [];

    // Si diasTexto es un string separado por comas
    if (typeof diasTexto === 'string') {
        return diasTexto.split(',').map(dia => mapaDias[dia.trim()]).filter(num => num !== undefined);
    }

    // Si es un array de strings
    if (Array.isArray(diasTexto)) {
        return diasTexto.map(dia => mapaDias[dia.trim()]).filter(num => num !== undefined);
    }

    return [];
}

function cargarDatos() {
    fetch(`${ruta}/api/ajustes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userid,
            userRole,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                const diasTrabajo = data.data[0].dias_trabajo || [];
                diasTrabajoNumeros = convertirDiasANumeros(diasTrabajo);
                renderizarCalendario();
                const duracionCita = data.data[0].intervaloCitas;

            } else
                console.log(data.message);
        })
        .catch(error => {
            console.error("Error cargando ajustes:", error);
        });
}

function renderizarCalendario() {
    const calendarioDias = document.getElementById("calendario-dias");
    const mesAnioTexto = document.getElementById("mes-anio-texto");



    // Limpiar calendario
    calendarioDias.innerHTML = "";

    // Obtener primer y último día del mes
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    const diasEnMes = ultimoDia.getDate();

    // Obtener día de la semana del primer día (0 = Domingo, 1 = Lunes, etc.)
    let primerDiaSemana = primerDia.getDay();
    // Ajustar para que Lunes sea 0
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    // Actualizar texto del mes
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    if (mesAnioTexto) {
        mesAnioTexto.textContent = `${meses[mesActual]} ${anioActual}`;
    }

    // Agregar espacios vacíos antes del primer día
    for (let i = 0; i < primerDiaSemana; i++) {
        const espacioVacio = document.createElement("div");
        espacioVacio.className = "aspect-square";
        calendarioDias.appendChild(espacioVacio);
    }

    // Obtener fecha actual
    const hoy = new Date();
    const esHoy = (dia) => {
        return dia === hoy.getDate() &&
            mesActual === hoy.getMonth() &&
            anioActual === hoy.getFullYear();
    };

    // Generar días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = new Date(anioActual, mesActual, dia);
        const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

        // Crear clave única para la fecha: "YYYY-M-D"
        const fechaClave = `${anioActual}-${mesActual}-${dia}`;

        // Determinar si es día de trabajo
        // 1. Verificamos si hay una excepción específica para este día
        // 2. Si no, usamos la regla general de días de la semana
        let esDiaTrabajo;

        if (diasExcepciones.hasOwnProperty(fechaClave)) {
            esDiaTrabajo = diasExcepciones[fechaClave];
        } else {
            esDiaTrabajo = diasTrabajoNumeros.includes(diaSemana);
        }

        const botonDia = document.createElement("button");
        botonDia.className = `aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all group relative`;

        if (esHoy(dia)) {
            // Día actual
            botonDia.className += ` bg-white ring-2 ring-blue-500 ring-offset-2 text-blue-500 font-bold hover:bg-slate-50 z-10`;
        } else if (esDiaTrabajo) {
            // Día de trabajo
            botonDia.className += ` bg-blue-500 text-white hover:bg-blue-600 font-semibold`;
        } else {
            // Día no laborable
            botonDia.className += ` bg-slate-50 text-slate-400 hover:bg-slate-100 border border-transparent hover:border-slate-200`;
        }

        const spanDia = document.createElement("span");
        spanDia.className = "text-sm" + (esDiaTrabajo || esHoy(dia) ? " font-semibold" : " font-medium");
        spanDia.textContent = dia;

        botonDia.appendChild(spanDia);

        // Agregar indicador para días de trabajo
        if (esDiaTrabajo || esHoy(dia)) {
            const indicador = document.createElement("div");
            indicador.className = `size-1 rounded-full ${esHoy(dia) ? 'bg-primary' : 'bg-white/50'}`;
            botonDia.appendChild(indicador);
        }

        // Agregar event listener para marcar/desmarcar días específicos (excepciones)
        botonDia.addEventListener('click', () => {
            const fechaClaveClick = `${anioActual}-${mesActual}-${dia}`;

            // Invertir el estado actual
            const nuevoEstado = !esDiaTrabajo;

            // Guardar en excepciones
            diasExcepciones[fechaClaveClick] = nuevoEstado;

            console.log(`📅 Fecha ${dia}/${mesActual + 1}/${anioActual} (Día ${diaSemana})`);
            console.log(`   Estado cambiado a: ${nuevoEstado ? 'LABORABLE' : 'NO LABORABLE'}`);
            console.log("   Excepciones actuales:", diasExcepciones);

            // Re-renderizar el calendario
            renderizarCalendario();
        });

        calendarioDias.appendChild(botonDia);
    }
}

function cambiarMes(direccion) {
    mesActual += direccion;

    if (mesActual > 11) {
        mesActual = 0;
        anioActual++;
    } else if (mesActual < 0) {
        mesActual = 11;
        anioActual--;
    }

    renderizarCalendario();
}

// Event listeners para navegación
document.addEventListener("DOMContentLoaded", () => {
    const btnAnterior = document.getElementById("btn-mes-anterior");
    const btnSiguiente = document.getElementById("btn-mes-siguiente");

    if (btnAnterior) {
        btnAnterior.addEventListener("click", () => cambiarMes(-1));
    }

    if (btnSiguiente) {
        btnSiguiente.addEventListener("click", () => cambiarMes(1));
    }
});

cargarDatos();
// fin calendario

// duracion citas
function duracionCita() {
    const duracionInputs = document.querySelectorAll('input[name="duration"]');

    duracionInputs.forEach(input => {
        input.addEventListener("change", () => {
            // Remover borde de todos los labels
            duracionInputs.forEach(otherInput => {
                const label = otherInput.closest('label');
                if (label) {
                    label.classList.remove('border-blue-500', 'border-2');
                    label.classList.add('border-slate-200');

                    // Resetear iconos
                    const iconContainer = label.querySelector('.relative.flex');
                    if (iconContainer) {
                        const uncheckedIcon = iconContainer.children[0];
                        const checkedIcon = iconContainer.children[1];
                        if (uncheckedIcon) {
                            uncheckedIcon.classList.remove('opacity-0', 'scale-0');
                        }
                        if (checkedIcon) {
                            checkedIcon.classList.add('opacity-0');
                            checkedIcon.classList.add('scale-0');
                        }
                    }
                }
            });

            // Agregar borde al label seleccionado
            const selectedLabel = input.closest('label');
            if (selectedLabel) {
                selectedLabel.classList.remove('border-slate-200');
                selectedLabel.classList.add('border-blue-500', 'border-2');

                // Cambiar iconos del seleccionado
                const iconContainer = selectedLabel.querySelector('.relative.flex');
                if (iconContainer) {
                    const uncheckedIcon = iconContainer.children[0];
                    const checkedIcon = iconContainer.children[1];
                    if (uncheckedIcon) {
                        uncheckedIcon.classList.add('opacity-0');
                        uncheckedIcon.classList.add('scale-0');
                    }
                    if (checkedIcon) {
                        checkedIcon.classList.remove('opacity-0', 'scale-0');
                    }
                }
            }

            console.log("Duración seleccionada:", input.value, "minutos");
        });
    });
}
duracionCita();

//horario de jornada

function horarioJornada() {
    document.addEventListener("DOMContentLoaded", () => {
        const btnInicio = document.getElementById("hora_inicio");
        const btnFin = document.getElementById("hora_fin");

        btnInicio.addEventListener("change", () => {
            const horaInicio = btnInicio.value;

            console.log("Hora de inicio seleccionada:", horaInicio);
        });
        btnFin.addEventListener("change", () => {
            const horaFin = btnFin.value;

            console.log("Hora de fin seleccionada:", horaFin);
        });

    });

}

horarioJornada();

