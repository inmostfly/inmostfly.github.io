/* Click-only fireworks. The canvas is idle when no burst is on screen. */
(() => {
  const canvas = document.querySelector('.fireworks');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const colors = ['#ff1461', '#18ff92', '#5a87ff', '#fbf38c'];
  const bursts = [];
  const lifetime = 800;
  let frame = 0;

  function resize() {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * scale);
    canvas.height = Math.round(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function draw(now) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let index = bursts.length - 1; index >= 0; index--) {
      const burst = bursts[index];
      const progress = Math.min((now - burst.started) / lifetime, 1);
      if (progress >= 1) {
        bursts.splice(index, 1);
        continue;
      }

      const fade = 1 - progress;
      context.globalAlpha = fade;
      context.strokeStyle = '#ff1461';
      context.lineWidth = 4 * fade;
      context.beginPath();
      context.arc(burst.x, burst.y, 10 + progress * 80, 0, Math.PI * 2);
      context.stroke();

      for (const particle of burst.particles) {
        const distance = particle.speed * (1 - (1 - progress) ** 2);
        const x = burst.x + Math.cos(particle.angle) * distance;
        const y = burst.y + Math.sin(particle.angle) * distance + progress * progress * 28;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(x, y, Math.max(0.5, particle.radius * fade), 0, Math.PI * 2);
        context.fill();
      }
    }

    context.globalAlpha = 1;
    frame = bursts.length ? requestAnimationFrame(draw) : 0;
  }

  function burst(event) {
    if (event.button !== 0 || event.target.closest('a, button, input, textarea, select')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    bursts.push({
      x: event.clientX,
      y: event.clientY,
      started: performance.now(),
      particles: Array.from({ length: 24 }, () => ({
        angle: Math.random() * Math.PI * 2,
        speed: 45 + Math.random() * 115,
        radius: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    });

    if (!frame) frame = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('mousedown', burst, { passive: true });
})();
