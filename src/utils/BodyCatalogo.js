import { ruta } from "./ruta.js";
import { alertaFallo } from "../assets/Alertas/Alertas.js";



window.onload = () => {

    const urlParams = window.location.pathname.split('/');
    const idurl = urlParams[urlParams.length - 1];



    if (!idurl) {
        alertaFallo("No se pudo obtener el id del servicio");
        return;
    }

    const loader = document.getElementById("loader-catalogo");
    if (loader) loader.classList.remove("hidden");

    fetch(`${ruta}/catalogo/vista/usuario/${idurl}`, { credentials: 'include' })
        .then((response) => response.json())
        .then((data) => {
            if (loader) loader.classList.add("hidden");

            if (!data.success) {
                console.error("Error en respuesta:", data.message);
                alertaFallo("No se pudieron cargar los servicios");
                return;
            }

            if (data.data.length === 0) {
                alertaFallo("No se encontraron servicios");
                return;
            }

            renderizarServicios(data);
        })
        .catch((error) => {
            if (loader) loader.classList.add("hidden");
            console.error("Error al obtener datos:", error);
        });

}
function renderizarServicios(data) {
    const container = document.querySelector(".card-grid");
    container.innerHTML = "";

    data.data.forEach((servicio) => {

        const card = document.createElement("div");
        card.className = "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group";
        card.innerHTML = `
        <!-- Carrusel -->
        <div class="relative h-48 overflow-hidden">
          <div class="carousel-images flex transition-transform duration-500">
            <img
              src="${servicio.foto1}"
              class="w-full h-48 object-cover flex-shrink-0"
            />
            <img
              src="${servicio.foto2}"
              class="w-full h-48 object-cover flex-shrink-0"
            />
            <img
              src="${servicio.foto3}"
              class="w-full h-48 object-cover flex-shrink-0"
            />
          </div>

          <!-- Botones -->
          <button
            class="prev absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 px-2 rounded"
            >‹</button
          >
          <button
            class="next absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 px-2 rounded"
            >›</button
          >
        </div>

        <!-- Contenido -->
        <div class="p-6">
          <h3
            class="text-xl font-bold mb-2 group-hover:text-primary transition-colors"
          >
            ${servicio.nombre_servicio}
          </h3>

          <p class="text-slate-500 text-sm mb-6 line-clamp-2">
            ${servicio.descripcion}
          </p>

          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-2xl font-black text-slate-900"> $ ${servicio.precio}</span>
              <div class="flex items-center text-xs text-slate-400 font-medium">
              <span class="material-symbols-outlined text-sm mr-1">schedule</span>
                ${servicio.duracion} min
              </div>
            </div>

            <button
              class="btn-reservar bg-primary hover:bg-primary/90 text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Reservar
            </button>
          </div>
        </div>
      `;
        container.appendChild(card);

        // Flechas para cambio de imagenes (solo para esta card)
        const carouselImages = card.querySelector(".carousel-images");
        const nextBtn = card.querySelector(".next");
        const prevBtn = card.querySelector(".prev");

        if (carouselImages && nextBtn && prevBtn) {
            let index = 0;
            const slides = carouselImages.children;

            nextBtn.onclick = (e) => {
                e.stopPropagation();
                index = (index + 1) % slides.length;
                carouselImages.style.transform = `translateX(-${index * 100}%)`;
            };

            prevBtn.onclick = (e) => {
                e.stopPropagation();
                index = (index - 1 + slides.length) % slides.length;
                carouselImages.style.transform = `translateX(-${index * 100}%)`;
            };
        }

        // Event listener para reservar (buscando en la card actual)
        const btnReservar = card.querySelector(".btn-reservar");
        if (btnReservar) {
            btnReservar.addEventListener("click", () => {
                sessionStorage.removeItem("editCitaId");
                sessionStorage.setItem("id_pservicio", servicio.id_pservicio);
                sessionStorage.setItem("id", servicio.id);
                sessionStorage.setItem("nombre_servicio", servicio.nombre_servicio);
                window.location.href = `/Agendar/${servicio.id_pservicio}`;
            });
        }
    });

}
