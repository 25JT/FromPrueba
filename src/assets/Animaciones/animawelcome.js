import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

// Registrar plugin
gsap.registerPlugin(SplitText);

const splitCache = new Map();

function getOrInitSplit(target, vars) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return null;
  if (splitCache.has(element)) return splitCache.get(element);
  const split = new SplitText(element, vars);
  splitCache.set(element, split);
  return split;
}

// Función Helper para observar y animar (Compatible con Movimiento.jsx)
function observarSeccion(elemento, callback) {
  if (!elemento) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 }); // Se activa apenas entra la sección
  observer.observe(elemento);
}

export function prepareAnimations() {
  gsap.set(".gsap-reveal", { autoAlpha: 1 });
  getOrInitSplit("#titulo", { type: "chars,words" });
  getOrInitSplit("#parrafo", { type: "words,lines" });
  getOrInitSplit("#titulo2", { type: "chars" });
  getOrInitSplit("#parrafo2", { type: "words" });
  getOrInitSplit("#titulo3", { type: "chars" });
  getOrInitSplit("#ctaFinal", { type: "words" });
  document.querySelectorAll("#miniTitulo, #parrafo3").forEach(el => getOrInitSplit(el, { type: "words" }));
}

// ===== SECCIÓN 0 (WELCOME) - INMEDIATA =====
export function animarTitulo() {
  const element = document.querySelector("#titulo");
  if (!element) return;
  element.style.perspective = "1000px";
  const splitText = getOrInitSplit(element, { type: "chars,words" });
  
  gsap.from(splitText.chars, {
    duration: 1.2,
    y: 70,
    rotateX: -100,
    opacity: 0,
    stagger: 0.02,
    ease: "expo.out",
    transformOrigin: "50% 100% -50",
  });

  const shineTl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
  shineTl.to(splitText.chars, {
    duration: 0.5,
    color: "#3b82f6",
    scale: 1.2,
    fontWeight: "900",
    stagger: 0.04,
    ease: "power2.out",
  }).to(splitText.chars, {
    duration: 0.5,
    color: "inherit",
    scale: 1,
    fontWeight: "inherit",
    stagger: 0.04,
    ease: "power2.in",
  }, "-=0.3");
}

export function animarParrafo() {
  const parrafo = document.querySelector("#parrafo");
  if (!parrafo) return;
  const splitText = getOrInitSplit(parrafo, { type: "words,lines" });
  gsap.from(splitText.words, {
    delay: 0.6,
    duration: 0.8,
    opacity: 0,
    y: 20,
    stagger: 0.02,
    ease: "power2.out",
  });
}

export function animarFormulario() {
  const form = document.querySelector("#animacionFormulario");
  if (!form) return;
  gsap.from(form, { delay: 0.8, duration: 1, y: 30, scale: 0.95, autoAlpha: 0, ease: "expo.out" });
}

// ===== SECCIÓN 2 (CARACTERÍSTICAS) =====
export function animarTitulo2() {
  const titulo = document.querySelector("#titulo2");
  observarSeccion(titulo, () => {
    const splitText = getOrInitSplit(titulo, { type: "chars" });
    gsap.from(splitText.chars, { duration: 0.6, y: 30, scale: 0.5, opacity: 0, stagger: 0.03, ease: "back.out(1.7)" });
  });
}

export function animarParrafo2() {
  const p = document.querySelector("#parrafo2");
  observarSeccion(p, () => {
    const splitText = getOrInitSplit(p, { type: "words" });
    gsap.from(splitText.words, { duration: 0.6, opacity: 0, y: 15, stagger: 0.02, ease: "power2.out" });
  });
}

export function animarControlCitas() {
  const grid = document.querySelector("#controlCitas");
  observarSeccion(grid, () => {
    gsap.from(grid.children, { duration: 0.6, y: 40, opacity: 0, scale: 0.9, stagger: 0.08, ease: "back.out(1.4)" });
  });
}

// ===== SECCIÓN 3 (PASOS) =====
export function animarTitulo3() {
  const titulo = document.querySelector("#titulo3");
  observarSeccion(titulo, () => {
    const splitText = getOrInitSplit(titulo, { type: "chars" });
    gsap.from(splitText.chars, { duration: 0.5, y: -20, opacity: 0, scale: 0.8, stagger: 0.02, ease: "back.out(1.7)" });
  });
}

export function miniTitulo() {
  document.querySelectorAll("#miniTitulo").forEach(el => {
    observarSeccion(el, () => {
      const splitText = getOrInitSplit(el, { type: "words" });
      gsap.from(splitText.words, { duration: 0.5, x: -15, opacity: 0, stagger: 0.02, ease: "power2.out" });
    });
  });
}

export function animarParrafo3() {
  document.querySelectorAll("#parrafo3").forEach(el => {
    observarSeccion(el, () => {
      const splitText = getOrInitSplit(el, { type: "words" });
      gsap.from(splitText.words, { duration: 0.5, x: 15, opacity: 0, stagger: 0.02, ease: "power2.out" });
    });
  });
}

export function Rounded() {
  const rounded = document.querySelector("#rounded");
  if (!rounded) return;
  observarSeccion(rounded, () => {
    const elements = [rounded, document.querySelector("#rounded2"), document.querySelector("#rounded3")];
    gsap.from(elements, { duration: 0.6, autoAlpha: 0, scale: 0, y: 20, stagger: 0.1, ease: "back.out(1.7)" });
    elements.forEach((el, index) => {
      if (el) gsap.to(el, { duration: 3, rotateY: 360, repeat: -1, ease: "power1.inOut", delay: index * 0.1 });
    });
  });
}

// ===== SECCIÓN 4 (CTA FINAL) =====
export function animarParrafo4() {
  const cta = document.querySelector("#ctaFinal");
  observarSeccion(cta, () => {
    document.querySelectorAll("#ctaFinal").forEach(el => {
      const splitText = getOrInitSplit(el, { type: "words" });
      gsap.from(splitText.words, { duration: 0.6, y: 20, opacity: 0, stagger: 0.02, ease: "power2.out" });
    });
  });
}