import { ruta } from "../utils/ruta.js";

const modal = document.getElementById("modal-notificacion");
const closeBtn = document.getElementById("close-modal-btn");
const omitirBtn = document.getElementById("btn-omitir-valoracion");
const enviarBtn = document.getElementById("btn-enviar-valoracion");
const ratingBtns = document.querySelectorAll(".rating-btn");
const starIcons = document.querySelectorAll(".star-icon");

let selectedRating = 0;

function closeModal() {
    if (modal) {
        modal.classList.add("hidden");
        resetRating();
    }
}

function resetRating() {
    selectedRating = 0;
    updateStars(0);
    if (enviarBtn) {
        enviarBtn.disabled = true;
    }
    ratingBtns.forEach((btn) =>
        btn.classList.remove("active-rating", "hover-active"),
    );
}

function updateStars(rating, isHover = false) {
    starIcons.forEach((star, index) => {
        if (index < rating) {
            star.classList.add("filled");
        } else {
            star.classList.remove("filled");
        }
    });

    if (!isHover) {
        ratingBtns.forEach((btn, index) => {
            if (index + 1 === rating) {
                btn.classList.add("active-rating");
            } else {
                btn.classList.remove("active-rating");
            }
        });
    }
}

ratingBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
        const rating = parseInt(btn.getAttribute("data-rating") || "0");
        updateStars(rating, true);
        btn.classList.add("hover-active");
    });

    btn.addEventListener("mouseleave", () => {
        updateStars(selectedRating);
        btn.classList.remove("hover-active");
    });

    btn.addEventListener("click", () => {
        const rating = parseInt(btn.getAttribute("data-rating") || "0");
        selectedRating = rating;
        console.log("Calificación seleccionada: " + selectedRating);
        updateStars(selectedRating);
        if (enviarBtn) {
            enviarBtn.disabled = false;
        }
    });
});

if (closeBtn) closeBtn.addEventListener("click", closeModal);
if (omitirBtn) omitirBtn.addEventListener("click", closeModal);

if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

if (enviarBtn) {
    enviarBtn.addEventListener("click", () => {
        console.log("Enviando calificación definitiva: " + selectedRating);
        //enviar calificacion a la api
        fetch(`${ruta}/api/Calificar/notificacion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: selectedRating, id: sessionStorage.getItem("calificacion_mostrada") }),
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });

        closeModal();
    });
}