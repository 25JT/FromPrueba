import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/dist/ScrollSmoother";

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

    document.addEventListener("DOMContentLoaded", () => {
      gsap.from("#registroNegocio", {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.out",
       
      });
    });
}