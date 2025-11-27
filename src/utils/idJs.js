

const id = document.getElementById("idservicio").dataset.id;
    //  console.log(id);

    document.getElementById("idservicio").textContent =
        "ID Establecimiento: " + id;

    // document.getElementById("id").textContent = "ID Usuario: " + userid;

    import { ruta } from "../utils/ruta.js";
    import gsap from "gsap";
    import {
        alertaCheck4,
        alertaFallo,
        alertaMal,
    } from "../assets/Alertas/Alertas.js";
    const userid = sessionStorage.getItem("Id");

    async function cargarHorasDisponibles() {
    const idServicio = id;
    const fecha = document.getElementById("fecha").value;
    
    if (!idServicio || !fecha) {
        alert("Por favor seleccione un servicio y una fecha");
        return;
    }

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
        } else {
            throw new Error(data.message || "Error al obtener horas disponibles");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarError("No se pudieron cargar las horas disponibles. Intente nuevamente.");
    }
}

function mostrarHorasDisponibles(data) {
    const contenedor = document.getElementById("horas");
    contenedor.innerHTML = "";

    if (!data.disponibles || data.disponibles.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-4 text-gray-500">
                No hay horas disponibles para esta fecha.
                <br>Por favor seleccione otra fecha.
            </div>
        `;
        return;
    }

    // Crear botones para cada hora disponible
    data.disponibles.forEach(hora24 => {
        const [hora] = hora24.split(':');
        const horaNum = parseInt(hora);
        const ampm = horaNum >= 12 ? 'pm' : 'am';
        const hora12 = horaNum % 12 === 0 ? 12 : horaNum % 12;
        const label = `${hora12}:00 ${ampm}`;

        const boton = document.createElement('button');
        boton.className = 'hora bg-blue-100 hover:bg-blue-300 text-blue-800 py-2 px-4 rounded-md transition m-1';
        boton.dataset.id = hora24;
        boton.type = 'button';
        boton.textContent = label;
        
        boton.addEventListener('click', () => {
            document.querySelectorAll('.hora').forEach(b => {
                b.classList.remove('bg-blue-500', 'text-white');
                b.classList.add('bg-blue-100', 'text-blue-800');
            });
            boton.classList.add('bg-blue-500', 'text-white');
            document.getElementById('hora').value = hora24;
        });

        contenedor.appendChild(boton);
    });
}

function mostrarError(mensaje) {
    const contenedor = document.getElementById("horas");
    contenedor.innerHTML = `
        <div class="text-center py-4 text-red-500">
            ${mensaje}
        </div>
    `;
}

// Ejemplo de cómo llamar la función cuando cambia la fecha
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
            document.getElementById("nombre").innerHTML = usuario.nombre;
            document.getElementById("apellido").innerHTML = usuario.apellidos;
            document.getElementById("telefono").innerHTML = usuario.telefono;
            document.getElementById("correo").innerHTML = usuario.correo;
            document.getElementById("dias").innerHTML = Establecimiento.dias_trabajo;
            document.getElementById("negocio").innerHTML = Establecimiento.nombre_establecimiento;
            document.getElementById("telefono_negocio").innerHTML = Establecimiento.telefono_establecimiento;
            document.getElementById("direccion").innerHTML = Establecimiento.direccion;
        })
        .catch((err) => {
            console.error("Error al obtener datos:", err);
        });

    // --- CONTADOR DE CARACTERES MENSAJE ---
    const mensajeInput = document.getElementById("mensaje");
    const contadorMensaje = document.getElementById("contador-mensaje");
    mensajeInput.addEventListener("input", function () {
        const restante = 100 - mensajeInput.value.length;
        contadorMensaje.textContent = restante;
    });
    // --- FIN CONTADOR DE CARACTERES ---

    // --- VALIDACIONES DE FECHA Y HORA ---
    const fechaInput = document.getElementById("fecha");
    const horaInput = document.getElementById("hora");
    const form = document.getElementById("citaForm");
    const mensaje2 = document.getElementById("mensaje");

    // Bloquear fechas pasadas y el mismo día
    document.addEventListener("DOMContentLoaded", () => {
        const today = new Date();
        today.setDate(today.getDate() + 1); // Solo fechas futuras
        const minDate = today.toISOString().split("T")[0];
        fechaInput.setAttribute("min", minDate);
    });

    // Validar disponibilidad antes de enviar
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        const nombre = document.getElementById("nombre").innerHTML;
        const apellido = document.getElementById("apellido").innerHTML;
        const fecha = fechaInput.value;
        const hora = horaInput.value;
        const mensaje = mensaje2.value;
        const correo = document.getElementById("correo").innerHTML;
        const nombre_establecimiento = document.getElementById("negocio").innerHTML;
        const telefono_establecimiento = document.getElementById("telefono_negocio").innerHTML;
        const direccion = document.getElementById("direccion").innerHTML;
        

        if (!fecha || !hora) {
            alertaMal("Selecciona una fecha y hora válidas");
            submitButton.disabled = false;
            return;
        }
        // Consulta a la API para validar disponibilidad
        // Reemplaza la URL por tu endpoint real
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
             console.error("Respuesta inesperada del servidor:", errorText);
            alertaFallo("Error al validar disponibilidad");
            return;
        }

        const data = await response.json();
        if (!data.success) {
            alertaMal(data.message);
            return;
        }
        alertaCheck4("Cita agendada correctamente");
    });

    //volver
    document.getElementById("volver").addEventListener("click", function () {
        history.back();
    });

    //gsap

    // Animación con GSAP
    gsap.from("#citaForm", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
    });

    gsap.from("#citaForm > div, #citaForm button", {
        opacity: 1,
        x: -10,
        duration: 0.5,
        stagger: 0.1,
        ease: "power1.out",
        delay: 0.3,
    });
    gsap.from("#citaForm button", {
        opacity: 1,
        x: 5,
        duration: 0.5,
        stagger: 0.1,
        ease: "power1.out",
        delay: 0.3,
    });