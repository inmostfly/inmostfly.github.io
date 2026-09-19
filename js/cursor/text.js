/* Lightweight click words: animation uses the compositor, not jQuery layout updates. */
(() => {
  const words = [
    'AC', 'TLE', 'WA', 'RE', 'Peace', 'Love', 'Joy', 'Happiness',
    'Wealth', 'Health', 'Success', 'Fate', 'Destiny'
  ];
  let nextWord = 0;

  document.addEventListener('click', event => {
    if (event.button !== 0) return;

    const word = words[nextWord];
    nextWord = (nextWord + 1) % words.length;

    const label = document.createElement('span');
    label.className = 'click-word';
    label.textContent = word;
    label.style.left = `${event.clientX}px`;
    label.style.top = `${event.clientY - 28}px`;
    document.body.appendChild(label);

    label.addEventListener('animationend', () => label.remove(), { once: true });
    // Also remove it when reduced motion disables the CSS animation.
    setTimeout(() => label.remove(), 1600);
  }, { passive: true });
})();
