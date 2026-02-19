import { ruta } from "../utils/ruta.js"
import { alertaMal } from "../assets/Alertas/Alertas";

const tituloTienda = document.getElementById("shop-name");
const direccionTienda = document.getElementById("shop-address");
const descripcionTienda = document.getElementById("shop-desc");
const logoTienda = document.getElementById("logo");
const bannerTienda = document.getElementById("banner");


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
                if (data.rows[0].logo === null) {
                    document.getElementById("logo-preview").src = "https://lh3.googleusercontent.com/aida-public/AB6AXuAkUfUP1gFVo3HZO5Frp1_KHZCoUTa0GZqumL379y7Fl-ZQLq3_7ZMPoGiwAZaJHcNTxII_oEbBMscWjUr-A_J81RixbTjh5x6XHmhUht4JDo7N9jUyTb0clRF_2YmIYhEDd9i_lQxFREN8UhJ4A1125mKNQ3mLZRUoQbCih6KPMgQy8PhU6slk3-11Aap6VGhYYnmOl4WoHg4fGX5snW8eGU8GMWvL0BOUeOGGwDwZzWxEfmYP8yWZKsVo5L10EcKW3xnU5iltzQ";
                } else {
                    document.getElementById("logo-preview").src = data.rows[0].logo;
                }
                if (data.rows[0].banner === null) {
                    document.getElementById("banner-preview").src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBP-IMlDIqaNWrsjUTT4z4uoMdE5j4mSuNVCrwrmBGp4iuilA40aDI97VJb2XwPk0IsZst4sBxWFUjQolVaudL1hdsnSBEl0yD4j0jo_ncrOeA0ZqPtI8uFu0PIV4iIbgwhq45pprUMBAYIAg7vJ9bb1Oy1zQ9cL5HNu9xSPvMVOOCnHKg7oHGV8CxWBBTGsdPhq-s8-RE6ZayXx674YgXAx9B8kH7rhwAN84ymtVrsmZBQZUO2IpOgJc8-4EcJp3anG4_cg6RJTw";
                } else {
                    document.getElementById("banner-preview").src = data.rows[0].banner;
                }

                document.getElementById("shop-name").value = data.rows[0].nombre_establecimiento;
                document.getElementById("shop-address").value = data.rows[0].direccion;
                document.getElementById("shop-desc").value = data.rows[0].descripcion;
                document.getElementById("shop-name-preview").innerHTML = data.rows[0].nombre_establecimiento;
                document.getElementById("location-preview").innerHTML = data.rows[0].direccion;
                document.getElementById("description-preview").innerHTML = data.rows[0].descripcion;



            }
        })

        .catch(error => console.error("Error al cargar la pagina", error));
}

//actualizacion en tiempo real 
let timer, timer1, timer2, timer3, timer4
//titulo tienda
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
//direccion de la tienda
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

//descripcion de la tienda
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

//logoTienda Img
logoTienda.addEventListener("change", () => {
    clearTimeout(timer3)
        ;

    if (!logoTienda.files[0]) {
        document.getElementById("logo-preview").src = "https://lh3.googleusercontent.com/aida-public/AB6AXuAkUfUP1gFVo3HZO5Frp1_KHZCoUTa0GZqumL379y7Fl-ZQLq3_7ZMPoGiwAZaJHcNTxII_oEbBMscWjUr-A_J81RixbTjh5x6XHmhUht4JDo7N9jUyTb0clRF_2YmIYhEDd9i_lQxFREN8UhJ4A1125mKNQ3mLZRUoQbCih6KPMgQy8PhU6slk3-11Aap6VGhYYnmOl4WoHg4fGX5snW8eGU8GMWvL0BOUeOGGwDwZzWxEfmYP8yWZKsVo5L10EcKW3xnU5iltzQ";
        return;
    }

    document.getElementById("logo-preview").src = URL.createObjectURL(logoTienda.files[0]);

    console.log({ logoTienda, preview: URL.createObjectURL(logoTienda.files[0]) });


});
//Banner de la tienda Img

bannerTienda.addEventListener("change", () => {
    clearTimeout(timer4)

    const file = bannerTienda.files[0];

    if (!file) {
        document.getElementById("banner-preview").src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBP-IMlDIqaNWrsjUTT4z4uoMdE5j4mSuNVCrwrmBGp4iuilA40aDI97VJb2XwPk0IsZst4sBxWFUjQolVaudL1hdsnSBEl0yD4j0jo_ncrOeA0ZqPtI8uFu0PIV4iIbgwhq45pprUMBAYIAg7vJ9bb1Oy1zQ9cL5HNu9xSPvMVOOCnHKg7oHGV8CxWBBTGsdPhq-s8-RE6ZayXx674YgXAx9B8kH7rhwAN84ymtVrsmZBQZUO2IpOgJc8-4EcJp3anG4_cg6RJTw";
        return;
    }

    document.getElementById("banner-preview").src = URL.createObjectURL(file);

    console.log({ file, preview: URL.createObjectURL(file) });

});

//Guardar cambio 

document.getElementById("btn-guardar-cambios").addEventListener("click", () => {

    if (tituloTienda.value === "" || direccionTienda.value === "" || descripcionTienda.value === "") {
        alertaMal("Todos los campos son obligatorios");
        return;
    }
    const logo = logoTienda.files[0] ? URL.createObjectURL(logoTienda.files[0]) : null;
    const banner = bannerTienda.files[0] ? URL.createObjectURL(bannerTienda.files[0]) : null;
    // Preparamos el FormData
    const formData = new FormData();
    formData.append("userid", sessionStorage.getItem("Id"));
    formData.append("tituloTienda", tituloTienda.value);
    formData.append("direccionTienda", direccionTienda.value);
    formData.append("descripcionTienda", descripcionTienda.value);

    // Añadimos los archivos reales (logoTienda.files[0]), no el blob URL
    if (logoTienda.files[0]) {
        formData.append("logo", logoTienda.files[0]);
    }
    if (bannerTienda.files[0]) {
        formData.append("banner", bannerTienda.files[0]);
    }

    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.classList.remove("hidden");
    loadingOverlay.classList.add("flex");

    fetch(`${ruta}/api/tienda/identidad/guardar`, {
        method: "POST",
        credentials: "include",
        body: formData
    })
        .then(response => {
            if (response.status === 200 || response.status === 500) {
                return response.json();
            }
            throw new Error("Respuesta inesperada");
        })
        .then(data => {
            if (data.success || data.status === "ok") {
                window.location.reload();
            } else {
                loadingOverlay.classList.add("hidden");
                loadingOverlay.classList.remove("flex");
                alertaMal(data.message || "Error al guardar");
            }
        })
        .catch(error => {
            console.error(error);
            loadingOverlay.classList.add("hidden");
            loadingOverlay.classList.remove("flex");
            window.location.reload();
        });

})