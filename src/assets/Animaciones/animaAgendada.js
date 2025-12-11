import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";



// Registrar plugins una vez al inicio
gsap.registerPlugin(ScrollTrigger, SplitText);


gsap.from("#titulo", {
    opacity: 0,
    duration: 1,
    y: -20,
    ease: "power3.out",
})
