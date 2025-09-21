// Configuración editable
const CONFIG = {
  mensaje:
    "Eres mi flor favorita en toda la galaxia. Gracias por iluminar mi universo.",
  escribirVelocidadMs: 24, // 24ms por carácter (se respeta reduce-motion)
  parallax: true,          // mueve estrellas con el mouse
  parallaxFactorNear: 0.012,
  parallaxFactorFar: 0.004
};

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Referencias
const flower = document.querySelector(".flower");
const toggleBtn = document.getElementById("toggleMessage");
const message = document.getElementById("loveMessage");
const typeEl = document.getElementById("typewriter");
const layer1 = document.querySelector(".layer-1");
const layer2 = document.querySelector(".layer-2");
const nebula = document.querySelector(".nebula");

// Typewriter con respeto a reduce-motion
async function typewriter(text, el, speed) {
  el.textContent = "";
  if (prefersReduced) {
    el.textContent = text; // sin animación
    return;
  }
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await new Promise(r => setTimeout(r, speed));
  }
}

// Alterna mensaje
function toggleMessage() {
  const isHidden = message.hasAttribute("hidden");
  if (isHidden) {
    message.removeAttribute("hidden");
    typewriter(CONFIG.mensaje, typeEl, CONFIG.escribirVelocidadMs);
  } else {
    message.setAttribute("hidden", "");
    typeEl.textContent = "";
  }
  // Accesibilidad: sincroniza aria-expanded
  toggleBtn.setAttribute("aria-expanded", String(isHidden));
}

toggleBtn.addEventListener("click", toggleMessage);

// Click en la flor: micro "bloom" + alternar mensaje
let bloomTimeout = null;
function bloom() {
  flower.classList.add("bloom");
  clearTimeout(bloomTimeout);
  bloomTimeout = setTimeout(() => flower.classList.remove("bloom"), 300);
  toggleMessage();
}
flower.addEventListener("click", bloom);
// Teclado (Enter/Espacio) por accesibilidad
flower.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    bloom();
  }
});

// Parallax minimalista
function parallax(e) {
  if (!CONFIG.parallax || prefersReduced) return;
  const { innerWidth: w, innerHeight: h } = window;
  const x = (e.clientX - w / 2) / w;
  const y = (e.clientY - h / 2) / h;

  // Cerca (layer-1), lejos (layer-2), nebulosa sutil
  layer1.style.transform = `translate3d(${x * 40 * CONFIG.parallaxFactorNear}px, ${y * 40 * CONFIG.parallaxFactorNear}px, 0)`;
  layer2.style.transform = `translate3d(${x * 40 * CONFIG.parallaxFactorFar}px, ${y * 40 * CONFIG.parallaxFactorFar}px, 0)`;
  nebula.style.transform = `translate3d(${x * 24 * CONFIG.parallaxFactorFar}px, ${y * 24 * CONFIG.parallaxFactorFar}px, 0)`;
}
window.addEventListener("mousemove", parallax, { passive: true });

// Consejo: personaliza el texto cambiando CONFIG.mensaje.
// También puedes ajustar colores en :root (CSS) y velocidades/efectos arriba.
