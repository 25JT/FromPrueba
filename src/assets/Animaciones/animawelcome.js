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
          y: 10,
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
  });
  // Comenzar a observar el elemento
  observer.observe(elemento);
}

export function animarParrafo2() {
  const parrafo = document.querySelector("#parrafo2");
  if (!parrafo) return;

  let animacionEjecutada = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animacionEjecutada) {
        animacionEjecutada = true;

        parrafo.style.willChange = "transform, opacity, filter";

        const splitText2 = new SplitText("#parrafo2", {
          type: "words",
        })

        gsap.from(splitText2.words, {
          delay: 0.3,
          duration: 1,
          // filter: "blur(10px)",
          x: 20,
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
    });
  }, {
    threshold: 0.3,
  });

  observer.observe(parrafo);
}

export function animarControlCitas() {
  const controlCitas = document.querySelector("#controlCitas");
  if (!controlCitas) return;

  let animacionEjecutada = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animacionEjecutada) {
        animacionEjecutada = true;

        controlCitas.style.willChange = "transform, opacity, filter";

        const splitText2 = new SplitText("#controlCitas", {
          type: "words",
        })

        gsap.from(splitText2.words, {
          delay: 0.5,
          duration: 1,
          // filter: "blur(10px)",
          x: 20,
          stagger: {
            each: 0.1,
          },
          autoAlpha: 0,
          ease: "power3.out",
          onComplete: () => {
            controlCitas.style.willChange = "auto";
          }
        })
      }
    });
  }, {
    threshold: 0.3,
  });

  observer.observe(controlCitas);
}

// ===== ANIMACIÓN SECCIÓN 3 =====

export function animarTitulo3() {
  const titulo3 = document.querySelector("#titulo3");
  if (!titulo3) return;

  let animacionEjecutada = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animacionEjecutada) {
        animacionEjecutada = true;

        const splitText = new SplitText("#titulo3", {
          type: "chars",
        });

        const tl = gsap.timeline();
        tl.from(splitText.chars, {
          duration: 0.8,
          y: -50,
          opacity: 0,
          scale: 0.8,
          stagger: {
            each: 0.05,
            from: "random",
          },
          ease: "back.out(1.7)",
          onComplete: () => {
            titulo3.style.willChange = "auto";
          }
        })
        tl.to(splitText.chars, {
          duration: 1,
          y: 10,
          scale: 1,
          repeat: -1,
          yoyo: true,
          stagger: {
            each: 0.1,
          },
          ease: "power3.out",
        });
      }
    });
  }, {
    threshold: 0.3,
  });

  observer.observe(titulo3);
}

export function miniTitulo() {
  const elements = document.querySelectorAll("#miniTitulo");
  if (!elements.length) return;

  elements.forEach((element) => {
    let animacionEjecutada = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animacionEjecutada) {
          animacionEjecutada = true;

          element.style.willChange = "transform, opacity, filter";

          const splitText = new SplitText(element, {
            type: "words",
          });

          gsap.from(splitText.words, {
            delay: 1.5,
            duration: 1,
            x: -20,
            stagger: {
              each: 0.1,
            },
            autoAlpha: 0,
            ease: "power3.out",
            onComplete: () => {
              element.style.willChange = "auto";
            },
          });
        }
      });
    }, {
      threshold: 0.3,
    });

    observer.observe(element);
  });
}

export function animarParrafo3() {
  const elements = document.querySelectorAll("#parrafo3");
  if (!elements.length) return;

  elements.forEach((element) => {
    let animacionEjecutada = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animacionEjecutada) {
          animacionEjecutada = true;

          element.style.willChange = "transform, opacity, filter";

          const splitText = new SplitText(element, {
            type: "words",
          });

          gsap.from(splitText.words, {
            delay: 0.5,
            duration: 1,
            x: 20,
            stagger: {
              each: 0.1,
            },
            autoAlpha: 0,
            ease: "power3.out",
            onComplete: () => {
              element.style.willChange = "auto";
            },
          });
        }
      });
    }, {
      threshold: 0.3,
    });

    observer.observe(element);
  });
}
export function Rounded() {
  const rounded = document.querySelector("#rounded");
  const rounded2 = document.querySelector("#rounded2");
  const rounded3 = document.querySelector("#rounded3");
  if (!rounded) return;

  let animacionEjecutada = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animacionEjecutada) {
        animacionEjecutada = true;
      }
      const tl = gsap.timeline();
      tl.from(rounded, {
        duration: 1,

        ease: "power3.out",

      })
      tl.to(rounded, {
        duration: 2,
        rotateY: 360,
        repeat: -1,
        yoyo: true,
        ease: "power3.out",

      })
      tl.from(rounded2, {
        duration: 1,

        ease: "power3.out",

      })
      tl.to(rounded2, {
        duration: 2,
        rotateY: 360,
        repeat: -1,
        yoyo: true,
        ease: "power3.out",

      })
      tl.from(rounded3, {
        duration: 1,

        ease: "power3.out",

      })
      tl.to(rounded3, {
        duration: 2,
        rotateY: 360,
        repeat: -1,
        yoyo: true,
        ease: "power3.out",
      })
    });
  }, {
    threshold: 0.3,
  });

  observer.observe(rounded);
}

// ===== ANIMACIÓN SECCIÓN 4 (CTA Final) =====
export function animarParrafo4() {
  const ctaFinal = document.querySelector("#ctaFinal");
  if (!ctaFinal) return;

  let animacionEjecutada = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animacionEjecutada) {
        animacionEjecutada = true;

        ctaFinal.style.willChange = "transform, opacity, filter";

        const splitText = new SplitText("#ctaFinal", {
          type: "words",
        });

        const tl = gsap.timeline();
        tl.from(splitText.words, {
          duration: 1,
          x: 20,
          stagger: {
            each: 0.1,
          },
          autoAlpha: 0,
          ease: "power3.out",
        })
        tl.to(splitText.words, {
          duration: 1,
          x: 10,
          yoyo: true,
          repeat: -1,
          stagger: {
            each: 0.1,
          },
          ease: "power3.out",
        })
      }
    });
  }, {
    threshold: 0.3,
  });

  observer.observe(ctaFinal);
}