const tituloTienda = document.getElementById("shop-name");
const direccionTienda = document.getElementById("shop-address");
const descripcionTienda = document.getElementById("shop-desc");
let timer
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
    clearTimeout(timer)
    timer = setTimeout(() => {
        if (direccionTienda.value === "") {
            document.getElementById("location-preview").innerHTML = "Calle de la Innovación 25, Colombia";
        } else {
            document.getElementById("location-preview").innerHTML = direccionTienda.value;

            console.log({ direccionTienda, preview: direccionTienda.value });
        }
    }, 1000);
});

descripcionTienda.addEventListener("input", () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        if (descripcionTienda.value === "") {
            document.getElementById("description-preview").innerHTML = "Optimiza tu tiempo y elimina las perdidas. Concéntrate en lo que más importa y deja que HoraLista se encargue de tu agenda.";
        } else {
            document.getElementById("description-preview").innerHTML = descripcionTienda.value;

            console.log({ descripcionTienda, preview: descripcionTienda.value });
        }
    }, 1000);
});

