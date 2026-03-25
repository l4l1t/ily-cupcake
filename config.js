(() => {
  const STORAGE_KEY = 'loveSiteConfig';
  const defaultConfig = {
    herName: 'FILL_IN',
    customPromises: [],
    memories: [],
    futurePlans: [],
    songDedications: [],
    easterEggMessages: []
  };

  function warnFillIns(obj, prefix = 'CONFIG') {
    if (typeof obj === 'string' && obj.includes('FILL_IN')) {
      console.warn(`[${prefix}] Placeholder value still present:`, obj);
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => warnFillIns(v, `${prefix}[${i}]`));
      return;
    }
    if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([k, v]) => warnFillIns(v, `${prefix}.${k}`));
    }
  }

  function hydrateName() {
    const els = document.querySelectorAll('[data-config="herName"]');
    els.forEach((el) => {
      el.textContent = window.CONFIG?.herName || defaultConfig.herName;
    });
  }

  async function loadConfig() {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      window.CONFIG = JSON.parse(cached);
      warnFillIns(window.CONFIG);
      hydrateName();
      return;
    }

    try {
      const res = await fetch('custom-config.json');
      const json = await res.json();
      window.CONFIG = json;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(json));
      warnFillIns(json);
    } catch (err) {
      console.warn('Failed to load custom-config.json, using defaults.', err);
      window.CONFIG = defaultConfig;
    }
    hydrateName();
  }

  window.getHerName = () => window.CONFIG?.herName || defaultConfig.herName;
  window.getMemories = () => window.CONFIG?.memories || [];
  window.getPromises = () => window.CONFIG?.customPromises || [];
  window.getFuturePlans = () => window.CONFIG?.futurePlans || [];
  window.getSongDedications = () => window.CONFIG?.songDedications || [];
  window.getEasterEggs = () => window.CONFIG?.easterEggMessages || [];

  window.addEventListener('DOMContentLoaded', loadConfig);
})();
