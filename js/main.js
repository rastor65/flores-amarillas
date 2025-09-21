// ===== Config =====
const CONFIG = {
  mensaje:
    "En el vasto cielo de mi vida, tú eres la flor que lo ilumina todo.",
  escribirVelocidadMs: 22,
  parallax: true,
  parallaxFactorNear: 0.02,
  parallaxFactorFar: 0.008,
  meteors: true,
  meteorIntervalMinMs: 4000,
  meteorIntervalMaxMs: 9000,
};

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Refs =====
const flower   = document.querySelector(".flower");
const toggleBtn= document.getElementById("toggleMessage");
const message  = document.getElementById("loveMessage");
const typeEl   = document.getElementById("typewriter");

const starsNear= document.querySelector(".stars-near");
const starsFar = document.querySelector(".stars-far");
const nebulas  = document.querySelectorAll(".nebula");
const meteorsC = document.getElementById("meteors");

// ===== Typewriter =====
async function typewriter(text, el, speed){
  el.textContent = "";
  if (prefersReduced) { el.textContent = text; return; }
  for (let i=0; i<text.length; i++){
    el.textContent += text[i];
    await new Promise(r => setTimeout(r, speed));
  }
}

// ===== Toggle Message =====
function toggleMessage(){
  const isHidden = message.hasAttribute("hidden");
  if (isHidden){
    message.removeAttribute("hidden");
    typewriter(CONFIG.mensaje, typeEl, CONFIG.escribirVelocidadMs);
  }else{
    message.setAttribute("hidden", "");
    typeEl.textContent = "";
  }
  toggleBtn.setAttribute("aria-expanded", String(isHidden));
}

toggleBtn.addEventListener("click", toggleMessage);

// Click / teclado en la flor
let bloomTimeout = null;
function bloom(){
  flower.classList.add("bloom");
  clearTimeout(bloomTimeout);
  bloomTimeout = setTimeout(() => flower.classList.remove("bloom"), 360);
  toggleMessage();
}
flower.addEventListener("click", bloom);
flower.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bloom(); }
});

// ===== Parallax (galaxia viva) =====
function parallax(e){
  if (!CONFIG.parallax || prefersReduced) return;
  const { innerWidth:w, innerHeight:h } = window;
  const x = (e.clientX - w/2) / w;
  const y = (e.clientY - h/2) / h;

  // Estrellas: cerca y lejos
  starsNear.style.transform = `translate3d(${x*40*CONFIG.parallaxFactorNear}px, ${y*40*CONFIG.parallaxFactorNear}px, 0)`;
  starsFar .style.transform = `translate3d(${x*60*CONFIG.parallaxFactorFar}px,  ${y*60*CONFIG.parallaxFactorFar}px, 0)`;

  // Nebulosas (más lentas, diferente fase)
  nebulas.forEach((n, i)=>{
    const f = (i+1)*0.5*CONFIG.parallaxFactorFar;
    n.style.transform = `translate3d(${x*30*f}px, ${y*30*f}px, 0)`;
  });
}
window.addEventListener("mousemove", parallax, { passive:true });

// ===== Meteors (estrellas fugaces) =====
function randomBetween(min, max){ return Math.random()*(max-min)+min; }

function spawnMeteor(){
  if (!CONFIG.meteors || prefersReduced) return;
  const m = document.createElement("div");
  m.className = "meteor";

  // Punto inicial aleatorio arriba/izquierda
  const startX = randomBetween(-50, window.innerWidth * 0.2);
  const startY = randomBetween(-50, window.innerHeight * 0.3);
  const length = randomBetween(140, 220);
  const dur = randomBetween(900, 1400);

  m.style.left = `${startX}px`;
  m.style.top  = `${startY}px`;

  // animación con JS para mayor control
  m.animate([
    { transform: `translate3d(0,0,0) rotate(45deg)`, opacity: 0 },
    { opacity: 1, offset: .08 },
    { transform: `translate3d(${length}px, ${length}px, 0) rotate(45deg)`, opacity: 0 }
  ], { duration: dur, easing: "ease-out" });

  meteorsC.appendChild(m);
  setTimeout(()=> m.remove(), dur+60);

  // programar siguiente meteorito
  const next = randomBetween(CONFIG.meteorIntervalMinMs, CONFIG.meteorIntervalMaxMs);
  meteorTimer = setTimeout(spawnMeteor, next);
}

let meteorTimer = null;
if (CONFIG.meteors && !prefersReduced){
  meteorTimer = setTimeout(spawnMeteor, randomBetween(1000, 3000));
}

// Limpieza en cambio de pestaña (opc)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { clearTimeout(meteorTimer); }
  else if (CONFIG.meteors && !prefersReduced) {
    meteorTimer = setTimeout(spawnMeteor, randomBetween(1500, 3500));
  }
});
