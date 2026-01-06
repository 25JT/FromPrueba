import { ruta } from "../utils/ruta.js";
import { alertaCheck, alertaFallo, alertaMal } from "../assets/Alertas/Alertas.js";
import { validarInicioCliente } from "./validarInicio.js";

validarInicioCliente();

// Variables de estado
let paginaActual = 1;
const serviciosPorPagina = 6;
let todosLosServicios = [];

// Elementos del DOM
const contenedor = document.getElementById("contenedor-servicios");
const loader = document.getElementById("loader-servicios");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const infoPaginacion = document.getElementById("info-paginacion");

// Función para convertir a formato 12h AM/PM
function to12HourFormat(timeStr) {
  if (!timeStr) return "";
  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

// Función principal para renderizar servicios
function renderizarServicios() {
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const inicio = (paginaActual - 1) * serviciosPorPagina;
  const fin = inicio + serviciosPorPagina;
  const serviciosPagina = todosLosServicios.slice(inicio, fin);

  if (serviciosPagina.length === 0) {
    contenedor.innerHTML = `<p class="col-span-full text-center text-gray-500">No hay servicios disponibles.</p>`;
    actualizarControles();
    return;
  }

  serviciosPagina.forEach((servicio, index) => {
    const servicioNombre = (servicio.Servicio || "").toLowerCase();
    const textoCompleto = `${servicioNombre}`;


    // URLs de imagenes
    const imgBarbero = "https://lh3.googleusercontent.com/aida-public/AB6AXuCvK3FPK6x-N6cBsbOdJJF8KmLo8qx84gCT9Fp-wetzw4n-gCkFEv8vAVSZbaAjHjxkNGH-PI7CGIl-Q6BkE8X7OCOiLZHz08687nPlu-M2E3U3VT_GE_hwh6mDBleRRO1xnwWmvtZdSNfaSbBw3zzwVyJyAgE4W0zy455fZ-pCayLdjr3g_LBO3-Jobc7pigyosoyvv13svSXZDZ768ob-App6NEL97xPHFuMBR2_wvDNApaomzt4DKMas02KMakHu4ybuGZ-atg";
    const imgSpa = "https://lh3.googleusercontent.com/aida-public/AB6AXuDEyEWN66gTYF2r24xJEpe3oJP14fc6yXVbCxUIs7Z6rVyQwTZK4Gqqz8dZ80dDaFU7h-bgxYehENqIaBWh9gzMkvq4A_5T3AOwD49MCv15ZTfBAjHzbyM4EZRI62yOXo5Zzqtwp0EmastJyXSahPWjDT100_XSi9umXBS5UzwX05vrvk4VQx175c-bGeCJ7yeP7RU5fCEYDsxG3Eiw-C4rLE2zVQAG9vCpx6q5iew_ELzdowbSObHDB9e_D57u_PYHPFYazTn2UQ";
    const imgEstilista = "https://lh3.googleusercontent.com/aida-public/AB6AXuCqz0F6fkT1XYtX4RgB1c2uzJUvdYSpmvsLg71LJVvg7rDfPk1hfBBKq9aHKflspfk52EmhrCWl1baeU6eoS__X8lBpgEnewLsdeEOqMw7yFlsBk2P92TItVEbLgRh0oVii_1SlyPa7x2ZProqBBD-N0gZSf8qSxLpjUpaKAIgmDYazuMGR2WrtVNSgsQEV4gO_-qdPIC7esMiZJnstZL9Q4yY772zPgwfmieGHmWcbfru3snoV7VevlmiE4Pwaiwy-50OtbAD7dg";

    let imagenFondo = imgEstilista; // Default
    let etiqueta = "Servicio";

    if (textoCompleto.includes("barber")) {
      imagenFondo = imgBarbero;
      etiqueta = "Barbería";
    } else if (textoCompleto.includes("spa")) {
      imagenFondo = imgSpa;
      etiqueta = "Spa";
    } else if (textoCompleto.includes("estilista")) {
      imagenFondo = imgEstilista;
      etiqueta = "estilista";
    }



    const tarjeta = document.createElement("div");
    tarjeta.className = "group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn";

    tarjeta.innerHTML = `
        <div class="relative h-48 overflow-hidden">
          <div
            class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style='background-image: url("${imagenFondo}");'
          >
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"
          >
          </div>
          <div
            class="absolute bottom-3 left-3 right-3 flex justify-between items-end"
          >
            <span
              class="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs uppercase italic font-semibold text-white border border-white/30"
            >
              ${etiqueta}
            </span>
          </div>
        </div>
        <div class="p-6 flex flex-col flex-grow">
          <div class="mb-1">
            <p
              class="text-xs font-bold text-primary uppercase tracking-wider mb-1"
            >
              ${servicio.nombre_establecimiento || "Negocio"}
            </p>
            <h3
              class="uppercase italic text-xl font-bold text-gray-900 group-hover:text-primary transition-colors"
            >
              ${servicio.Servicio || "Servicio General"}
            </h3>
          </div>
          <div class="flex items-start gap-2 mt-3 text-sm text-gray-500">
            <span class="material-symbols-outlined text-[18px] mt-0.5 shrink-0"
              >schedule</span
            >
            <p>${servicio.dias_trabajo ? servicio.dias_trabajo.replace(/Domin/g, "Domingo") : "Consultar Horario"}</p>
          </div>
          <div class="flex items-start gap-2 mt-1 text-sm text-gray-500">
             <span class="material-symbols-outlined text-[18px] mt-0.5 shrink-0"
              >schedule</span
            >
             <p>${to12HourFormat(servicio.hora_inicio)} - ${to12HourFormat(servicio.hora_fin)}</p>
          </div>
           <div class="flex items-start gap-2 mt-1 text-sm text-gray-500">
             <span class="material-symbols-outlined text-[18px] mt-0.5 shrink-0"
              >location_on</span
            >
             <p>${servicio.direccion || "Dirección no disponible"}</p>
          </div>
          
          <div
            class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between"
          >
            <div class="flex flex-col">
              <span class="text-xs font-medium text-gray-400">Precio</span>
              <span class="text-2xl font-bold text-gray-900">${servicio.precio || "N/A"}</span>
            </div>
            <button
              id="btn-reservar-${servicio.id}"
              class="text-black border-2 border-blue-500 hover:bg-blue-500 hover:text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Reservar
            </button>
          </div>
        </div>
    `;

    contenedor.appendChild(tarjeta);

    // Event listener para reservar
    const btnReservar = document.getElementById(`btn-reservar-${servicio.id}`);
    if (btnReservar) {
      btnReservar.addEventListener("click", () => {
        window.location.href = `/Agendar/${servicio.id}`;
      });
    }

  });

  actualizarControles();
}

function actualizarControles() {
  const totalPaginas = Math.ceil(todosLosServicios.length / serviciosPorPagina);

  if (infoPaginacion) {
    if (todosLosServicios.length === 0) {
      infoPaginacion.textContent = "0 paginas";
    } else {
      infoPaginacion.textContent = `Pagina ${paginaActual} de ${totalPaginas}`;
    }
  }

  if (btnAnterior) {
    btnAnterior.disabled = paginaActual === 1;
  }
  if (btnSiguiente) {
    btnSiguiente.disabled = paginaActual >= totalPaginas || totalPaginas === 0;
  }
}

// Logic para cambiar pagina
if (btnAnterior) {
  btnAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      renderizarServicios();
      // Scroll al top del contenedor para mejor UX
      contenedor.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

if (btnSiguiente) {
  btnSiguiente.addEventListener("click", () => {
    const totalPaginas = Math.ceil(todosLosServicios.length / serviciosPorPagina);
    if (paginaActual < totalPaginas) {
      paginaActual++;
      renderizarServicios();
      contenedor.scrollIntoView({ behavior: 'smooth' });
    }
  });
}


// Fetch inicial
fetch(`${ruta}/serviciosDisponibles`, { credentials: 'include' })
  .then((response) => response.json())
  .then((data) => {
    if (loader) loader.style.display = "none";

    if (!data.success) {
      console.error("Error en respuesta:", data.message);
      alertaFallo("No se pudieron cargar los servicios");
      return;
    }

    todosLosServicios = data.data;
    renderizarServicios();
  })
  .catch((error) => {
    if (loader) loader.style.display = "none";
    console.error("Error al obtener datos:", error);
    alertaFallo("Error de conexión");
  });
