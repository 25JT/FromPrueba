import { ruta } from "./ruta";

window.onload = () => {
    fetch(`${ruta}/vincularWhatsApp`, {
        method: "POST",
        credentials: 'include',

    })
}