import { ruta } from "./ruta";
import { alertaCheck, alertaFallo } from "../assets/Alertas/Alertas.js";

window.onload = () => {
    fetch(`${ruta}/vincularWhatsApp`, {
        method: "POST",
        credentials: 'include',

    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alertaCheck("WhatsApp vinculado exitosamente");
            } else {
                alertaFallo(data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alertaFallo("Error al vincular WhatsApp");
        });
}

