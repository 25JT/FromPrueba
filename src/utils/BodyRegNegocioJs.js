import { alertaCheck5, alertaFallo, alertaMal } from "../assets/Alertas/Alertas.js";
import { animar } from "../assets/Animaciones/animaRegSecion.js";
import { ruta } from "../utils/ruta.js";
import { validarInicioProfesional } from "./validarInicio.js";
validarInicioProfesional();
animar();
//formato cop 
const precioInput = document.getElementById('precio');

//validar hora-Inicio en 6.00 en rango 
document.getElementById('hora_inicio').addEventListener('change', function () {
    const horaInput = this.value;
    const minutos = horaInput.split(':')[1];
    const errorElement = document.getElementById('hora-error');

    if (minutos !== '00') {
        errorElement.classList.remove('hidden');
        this.setCustomValidity('La hora debe ser en punto (minutos :00)');
    } else {
        errorElement.classList.add('hidden');
        this.setCustomValidity('');
    }
});

//validar hora-cerrar en 6.00 en rango 

document.getElementById('hora_fin').addEventListener('change', function () {
    validarHoraEnPunto(this, 'hora-fin-error');

    // Opcional: Validar que hora fin sea mayor que hora inicio
    const horaInicio = document.getElementById('hora_inicio').value;
    const horaFin = this.value;

    if (horaInicio && horaFin && horaFin <= horaInicio) {
        alertaMal('La hora final debe ser posterior a la hora de inicio');
        this.value = '';
    }
});

// Función reutilizable para validar horas en punto
function validarHoraEnPunto(inputElement, errorElementId) {
    const horaInput = inputElement.value;
    const minutos = horaInput.split(':')[1];
    const errorElement = document.getElementById(errorElementId);

    if (minutos !== '00') {
        errorElement.classList.remove('hidden');
        inputElement.setCustomValidity('La hora debe ser en punto (minutos :00)');
    } else {
        errorElement.classList.add('hidden');
        inputElement.setCustomValidity('');
    }
}

precioInput.addEventListener('input', (e) => {
    // Remueve todo lo que no sea dígito
    let value = e.target.value.replace(/\D/g, '');

    // Limita el número máximo a 100000
    if (Number(value) > 100000) {
        value = '100000';
    }

    // Aplica formato
    const formatter = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    });

    if (value) {
        const formatted = formatter.format(Number(value));
        e.target.value = formatted;

        // Si el formateado supera 8 caracteres, recorta
        if (formatted.length > 9) {
            // corta desde el final para conservar los dígitos más significativos
            e.target.value = formatted.slice(0, 9);
        }
    } else {
        e.target.value = '';
    }
});
//  import {ruta} from "../assets/Animaciones/animaRegSecion.js";
//envio de datos de negocio
document
    .getElementById("registroNegocio")
    ?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const userid = sessionStorage.getItem("Id");
        const role = sessionStorage.getItem("Role");
        // Capturamos todos los días marcados como array
        const diasSeleccionados = formData.getAll("dias_trabajo");

        // Obtenemos el resto de campos
        const data = {
            nombre_establecimiento: formData.get("nombre_establecimiento"),
            telefono_establecimiento: formData.get("telefono_establecimiento",),
            direccion: formData.get("direccion"),
            hora_inicio: formData.get("hora_inicio"),
            hora_fin: formData.get("hora_fin"),
            dias_trabajo: diasSeleccionados, // ya es un array
            tipo_servicio: formData.get("tipo_servicio"),
            precio: formData.get("precio"),
            duracion: formData.get("intervaloCitas"),

        };

        console.log(data);

        fetch(`${ruta}/registroNegocio`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ data, userid }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {

                    alertaCheck5("Registro exitoso");

                } else {
                    alertaFallo(data.message);
                }
            })
            .catch((err) => {
                //  console.error(err);
                alertaFallo("Error al enviar el formulario");
            });
    });