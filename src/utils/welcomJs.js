import { ruta } from "../utils/ruta.js";
	import { animar } from "../assets/Animaciones/animawelcome.js";
	import {
		alertaCheck2,
		alertaFallo,
	} from "../assets/Alertas/Alertas.js";
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
	//Desplazamiento al formualrio

	// Scroll suave al formulario de registro
	document.addEventListener("DOMContentLoaded", function () {
		const btnReg = document.getElementById("btnReg");
		const registro = document.getElementById("registro1");
		if (btnReg && registro) {
			btnReg.addEventListener("click", function (e) {
				e.preventDefault();
				registro.scrollIntoView({ behavior: "smooth", block: "start" });
			});
		}
	});

	animar();

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