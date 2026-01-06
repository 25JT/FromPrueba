import { ruta } from "../utils/ruta.js";
import { validarInicioProfesional } from "./validarInicio.js";
import { alertaConfirm, alertaCheck, alertaFallo } from "../assets/Alertas/Alertas.js";
import flatpickr from "flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";

validarInicioProfesional();
const userid = sessionStorage.getItem("Id");

// Variables de paginación
let paginaActual = 1;
const citasPorPagina = 5;
let totalCitas = 0;
let todasLasCitas = [];
let citasFiltradas = [];

// Variables de filtro
let filtroFechaInicio = null;
let filtroFechaFin = null;

// Inicializar y Eventos al cargar
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Flatpickr
    const dateRangeInput = document.getElementById("date-range");
    if (dateRangeInput) {
        flatpickr(dateRangeInput, {
            mode: "range",
            dateFormat: "Y-m-d",
            locale: Spanish,
            minDate: "today",
            onClose: function (selectedDates, dateStr, instance) {
                if (selectedDates.length === 2) {
                    filtroFechaInicio = selectedDates[0];
                    filtroFechaFin = selectedDates[1];
                    // Ajustar fin del día para la fecha final
                    filtroFechaFin.setHours(23, 59, 59, 999);
                } else {
                    filtroFechaInicio = null;
                    filtroFechaFin = null;
                }
            }
        });
    }

    // Botón Filtrar
    const btnAplicarFiltros = document.getElementById("btn-aplicar-filtros");
    if (btnAplicarFiltros) {
        btnAplicarFiltros.addEventListener("click", aplicarFiltros);
    }
});

function aplicarFiltros() {
    const estadoFiltro = document.getElementById("status-filter").value;
    const busqueda = document.getElementById("search").value.toLowerCase().trim();

    citasFiltradas = todasLasCitas.filter(cita => {
        // Filtro por Fecha
        if (filtroFechaInicio && filtroFechaFin) {
            const fechaCita = new Date(cita.fecha);
            // Comparar timestamps del día local
            const fechaCitaTime = new Date(fechaCita.toDateString()).getTime();
            const inicioTime = new Date(filtroFechaInicio.toDateString()).getTime();
            const finTime = new Date(filtroFechaFin.toDateString()).getTime();

            if (fechaCitaTime < inicioTime || fechaCitaTime > finTime) {
                return false;
            }
        }

        // Filtro por Estado
        if (estadoFiltro !== "Todos") {
            const estadoCita = String(cita.estado).toLowerCase();
            const estadoSelect = estadoFiltro.toLowerCase();

            // Manejo especial si estado viene como número o string diferente
            if (estadoCita == "0" && estadoSelect === "pendiente") {
                // match
            } else if (estadoCita !== estadoSelect) {
                return false;
            }
        }

        // Filtro por Búsqueda (Nombre del Cliente)
        if (busqueda) {
            const nombreCliente = (cita.nombre || "").toLowerCase();
            if (!nombreCliente.includes(busqueda)) {
                return false;
            }
        }

        return true;
    });

    paginaActual = 1;
    totalCitas = citasFiltradas.length;
    renderizarCitas();
}

// Función para formatear fecha
function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// Función para formatear hora
function formatearHora(hora) {
    if (!hora) return "N/A";

    // Si viene como "7:00:00" o "14:30:00"
    const [h, m] = hora.split(":");
    let hour = parseInt(h, 10);
    const minutes = m;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minutes} ${ampm}`;
}

// Función para obtener clase de estado
function obtenerClaseEstado(estado) {
    if (!estado) return "bg-gray-100 text-gray-800";
    const estadoLower = String(estado).toLowerCase();
    const estados = {
        confirmada: "bg-green-100 text-green-800",
        pendiente: "bg-yellow-100 text-yellow-800",
        cancelada: "bg-red-100 text-red-800",
    };
    if (estadoLower == "0") return estados.pendiente;
    return estados[estadoLower] || "bg-gray-100 text-gray-800";
}

// Función para capitalizar primera letra
function capitalizar(texto) {
    if (!texto) return "";
    const textoStr = String(texto);
    return textoStr.charAt(0).toUpperCase() + textoStr.slice(1);
}

// Función para mostrar modal con detalles de la cita
function mostrarDetallesCita(agenda) {
    const fechaFormateada = new Date(agenda.fecha).toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const modalHTML = `
    <div id="modal-detalles" class="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
<div class="w-full max-w-2xl bg-white rounded-xl shadow-lg flex flex-col">
<div class="p-6 border-b border-gray-200 flex justify-between items-center">
<h2 class="text-xl font-bold text-gray-900">Detalles de la Reserva</h2>

</div>
<div class="p-6 flex-1 overflow-y-auto space-y-6">
<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
<div>
<p class="text-sm font-medium text-gray-500">Hora</p>
<p class="text-base font-semibold text-gray-800">${formatearHora(agenda.hora)}</p>
</div>
<div>
<p class="text-sm font-medium text-gray-500">Fecha</p>
<p class="text-base font-semibold text-gray-800">${fechaFormateada}</p>
</div>
<div>
<p class="text-sm font-medium text-gray-500">Cliente</p>
<p class="text-base font-semibold text-gray-800">${agenda.nombre || "N/A"}</p>
</div>
<div>
<p class="text-sm font-medium text-gray-500">Mensaje/Notas</p>
<p class="text-base font-semibold text-gray-800">${agenda.notas || "Sin notas"}</p>
</div>

<div>
<p class="text-sm font-medium text-gray-500 ${obtenerClaseEstado(agenda.estado)}">${capitalizar(agenda.estado)}</p>
</div>
</div>
</div>
<div class="p-6 border-t border-gray-200 flex flex-col sm:flex-row-reverse gap-3">
<!-- Botón Modificar podría ir aquí si se implementa -->
<button id="cerrar-modal" id="cerrar-modal-btn" class="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 text-black border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-sm font-bold leading-normal tracking-[0.015em]">
<span class="material-symbols-outlined text-base">cancel</span>
<span>Cerrar</span>
</button>
</div>
</div>
</div>


  `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Event listeners para cerrar modal
    const btnCerrar = document.getElementById("cerrar-modal");
    if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);

    document.getElementById("modal-detalles").addEventListener("click", (e) => {
        if (e.target.id === "modal-detalles") cerrarModal();
    });
}

function cerrarModal() {
    const modal = document.getElementById("modal-detalles");
    if (modal) modal.remove();
}

// Función para cancelar cita
async function cancelarCita(Agid, Useid, estado) {
    if (String(estado).toLowerCase() === "cancelada") {
        alertaFallo("Esta cita ya está cancelada");
        return;
    }

    const confirmado = await alertaConfirm("¿Seguro que quieres cancelar esta cita?");
    if (!confirmado) return;

    try {
        const res = await fetch(`${ruta}/api/Reservas/cancelar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Agid, Useid }),
            credentials: 'include',
        });

        const respuesta = await res.json();

        if (res.ok) {
            alertaCheck("✅ Cita cancelada con éxito");
            // Recargar o re-renderizar
            setTimeout(() => {
                location.reload();
            }, 700);
        } else {
            alertaFallo("❌ Error al cancelar la cita: " + (respuesta.message || "Intenta de nuevo"));
        }
    } catch (error) {
        console.error("Error al cancelar cita:", error);
        alertaFallo("❌ Error de conexión con el servidor");
    }
}

// Función para renderizar citas de la página actual
function renderizarCitas() {

    const tbody = document.getElementById("tabla-citas-body");

    if (!tbody) {
        console.error("No se encontró el elemento tabla-citas-body");
        return;
    }

    if (citasFiltradas.length === 0) {
        tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-8 text-center text-gray-500">
            <div class="flex flex-col items-center gap-2">
              <span class="material-symbols-outlined text-5xl text-gray-300">event_busy</span>
              <p class="text-lg">No hay reservas encontradas</p>
            </div>
          </td>
        </tr>
      `;
        actualizarControlesPaginacion();
        return;
    }

    // Calcular índices para la página actual
    const inicio = (paginaActual - 1) * citasPorPagina;
    const fin = inicio + citasPorPagina;
    const citasPagina = citasFiltradas.slice(inicio, fin);

    tbody.innerHTML = ""; // Limpiar tabla

    citasPagina.forEach((agenda) => {
        const fila = document.createElement("tr");
        fila.className = "hover:bg-gray-50";

        const isCancelada = String(agenda.estado).toLowerCase() === "cancelada";

        // Mapeo seguro de campos
        const fechaStr = formatearFecha(agenda.fecha);
        const horaStr = formatearHora(agenda.hora);
        const clienteStr = agenda.nombre || "N/A";
        const mensajeStr = agenda.notas || "";
        const estadoStr = capitalizar(agenda.estado);

        fila.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-gray-800">${fechaStr}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-800">${horaStr}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-800">${clienteStr}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-800">${mensajeStr}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerClaseEstado(agenda.estado)}">
            ${estadoStr}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right">
          <button class="btn-ver p-2 rounded-full hover:bg-gray-200 text-gray-500">
            <span class="material-symbols-outlined text-xl">visibility</span>
          </button>
          <button class="btn-cancelar p-2 rounded-full hover:bg-gray-200 text-gray-500 ${isCancelada ? "opacity-50 cursor-not-allowed" : ""}" 
                  ${isCancelada ? "disabled" : ""}>
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </td>
      `;

        tbody.appendChild(fila);

        // Event listener para botón "Ver detalles"
        fila.querySelector(".btn-ver").addEventListener("click", () => {
            mostrarDetallesCita(agenda);
        });

        // Event listener para botón "Cancelar"
        if (!isCancelada) {
            fila.querySelector(".btn-cancelar").addEventListener("click", () => {
                cancelarCita(agenda.agenda_id, agenda.usuario_id, agenda.estado);
            });
        }
    });

    actualizarControlesPaginacion();
}

// Función para actualizar controles de paginación
function actualizarControlesPaginacion() {
    const totalPaginas = Math.ceil(totalCitas / citasPorPagina);
    const inicio = (paginaActual - 1) * citasPorPagina + 1;
    const fin = Math.min(paginaActual * citasPorPagina, totalCitas);

    // Actualizar información de paginación
    const infoPaginacion = document.getElementById("info-paginacion");
    if (infoPaginacion) {
        if (totalCitas === 0) {
            infoPaginacion.textContent = "No hay reservas";
            const loader = document.getElementById("loader");
            if (loader) loader.style.display = "none";
        } else {
            infoPaginacion.textContent = `Mostrando ${inicio}-${fin} de ${totalCitas} reserva${totalCitas !== 1 ? "s" : ""}`;
            const loader = document.getElementById("loader");
            if (loader) loader.style.display = "none";
        }
    }

    // Actualizar botones de navegación
    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");

    if (btnAnterior) {
        btnAnterior.disabled = paginaActual === 1;
    }

    if (btnSiguiente) {
        btnSiguiente.disabled = paginaActual >= totalPaginas;
    }
}

// Función para cambiar de página
function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(totalCitas / citasPorPagina);

    if (direccion === "anterior") {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarCitas();
        }
    } else if (direccion === "siguiente") {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarCitas();
        }
    }
}

// Cargar citas desde el servidor
fetch(`${ruta}/api/Reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid }),
    credentials: 'include',
})
    .then((response) => response.json())
    .then((respuesta) => {
        const data = respuesta.data || [];

        const nombreEstablecimiento = respuesta.NombreEstablecimiento;
        todasLasCitas = data;
        citasFiltradas = todasLasCitas; // Inicialmente todas
        totalCitas = todasLasCitas.length;

        const nombreNegocioEl = document.getElementById("nombreNegocio");
        if (nombreNegocioEl && nombreEstablecimiento) {
            nombreNegocioEl.innerHTML = `HOLA ${nombreEstablecimiento}`;
        }

        // Renderizar primera página
        renderizarCitas();

        // Configurar event listeners para botones de paginación
        const btnAnterior = document.getElementById("btn-anterior");
        const btnSiguiente = document.getElementById("btn-siguiente");

        if (btnAnterior) {
            btnAnterior.addEventListener("click", () => cambiarPagina("anterior"));
        }

        if (btnSiguiente) {
            btnSiguiente.addEventListener("click", () => cambiarPagina("siguiente"));
        }
    })
    .catch((error) => {
        console.error("Error al obtener datos:", error);
    });