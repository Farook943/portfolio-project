const canvas = document.querySelector("#neuralCanvas");
const ctx = canvas.getContext("2d");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");

let particles = [];
let width = 0;
let height = 0;
let animationFrame = null;

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const count = Math.max(38, Math.floor((width * height) / 28000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    r: Math.random() * 1.8 + 0.8
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);

  for (const dot of particles) {
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (dot.x < 0 || dot.x > width) dot.vx *= -1;
    if (dot.y < 0 || dot.y > height) dot.vy *= -1;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(59, 231, 255, 0.62)";
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 145) {
        const opacity = 1 - distance / 145;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(31, 242, 178, ${opacity * 0.22})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  animationFrame = requestAnimationFrame(drawNetwork);
}

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-label", "Open navigation");
  }
});

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", updateHeader, { passive: true });

resizeCanvas();
drawNetwork();
updateHeader();

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
});
