import { ruta } from "../utils/ruta.js";
import { animarTitulo, animarParrafo, animarFormulario, animarTitulo2 } from "../assets/Animaciones/animawelcome.js";
import { alertaCheck2, alertaFallo, } from "../assets/Alertas/Alertas.js";

// ============================================
// SISTEMA DE CARGA PROGRESIVA Y PRIORIZADA
// ============================================
// Sección 0: Carga inmediata (máxima prioridad)
// Secciones 1+: Carga diferida y escalonada (menor prioridad)

function cargarAnimacionesProgresivamente() {
	// PRIORIDAD ALTA: Cargar sección 0 inmediatamente
	animarTitulo();

	animarParrafo();
	animarFormulario();

	// PRIORIDAD BAJA: Cargar otras secciones de forma escalonada
	// Usamos requestIdleCallback para no bloquear el hilo principal
	const cargarSeccionesSecundarias = () => {


		animarTitulo2()
		// Aquí puedes agregar animaciones de otras secciones cuando las tengas
		// Por ejemplo:
		// - Sección 1: cargar después de 100ms
		// - Sección 2: cargar después de 200ms
		// - Sección 3: cargar después de 300ms
		// etc.

		// Ejemplo de carga escalonada:
		// setTimeout(() => animarSeccion1(), 100);
		// setTimeout(() => animarSeccion2(), 200);
		// setTimeout(() => animarSeccion3(), 300);
	};

	// Usar requestIdleCallback si está disponible, sino setTimeout
	if ('requestIdleCallback' in window) {
		requestIdleCallback(cargarSeccionesSecundarias, { timeout: 2000 });
	} else {
		setTimeout(cargarSeccionesSecundarias, 100);
	}
}

// Iniciar carga progresiva
cargarAnimacionesProgresivamente();

const formData = document.getElementById("registro");
let formSubmitted = false; // Bandera para controlar envíos

if (formData && !formData.dataset.listenerAdded) {
	formData.addEventListener("submit", (e) => {
		e.preventDefault();

		if (formSubmitted) return; // Evitar múltiples envíos
		formSubmitted = true;

		// Deshabilitar el botón para evitar clicks múltiples
		const submitButton = e.target.querySelector('[type="submit"]');
		submitButton.disabled = true;

		fetch(`${ruta}/registro`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(
				Object.fromEntries(new FormData(e.target)),
			),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					const id = data.id;
					const correo = data.email;

					TokenRegistro(correo, id);
				} else {
					alertaFallo(data.message);
				}
			})
			.catch((err) => {
				console.error(err);
				alertaFallo("Error al enviar el formulario");
			})
			.finally(() => {
				formSubmitted = false;
				if (submitButton) submitButton.disabled = false;
			});
	});

	// Marcar el formulario como ya procesado
	formData.dataset.listenerAdded = "true";
}

//ENVIO DE TOKENS

function TokenRegistro(correo, id) {
	// 0	console.log(id);
	fetch(`${ruta}/TokenRegistro`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ correo, id }),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				alertaCheck2("Correo enviado correctamente");
			} else {
				alertaCheck2("Registro correcto " + data.message);
			}
		})
		.catch((err) => {
			console.error(err);
			alertaFallo("Error al enviar el formulario");
		});
}

let data = null;
let error = null;

try {
	const res = await fetch(`${ruta}/`);
	if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
	data = await res.json();
} catch (err) {
	console.error("❌ Error al hacer fetch:", err); // <-- esto ayuda
	error = err.message;
}