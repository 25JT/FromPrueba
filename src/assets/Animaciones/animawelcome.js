import gsap from "gsap";

import ScrollTrigger from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registrar plugins una vez al inicio
gsap.registerPlugin(ScrollTrigger, SplitText);

export function animarTitulo() {

  const splitText = new SplitText("#titulo", {
    type: "words",
  })

  const tl = gsap.timeline();
  tl.from(splitText.words, {
    duration: 1,
    y: 20,
    stagger: {
      each: 0.1,
    },
    autoAlpha: 0,
    ease: "power3.out",
  })
  tl.to(splitText.words, {
    duration: 1,
    y: -20,
    repeat: -1,
    yoyo: true,
    stagger: {
      each: 0.1,
    },
    ease: "power3.out",
  })
}

export function animarParrafo() {
  const parrafo = document.querySelector("#parrafo");
  if (!parrafo) return;

  parrafo.style.willChange = "transform, opacity, filter";

  const splitText2 = new SplitText("#parrafo", {
    type: "words",
  })

  gsap.from(splitText2.words, {
    delay: 1.5,
    duration: 1,
    filter: "blur(10px)",
    y: 20,
    stagger: {
      each: 0.1,
    },
    autoAlpha: 0,
    ease: "power3.out",
    onComplete: () => {
      parrafo.style.willChange = "auto";
    }
  })
}

export function animarFormulario() {
  const formulario = document.querySelector("#animacionFormulario");
  if (!formulario) return;

  formulario.style.willChange = "transform, opacity";

  const tl = gsap.timeline({
    onComplete: () => {
      formulario.style.willChange = "auto";
    }
  });

  tl.from("#animacionFormulario", {
    delay: 1.2,
    duration: 2,
    y: -20,
    stagger: {
      each: 0.1,
    },
    autoAlpha: 0,
    ease: "power3.out",
  })
}

// ===== ANIMACIÓN SECCIÓN 2 =====
// Usa Intersection Observer en lugar de ScrollTrigger porque el scroll personalizado
// con scrollIntoView no activa ScrollTrigger correctamente

export function animarTitulo2() {
  const elemento = document.querySelector("#titulo2");
  if (!elemento) return;

  let animacionEjecutada = false; // Para ejecutar la animación solo una vez

  // Crear el observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Si el elemento es visible y la animación no se ha ejecutado
      if (entry.isIntersecting && !animacionEjecutada) {
        animacionEjecutada = true;

        const splitText = new SplitText("#titulo2", {
          type: "chars",
        });

        const tl = gsap.timeline();
        tl.from(splitText.chars, {
          duration: 1,
          y: 20,
          scale: 0.5,
          stagger: {
            each: 0.1,
          },
          autoAlpha: 0,
          ease: "power3.out",
        });
        tl.to(splitText.chars, {
          duration: 1,
          y: 20,
          scale: 1,
          repeat: -1,
          yoyo: true,
          stagger: {
            each: 0.1,
          },
          ease: "power3.out",
        });

        // Opcional: dejar de observar después de animar
        // observer.unobserve(elemento);
      }
    });
  }, {
    threshold: 0.3, // Se activa cuando el 30% del elemento es visible
    rootMargin: "0px" // Margen adicional (opcional)
  });

  // Comenzar a observar el elemento
  observer.observe(elemento);
}
