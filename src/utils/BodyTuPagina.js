import { ruta } from "../utils/ruta.js"
import { alertaMal } from "../assets/Alertas/Alertas";

const tituloTienda = document.getElementById("shop-name");
const direccionTienda = document.getElementById("shop-address");
const descripcionTienda = document.getElementById("shop-desc");
//cargar la pagina si la persona tiene negocio como veria la pespectiva si no cargara los default
window.onload = () => {
    fetch(`${ruta}/api/tienda/identidad`, {
        method: "GET",
        credentials: "include"

    })
        //si hay data sera enviada al las id
        .then(response => response.json())
        .then(data => {
            if (data.rows[0] === null) {
                tituloTienda.value = "";
                direccionTienda.value = "";
                descripcionTienda.value = "";
            } else {
                tituloTienda.value = data.rows[0].nombre_establecimiento;
                direccionTienda.value = data.rows[0].direccion;
                descripcionTienda.value = data.rows[0].descripcion;
                document.getElementById("shop-name").value = data.rows[0].nombre_establecimiento;
                document.getElementById("shop-address").value = data.rows[0].direccion;
                document.getElementById("shop-desc").value = data.rows[0].descripcion;

                document.getElementById("shop-name-preview").innerHTML = data.rows[0].nombre_establecimiento;
                document.getElementById("location-preview").innerHTML = data.rows[0].direccion;
                document.getElementById("description-preview").innerHTML = data.rows[0].descripcion;

            }
        })

        .catch(error => console.error(error));
}

//actualizacion en tiempo real 
let timer, timer1, timer2
tituloTienda.addEventListener("input", () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        if (tituloTienda.value === "") {
            document.getElementById("shop-name-preview").innerHTML = "Hora Lista";
        } else {
            document.getElementById("shop-name-preview").innerHTML = tituloTienda.value;

            console.log({ tituloTienda, preview: tituloTienda.value });
        }
    }, 1000);
});

direccionTienda.addEventListener("input", () => {
    clearTimeout(timer1)
    timer1 = setTimeout(() => {
        if (direccionTienda.value === "") {
            document.getElementById("location-preview").innerHTML = "Calle de la Innovación 25, Colombia";
        } else {
            document.getElementById("location-preview").innerHTML = direccionTienda.value;

            console.log({ direccionTienda, preview: direccionTienda.value });
        }
    }, 1000);
});

descripcionTienda.addEventListener("input", () => {
    clearTimeout(timer2)
    timer2 = setTimeout(() => {
        if (descripcionTienda.value === "") {
            document.getElementById("description-preview").innerHTML = "Optimiza tu tiempo y elimina las perdidas. Concéntrate en lo que más importa y deja que HoraLista se encargue de tu agenda.";
        } else {
            document.getElementById("description-preview").innerHTML = descripcionTienda.value;

            console.log({ descripcionTienda, preview: descripcionTienda.value });
        }
    }, 1000);
});


//Guardar cambio 

document.getElementById("btn-guardar-cambios").addEventListener("click", () => {

    if (tituloTienda.value === "" || direccionTienda.value === "" || descripcionTienda.value === "") {
        alertaMal("Todos los campos son obligatorios");
        return;
    }

    console.log({ idfront: sessionStorage.getItem("Id"), tituloTienda: tituloTienda.value, direccionTienda: direccionTienda.value, descripcionTienda: descripcionTienda.value });
    fetch(`${ruta}/api/tienda/identidad`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idfront: sessionStorage.getItem("Id"),
            nombre: tituloTienda.value,
            direccion: direccionTienda.value,
            descripcion: descripcionTienda.value
        })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
});
