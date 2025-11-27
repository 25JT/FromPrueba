import { ruta } from "../utils/ruta.js";
import gsap from "gsap";
import { alertaConfirm, alertaCheck, alertaFallo } from "../assets/Alertas/Alertas.js"

const userid = sessionStorage.getItem("Id");

fetch(`${ruta}/api/Reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid }),
}) 
    .then((res) => res.json())
    .then((respuesta) => {
        const data = respuesta.data || [];
        const tablaBody = document.getElementById("tabla-body");
        const contenedorTarjetas = document.getElementById(
            "contenedor-tarjetas",
        );

        tablaBody.innerHTML = "";
        contenedorTarjetas.innerHTML = "";

        // console.log(data);


        if (data.length === 0) {
            // Mensaje si no hay citas
            contenedorTarjetas.innerHTML = `<p class="text-center text-gray-500">No hay citas registradas</p>`;
            tablaBody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500">No hay citas registradas</td></tr>`;
            return;
        }

        data.forEach((cita) => {
            let icono;
            const Agid = cita.agenda_id;
            const Useid = cita.usuario_id;


            if (cita.estado === "pendiente" || cita.estado === 0) {
                icono = `<span class="text-yellow-500">PENDIENTE ⏳</span>`; // Amarillo para pendiente
            } else if (cita.estado === "confirmada") {
                icono = `<span class="text-green-500">CONFIRMADA ✅</span>`; // Verde para confirmado
            } else if (cita.estado === "cancelada") {
                icono = `<span class="text-red-500">CANCELADA ❌</span>`; // Rojo para cancelada
            } else {
                icono = `<span class="text-gray-400">DESCONOCIDO ❔</span>`; // Gris para estados desconocidos
            }

            const fechaFormateada = new Date(cita.fecha).toLocaleDateString(
                "es-ES",
            );

            // Formatear hora a 12h AM/PM y sin segundos
            let horaFormateada = cita.hora;
            if (horaFormateada) {
                // Si viene como "7:00:00" o "14:30:00"
                const [h, m] = horaFormateada.split(":");
                let hour = parseInt(h, 10);
                const minutes = m;
                const ampm = hour >= 12 ? "PM" : "AM";
                hour = hour % 12;
                if (hour === 0) hour = 12;
                horaFormateada = `${hour}:${minutes} ${ampm}`;
            }

            // Fila en tabla escritorio
            tablaBody.innerHTML += `
                <tr class="fila">
                    <td class="border border-gray-300 px-4 py-2">${horaFormateada}</td>
                    <td class="border border-gray-300 px-4 py-2">${fechaFormateada}</td>
                    <td class="border border-gray-300 px-4 py-2">${cita.nombre}</td>
                    <td class="border border-gray-300 px-4 py-2">${cita.notas}</td>
                    <td class="border border-gray-300 px-4 py-2">${icono}</td>
                    <td class="border border-gray-300 px-2 py-2"><button  class="bg-red-500 text-white px-1 py-1 rounded" onclick="cancelarCita('${Agid}', '${Useid}')">Cancelar</button></td>
                </tr>
            `;

            // Tarjeta en vista móvil
            contenedorTarjetas.innerHTML += `
                <div class="tarjeta bg-white border border-gray-600 rounded-lg p-4 shadow text-center">
                    <p><span class="font-semibold text-[#ff5a5f]">HORA:</span> ${cita.hora}</p>
                    <p><span class="font-semibold text-[#ff5a5f]">FECHA:</span> ${fechaFormateada}</p>
                    <p><span class="font-semibold text-[#ff5a5f]">CLIENTE:</span> ${cita.nombre}</p>
                    <p><span class="font-semibold text-[#ff5a5f]">MENSAJE:</span> ${cita.notas}</p>
                    <p><span class="font-semibold text-[#ff5a5f]">CONFIRMACIÓN:</span> ${icono}</p>
                    <div class="mt-2">
                        <button class="bg-red-500 text-white px-1 py-1 rounded" onclick="cancelarCita('${Agid}', '${Useid}')">Cancelar</button> 
                    </div>
                </div>
            `;

            async function cancelarCita(Agid, Useid) {

                const confirmado = await alertaConfirm("¿Seguro que quieres cancelar esta cita?");
                console.log("confirmado:", confirmado);

                if (!confirmado) {
                    //    console.log("Cancelado por el usuario");
                    return;
                }
                try {
                    const res = await fetch(
                        `${ruta}/api/Reservas/cancelar`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ Agid, Useid }),
                        },
                    );

                    const respuesta = await res.json();

                    if (res.ok) {
                        alertaCheck("✅ Cita cancelada con éxito");
                        // Recargar la página para ver el cambio
                        setTimeout(() => {
                            location.reload();
                        }, 700);
                    } else {
                        alertaFallo(
                            "❌ Error al cancelar la cita: " +
                            (respuesta.message || "Intenta de nuevo"),
                        );
                    }
                } catch (error) {
                    console.error("Error en cancelarCita:", error);
                    alert("❌ Error de conexión con el servidor");
                }
            }
            window.cancelarCita = cancelarCita;
        });


        // Animación GSAP para filas de tabla
        gsap.from(".fila", {
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
        });
        // Animación GSAP para tarjetas móviles
        gsap.from(".tarjeta", {
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
        });
    })
    .catch((error) => {
        console.error(error);
    });