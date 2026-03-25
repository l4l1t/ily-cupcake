(() => {
  const eggMap = new Map();

  function heartSVG(color = '#e63950') {
    return `<svg viewBox="0 0 15 13" width="14" height="14" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="M2 1h3v2h2V1h3v2h2v3h-1v1h-1v1h-1v1H8v1H7v-1H6V8H5V7H4V6H3V3H2z"/></svg>`;
  }

  function createHeartBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const node = document.createElement('div');
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 80;
      node.innerHTML = heartSVG();
      node.style.position = 'fixed';
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.pointerEvents = 'none';
      node.style.zIndex = '999';
      node.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      node.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
      node.className = 'anim-heart-burst';
      document.body.appendChild(node);
      setTimeout(() => node.remove(), 2000);
    }
  }

  function createConfetti(count = 60) {
    const colors = ['#e63950', '#ff6b9d', '#ffc0e0', '#ffffff', '#f7a8c4'];
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.style.position = 'fixed';
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.top = '-100px';
      const s = 8 + Math.random() * 8;
      dot.style.width = `${s}px`;
      dot.style.height = `${s}px`;
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      dot.style.zIndex = '998';
      dot.className = 'anim-confetti-fall';
      dot.style.animationDelay = `${Math.random() * 0.8}s`;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 4000);
    }
  }

  function pixelWipeTo(url) {
    const wipe = document.createElement('div');
    wipe.style.position = 'fixed';
    wipe.style.inset = '0';
    wipe.style.background = '#fff';
    wipe.style.zIndex = '1000';
    wipe.className = 'anim-pixel-wipe';
    document.body.appendChild(wipe);
    setTimeout(() => { window.location.href = url; }, 600);
  }

  function typewriterReveal(element, text, msPerChar = 15, onComplete) {
    let i = 0;
    element.textContent = '';
    const timer = setInterval(() => {
      element.textContent += text[i++] || '';
      if (i >= text.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, msPerChar);
  }

  function bootTypeLines(lines, container, msPerChar = 30, onComplete) {
    let idx = 0;
    const writeLine = () => {
      if (idx >= lines.length) {
        if (onComplete) onComplete();
        return;
      }
      const p = document.createElement('p');
      container.appendChild(p);
      typewriterReveal(p, lines[idx], msPerChar, () => {
        idx += 1;
        setTimeout(writeLine, 400);
      });
    };
    writeLine();
  }

  function trackEasterEgg(key, threshold, callback) {
    const count = (eggMap.get(key) || 0) + 1;
    if (count >= threshold) {
      eggMap.set(key, 0);
      callback();
      return;
    }
    eggMap.set(key, count);
  }

  function initFloatingSprites(containerId, imageSrc, intervalMs = 2000) {
    const container = document.getElementById(containerId);
    if (!container) return;
    setInterval(() => {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.style.position = 'fixed';
      img.style.left = `${Math.random() * 100}vw`;
      img.style.bottom = '-80px';
      img.style.width = `${20 + Math.random() * 30}px`;
      img.style.pointerEvents = 'none';
      img.style.zIndex = '20';
      img.className = 'anim-float-up';
      container.appendChild(img);
      setTimeout(() => img.remove(), 8000);
    }, intervalMs);
  }

  function setupHiddenTextEasterEggs() {
    document.querySelectorAll('[data-hidden]').forEach((el) => {
      const hidden = el.querySelector('.hidden-message');
      if (!hidden) return;
      hidden.style.display = 'none';
      el.addEventListener('mouseenter', () => hidden.style.display = 'block');
      el.addEventListener('mouseleave', () => hidden.style.display = 'none');
    });
  }

  function handleStickerCollage(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.querySelectorAll('img.sticker').forEach((img) => {
      const rot = -20 + Math.random() * 40;
      const tx = -10 + Math.random() * 20;
      const ty = -10 + Math.random() * 20;
      img.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
    });
  }

  window.createHeartBurst = createHeartBurst;
  window.createConfetti = createConfetti;
  window.pixelWipeTo = pixelWipeTo;
  window.typewriterReveal = typewriterReveal;
  window.bootTypeLines = bootTypeLines;
  window.trackEasterEgg = trackEasterEgg;
  window.initFloatingSprites = initFloatingSprites;
  window.setupHiddenTextEasterEggs = setupHiddenTextEasterEggs;
  window.handleStickerCollage = handleStickerCollage;

  window.addEventListener('DOMContentLoaded', () => {
    handleStickerCollage('.letter-content');
    setupHiddenTextEasterEggs();
    if (document.getElementById('floating-sprites')) {
      initFloatingSprites('floating-sprites', 'assets/nano/sprites-float.png', 2000);
    }
  });
})();
