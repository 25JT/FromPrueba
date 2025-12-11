import { ruta } from "../utils/ruta.js";
//gsap aniamciones por el moemtno
import { alertaCheck, alertaFallo, alertaMal } from "../assets/Alertas/Alertas.js";
import { validarInicioCliente } from "./validarInicio.js";
validarInicioCliente();

// mostrar servicios disponibles
fetch(`${ruta}/serviciosDisponibles`)
  .then((response) => response.json())
  .then((data) => {
    if (!data.success) {
      console.error("Error en respuesta:", data.message);
      return;
    }

    const contenedor = document.getElementById("contenedor-servicios");

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

    data.data.forEach((servicio, index) => {
      const tarjeta = document.createElement("div");
      tarjeta.className =
        "card-servicio bg-white shadow-xl rounded-2xl p-6 text-center w-full md:w-[30%] animate";

      tarjeta.dataset.index = index;


      tarjeta.innerHTML = `
  <h2 class="text-xl font-semibold text-gray-700 mb-2">Negocio: <span class="text-[#ff5a5f]">${servicio.nombre_establecimiento || "N/A"}</span></h2>
  <div class="border-t border-gray-300 my-4"></div>
  <p><strong>Servicio:</strong> <span class="text-gray-600">${servicio.Servicio || "N/A"}</span></p>
  <p><strong>Teléfono:</strong> <span class="text-gray-600">${servicio.telefono_establecimiento || "N/A"}</span></p>
  <p><strong>Dirección:</strong> <span class="text-gray-600">${servicio.direccion || "N/A"}</span></p>
  <p><strong>Precio:</strong> <span class="text-gray-600">${servicio.precio || "N/A"}</span></p>
  <p ><strong>Atención:</strong> <span class="text-gray-600">${servicio.dias_trabajo.replace(/Domin/g, "Domingo") || "N/A"}</span></p>
  <p><strong>Horario:</strong> <span class="text-gray-600">${to12HourFormat(servicio.hora_inicio) || "N/A"} - ${to12HourFormat(servicio.hora_fin) || "N/A"}</span></p>
  <div class="border-t border-gray-300 my-4"></div>
  <button id="btn-reservar-${servicio.id}" class="bg-black hover:bg-[#e04e52] text-white font-semibold py-2 px-4 rounded-xl w-full transition-all">
    Reservar
  </button>
`;



      contenedor.appendChild(tarjeta);

      // Acción del botón "Reservar"
      document
        .getElementById(`btn-reservar-${servicio.id}`)
        .addEventListener("click", () => {
          // Aquí va la lógica para agendar, por ejemplo:
          window.location.href = `/Agendar/${servicio.id}`;
        });
    });
  })
  .catch((error) => {
    console.error("Error al obtener datos:", error);
    alertaFallo("Error al obtener datos");
  });

