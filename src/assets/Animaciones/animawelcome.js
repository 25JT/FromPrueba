import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/dist/ScrollSmoother";

// Registrar plugins una vez al inicio
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function animar() {
  // Scroll suave con Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Configuración de ScrollTrigger con Lenis
  lenis.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return arguments.length ? lenis.scrollTo(value) : window.scrollY;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.body.style.transform ? "transform" : "fixed",
  });

  // Inicializar animaciones cuando el DOM esté listo
  document.addEventListener("DOMContentLoaded", () => {
    // Animación para Ptext
    const ptext = document.getElementById("Ptext");
    if (ptext) {
      gsap.fromTo(ptext,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ptext,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
          onComplete: () => {
            requestAnimationFrame(() => {
              gsap.to(ptext, {
                x: -8,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            });
          },
        }
      );
    }

    // Animación para Ptext2
    const ptext2 = document.getElementById("Ptext2");
    if (ptext2) {
      gsap.fromTo(ptext2,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
        }
      );
    }

    // Animación para imgP
    const imgP = document.getElementById("imgP");
    if (imgP) {
      gsap.fromTo(imgP,
        { opacity: 0, x: 100, rotation: -5, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: imgP,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
          onComplete: () => {
            gsap.to(imgP, {
              y: "+=10",
              rotation: 2,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        }
      );
    }

    // Animación para btnReg
    const btnReg = document.getElementById("btnReg");
    if (btnReg) {
      gsap.fromTo(btnReg,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: btnReg,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Animación para ParaTi
    const paraTi = document.getElementById("ParaTi");
    if (paraTi) {
      gsap.fromTo(paraTi,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: paraTi,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Animación para cliente y clienteImg
    const cliente = document.getElementById("cliente");
    const clienteImg = document.getElementById("clienteImg");
    
    if (cliente) {
      gsap.fromTo(cliente,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: cliente,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
    
    if (clienteImg) {
      gsap.fromTo(clienteImg,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: clienteImg,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onComplete: () => {
            gsap.to(clienteImg, {
              y: "+=10",
              rotation: 2,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        }
      );
    }

    // Animación para Testimonials
    const testimonialTitle = document.querySelector(".testimonial-title");
    if (testimonialTitle) {
      gsap.fromTo(testimonialTitle,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: testimonialTitle,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    const testimonialSubtitle = document.querySelector(".testimonial-subtitle");
    if (testimonialSubtitle) {
      gsap.fromTo(testimonialSubtitle,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          scrollTrigger: {
            trigger: testimonialSubtitle,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Testimonial cards
    const testimonialCards = gsap.utils.toArray(".testimonial-card");
    if (testimonialCards.length > 0) {
      testimonialCards.forEach((card, i) => {
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 100,
            rotationY: i % 2 === 0 ? -15 : 15,
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.5 + i * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Hover effect
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }

    // Animación para Registration Form
    const registroForm = document.querySelector("#registro1 form");
    if (registroForm) {
      gsap.fromTo(registroForm,
        {
          opacity: 0,
          scale: 0.98,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#registro1",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Elementos del formulario
      gsap.utils.toArray("#registro1 form > *").forEach((element, i) => {
        gsap.fromTo(element,
          {
            opacity: 0,
            y: 30,
            x: i % 2 === 0 ? -20 : 20,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.5,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              end: "bottom 90%",
              toggleActions: "play none none none",
              scrub: 1,
            },
          }
        );
      });
    }

    // Animación para Profesional y Profesionalimg
    const profesional = document.getElementById("Profesional");
    const profesionalImg = document.getElementById("Profesionalimg");
    
    if (profesional) {
      gsap.fromTo(profesional,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: profesional,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
    
    if (profesionalImg) {
      gsap.fromTo(profesionalImg,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: profesionalImg,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onComplete: () => {
            gsap.to(profesionalImg, {
              y: "+=10",
              rotation: 2,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        }
      );
    }
  });
}