/*!
 * (c) 2026 Alessio Alaimo
 * Role: Data Analyst
 * Tutela legale: All Rights Reserved. Plagiarism is strictly prohibited.
 */

// ===== STATE MANAGEMENT =====
let currentLang = "it";
let currentTheme = "dark";

// ===== INIT =====
// Mobile Menu Toggle Logic
const createMobileMenu = () => {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State & UI Core
  initTheme();
  initLanguage();
  createMobileMenu();

  // 2. Background Layers
  initProceduralCubesBackground();

  // 3. Page components
  initNavbar();
  initBackToTop();
  initScrollAnimations();

  // 4. Interactive & Visual Effects
  initSmoothScroll();
  initWaveHandGreeting();
  initTypingEffect();
  initMouseTracking(); // Handles spotlight form too
  initContactWink();
  initContactForm(); // <-- Aggiunto
});

// ===== CONTACT WINK EFFECT =====
function initContactWink() {
  const photo = document.getElementById("contact-photo");
  if (!photo) return;

  const originalSrc = "profile-photo.png";
  const winkSrc = "profile-photo-wink.png";

  // Preload wink image
  const preloadImg = new Image();
  preloadImg.src = winkSrc;

  // Hover effect
  photo.addEventListener("mouseenter", () => {
    photo.src = winkSrc;
  });

  photo.addEventListener("mouseleave", () => {
    photo.src = originalSrc;
  });

  // Auto-wink every 8 seconds
  setInterval(() => {
    // Only if not currently hovering
    if (!photo.matches(":hover")) {
      photo.src = winkSrc;
      setTimeout(() => {
        photo.src = originalSrc;
      }, 300); // Quick wink duration
    }
  }, 8000);
}

// ===== MOUSE TRACKING =====
function initMouseTracking() {
  const contactForm = document.querySelector(".contact-form");
  const profileImage = document.querySelector(".hero .profile-image");
  let rafId = null;

  document.addEventListener("mousemove", (e) => {
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      // Global mouse tracking (for effects)
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      document.documentElement.style.setProperty("--mouse-x", x);
      document.documentElement.style.setProperty("--mouse-y", y);

      // Specific tracking for contact form spotlight
      if (contactForm) {
        const rect = contactForm.getBoundingClientRect();
        const formX = e.clientX - rect.left;
        const formY = e.clientY - rect.top;
        contactForm.style.setProperty("--mouse-x-form", `${formX}px`);
        contactForm.style.setProperty("--mouse-y-form", `${formY}px`);
      }

      // Holo-Tilt 3D Effect for Profile Image
      if (profileImage) {
        const rect = profileImage.getBoundingClientRect();
        // Check if cursor is over or near the image
        const isHovering = (
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom
        );

        if (isHovering) {
          // Calculate mouse position relative to image center
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const mouseX = e.clientX - centerX;
          const mouseY = e.clientY - centerY;

          // Max rotation angles (e.g. 5 degrees for a subtle effect)
          const rotateX = ((mouseY / (rect.height / 2)) * -5).toFixed(2);
          const rotateY = ((mouseX / (rect.width / 2)) * 5).toFixed(2);

          // Apply transform using CSS variables or inline styles
          profileImage.style.transform = `scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
          profileImage.style.transform = `scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        }
      }
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  const result = document.getElementById('form-status');

  if (!form || !result) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if the user has replaced the placeholder key
    const accessKeyInput = document.getElementById('web3formsKey');
    if(accessKeyInput && accessKeyInput.value === "INSERISCI_QUI_LA_TUA_CHIAVE") {
      result.style.display = "block";
      result.style.backgroundColor = "rgba(255, 102, 0, 0.1)"; // Warning color
      result.style.color = "var(--accent-secondary)";
      result.style.border = "1px solid var(--accent-secondary)";
      
      const lang = localStorage.getItem("lang") || "it";
      if(lang === "en") {
        result.innerHTML = "⚠️ Configuration error: Please insert your Web3Forms Access Key in index.html";
      } else {
        result.innerHTML = "⚠️ Errore configurazione: Inserisci la tua Access Key di Web3Forms in index.html";
      }
      return;
    }

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const lang = localStorage.getItem("lang") || "it";
    result.style.display = "block";
    result.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
    result.style.color = "var(--text-secondary)";
    result.style.border = "none";
    result.innerHTML = lang === "it" ? "Invio in corso..." : "Sending...";

    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.style.color = "var(--accent-tertiary)"; // Success green
                result.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
                result.innerHTML = lang === "it" ? "✅ Messaggio inviato con successo!" : "✅ Message sent successfully!";
            } else {
                console.log(response);
                result.style.color = "#ff4444"; // Error red
                result.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.style.color = "#ff4444";
            result.innerHTML = lang === "it" ? "❌ Qualcosa è andato storto. Riprova." : "❌ Something went wrong. Try again.";
        })
        .then(function() {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 5000);
        });
  });
}
// ===== TYPING EFFECT =====
function initTypingEffect() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  const roles = [
    { it: "AI & Data Engineer", en: "AI & Data Engineer" },
    { it: "Backend Developer", en: "Backend Developer" },
    { it: "Database Strategist", en: "Database Strategist" },
    { it: "Python & SQL Expert", en: "Python & SQL Expert" },
    { it: "Infrastructure Builder", en: "Infrastructure Builder" }
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    // Get current role based on language
    const currentLang = localStorage.getItem("lang") || "it";
    const currentRole = roles[roleIndex][currentLang];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50; // Speed up when deleting
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100; // Normal typing speed
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Finished typing word
      isDeleting = true;
      typeSpeed = 2000; // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting word
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

// ===== LANGUAGE TOGGLE =====
function initLanguage() {
  const langToggle = document.getElementById("langToggle");
  const savedLang = localStorage.getItem("lang") || "it";

  setLanguage(savedLang);

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const newLang = currentLang === "it" ? "en" : "it";
      setLanguage(newLang);
    });
  }
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    const flagSpan = langToggle.querySelector(".lang-flag");
    if (flagSpan) {
      if (lang === "en") {
        flagSpan.textContent = "🇬🇧";
        flagSpan.title = "Passa all'Italiano";
      } else {
        flagSpan.textContent = "🇮🇹";
        flagSpan.title = "Switch to English";
      }
    }
  }

  // Update elements with data-en/data-it attributes
  document.querySelectorAll("[data-en][data-it]").forEach((el) => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });

  // Update wave hand greeting if it exists
  if (typeof updateWaveHandGreeting === "function") {
    updateWaveHandGreeting();
  }
}

// ===== THEME TOGGLE =====
function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme") || "dark";

  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      // Neural network updates itself via MutationObserver inside initProceduralCubesBackground
    });
  }
}

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const sunIcon = themeToggle.querySelector(".sun-icon");
    const moonIcon = themeToggle.querySelector(".moon-icon");

    // In light mode we show the moon (to switch to dark)
    if (theme === "light") {
      if (sunIcon) sunIcon.style.display = "none";
      if (moonIcon) moonIcon.style.display = "block";
    } else {
      // In dark mode we show the sun (to switch to light)
      if (sunIcon) sunIcon.style.display = "block";
      if (moonIcon) moonIcon.style.display = "none";
    }
  }
}

// ===== WAVE HAND GREETING =====
function initWaveHandGreeting() {
  const waveHand = document.querySelector(".wave-hand");
  if (waveHand) {
    updateWaveHandGreeting();
  }
}

function updateWaveHandGreeting() {
  const waveHand = document.querySelector(".wave-hand");
  if (waveHand) {
    const greeting = currentLang === "it" ? "Ciao!" : "Hi!";
    waveHand.setAttribute("data-greeting", greeting);
  }
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbar() {
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if it's just "#"
      if (href === "#") return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(`
        .service-card,
        .skill-category,
        .soft-skill-card,
        .project-card,
        .why-me-card,
        .highlight-item,
        .education-card
    `);

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}





// ===== DIGITAL BRAIN (NEURAL NETWORK GRAPH VIA THREE.JS) =====
// Singleton state — only ONE WebGL context ever lives at a time
let _nnState = null;

function _disposeNeuralNetwork() {
  if (!_nnState) return;
  const { rafId, renderer, scene, geometry, linesGeom, particlesMat, linesMat, themeObserver, resizeHandler, mouseMoveHandler, heroObserver } = _nnState;

  // 1. Stop the animation loop
  if (rafId) cancelAnimationFrame(rafId);

  // 2. Stop observers / listeners
  if (themeObserver) themeObserver.disconnect();
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  if (mouseMoveHandler) document.removeEventListener('mousemove', mouseMoveHandler);
  if (heroObserver) heroObserver.disconnect();

  // 3. Dispose GPU resources
  if (geometry) geometry.dispose();
  if (linesGeom) linesGeom.dispose();
  if (particlesMat) particlesMat.dispose();
  if (linesMat) linesMat.dispose();
  if (scene) scene.clear();
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    // Non rimuovere il canvas dal DOM poiché ora è quello nativo
  }

  _nnState = null;
}

function initProceduralCubesBackground() {
  // Se esiste già, pulisci prima!
  _disposeNeuralNetwork();

  const container = document.getElementById("roots-canvas");
  if (!container || typeof THREE === "undefined") {
    console.error("Three.js non caricato o canvas non trovato!");
    return;
  }

  // Assicurati che diventi visibile e rimpiazzi la vecchia display:none
  container.style.display = "block";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.zIndex = "-1";
  container.style.pointerEvents = "none";
  container.style.opacity = "1";

  // --- PARAMETRI DELLA RETE ---
  let isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true }); // alpha true supporta il cambio live di background
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function updateRendererClearColor() {
    // Keep the canvas transparent so the CSS cyber-grid behind it is visible,
    // and particles/lines blend properly with the CSS background.
    renderer.setClearColor(0x000000, 0);
  }
  updateRendererClearColor();

  const numNodes = 700;
  const connectionRadius = 150;
  const brainRadius = 550;

  // --- TRIANGLE/PYRAMID POSITIONS PER LA LIGHT MODE ---
  const gridPool = [];
  const spacing = 40; // Triangolo più compatto
  const totalLayers = 16; // Stima dei layer necessari per ~700 nodi in un tetraedro
  let pointsGenerated = 0;
  
  // Costruiamo un tetraedro (piramide a base triangolare) strato per strato dall'alto al basso
  for (let L = 0; L < totalLayers && pointsGenerated < numNodes; L++) {
    const yPos = (totalLayers / 2 - L) * (spacing * 0.9); 
    
    for (let x = 0; x <= L; x++) {
      for (let z = 0; z <= L - x; z++) {
        if (pointsGenerated >= numNodes) break;
        
        // Asse Baricentrico per distribuire il triangolo dal centro
        const offsetX = (x - L / 3.0) * spacing * 1.1;
        const offsetZ = (z - L / 3.0) * spacing * 1.1;
        
        gridPool.push({
          x: offsetX,
          y: yPos,
          z: offsetZ
        });
        pointsGenerated++;
      }
    }
  }
  
  // Scorta di sicurezza: spargiamo alla base eventuali nodi rimasti fuori dai layer per chiudere il numero 700
  while(pointsGenerated < numNodes) {
     gridPool.push({
        x: (Math.random() - 0.5) * spacing * totalLayers * 0.5,
        y: (-totalLayers / 2) * (spacing * 0.9),
        z: (Math.random() - 0.5) * spacing * totalLayers * 0.5
     });
     pointsGenerated++;
  }

  // Shuffle della griglia per far rimescolare i nodi in modo incrociato ed organico quando si muovono
  for (let i = gridPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gridPool[i], gridPool[j]] = [gridPool[j], gridPool[i]];
  }

  // --- 1. NODI DELLA RETE ---
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(numNodes * 3);
  const targetPositions = new Float32Array(numNodes * 3);
  const colors = new Float32Array(numNodes * 3);
  const vColor = new THREE.Color();

  for (let i = 0; i < numNodes; i++) {
    // Generazione organica a strati (emisferi + profondità)
    const r = brainRadius * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = r * Math.sin(phi) * Math.cos(theta); // Sfera sferica
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.7; // Leggermente schiacciata
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Colori di base che gestiranno il mix live nei shader
    // Creiamo un baseHue che serve per Dark Mode (rosso/arancio) e per Light Mode (giallo/oro)
    const hueDark = Math.random() * 0.1; // Rosso/Arancio
    const hueLight = 0.11 + Math.random() * 0.06; // Giallo/Oro

    // Shader deciderà quale mixare
    vColor.setHSL(hueDark, 1.0, 0.5);

    colors[i * 3] = vColor.r;
    colors[i * 3 + 1] = vColor.g;
    colors[i * 3 + 2] = vColor.b;

    // Assegnamo la destinazione in Griglia (Light Mode)
    targetPositions[i * 3] = gridPool[i].x;
    targetPositions[i * 3 + 1] = gridPool[i].y;
    targetPositions[i * 3 + 2] = gridPool[i].z;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("targetPosition", new THREE.BufferAttribute(targetPositions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3)); // Restored: crucial for vertex shader attribute!

  // Shader personalizzato per le particelle (Nodi)
  const particlesMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      isDarkTheme: { value: !isLightMode ? 1.0 : 0.0 },
      themeTransition: { value: isLightMode ? 1.0 : 0.0 }
    },
    vertexColors: true,
    vertexShader: `
      attribute vec3 targetPosition;
      varying vec3 vColorBase;
      uniform float time;
      uniform float themeTransition;
      
      void main() {
        vColorBase = color; // base is red/orange
        
        // Morphing da forma sferica a griglia
        vec3 currentPos = mix(position, targetPosition, themeTransition);
        
        vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
        // Pulsa dolcemente in base alla posizione nello spazio (ritmo asincrono)
        float pulse = sin(currentPos.x * 0.005 + time * 2.0) * 0.5 + 0.5;
        // Dimensione base 4.0, ingrandimento pulse 4.0
        gl_PointSize = (4.0 + pulse * 4.0) * (1000.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColorBase;
      uniform float time;
      uniform float isDarkTheme;
      
      void main() {
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float ll = length(xy);
        if(ll > 0.5) discard;
        // Colori azzurro/blu (#0ea5e9 light, #2563eb dark basis) per Light mode
        vec3 lightColorBase = vec3(0.055, 0.647, 0.914);
        vec3 cColor = mix(lightColorBase, vColorBase, isDarkTheme);
        
        // Luminosità
        vec3 col = mix(cColor * 1.5, cColor * 3.0, isDarkTheme);
        float glow = smoothstep(0.5, 0.0, ll); 
        float alpha = glow * mix(0.9, 1.0, isDarkTheme);
        
        // Premultiply alpha for WebGL canvas compositing
        gl_FragColor = vec4(col * alpha, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, particlesMat);
  scene.add(particleSystem);

  // --- 2. CONNESSIONI (Assoni/Siringhe dati) ---
  const linePositions = [];
  const lineTargetPositions = [];
  const lineOpacities = [];
  const lineDistances = []; // Per animazione dei dati in base alla distanza

  // Trova i vicini
  for (let i = 0; i < numNodes; i++) {
    let connections = 0;
    for (let j = i + 1; j < numNodes; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const distSq = dx * dx + dy * dy + dz * dz;

      // Crea la linea solo se sono vicini (e non esagerare con le connessioni max 12 per nodo)
      if (distSq < connectionRadius * connectionRadius && connections < 12) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
        
        lineTargetPositions.push(
          targetPositions[i * 3], targetPositions[i * 3 + 1], targetPositions[i * 3 + 2],
          targetPositions[j * 3], targetPositions[j * 3 + 1], targetPositions[j * 3 + 2]
        );

        // L"opacità statica in base a quanto sono vicini i nodi (più vicini = più forte)
        const alpha = 1.0 - (Math.sqrt(distSq) / connectionRadius);
        lineOpacities.push(alpha, alpha);

        // Distanza dal centro (per generare onde procedurali basate sulle vere distanze fisiche)
        const dCenter1 = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2);
        const dCenter2 = Math.sqrt(positions[j * 3] ** 2 + positions[j * 3 + 1] ** 2 + positions[j * 3 + 2] ** 2);
        lineDistances.push(dCenter1, dCenter2);

        connections++;
      }
    }
  }

  const linesGeom = new THREE.BufferGeometry();
  linesGeom.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  linesGeom.setAttribute("targetPosition", new THREE.Float32BufferAttribute(lineTargetPositions, 3));
  linesGeom.setAttribute("alpha", new THREE.Float32BufferAttribute(lineOpacities, 1));
  linesGeom.setAttribute("dCenter", new THREE.Float32BufferAttribute(lineDistances, 1));

  const linesMat = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      isDarkTheme: { value: !isLightMode ? 1.0 : 0.0 },
      themeTransition: { value: isLightMode ? 1.0 : 0.0 }
    },
    vertexShader: `
      attribute vec3 targetPosition;
      attribute float alpha;
      attribute float dCenter;
      varying float vAlpha;
      varying float vDist;
      uniform float themeTransition;
      
      void main() {
        vAlpha = alpha;
        vDist = dCenter;
        vec3 currentPos = mix(position, targetPosition, themeTransition);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(currentPos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float isDarkTheme;
      varying float vAlpha;
      varying float vDist;
      
      void main() {
        float wave = sin(vDist * 0.015 - time * 3.0);
        float pulse = smoothstep(0.85, 1.0, wave);
        // Light mode: azzurro (#0ea5e9) come base, impulsi blu (#2563eb)
        // Dark mode: bright orange with glow
        vec3 baseColor = mix(vec3(0.055, 0.647, 0.914), vec3(0.9, 0.2, 0.0), isDarkTheme);
        vec3 pulseColor = mix(vec3(0.145, 0.388, 0.922), vec3(1.0, 0.5, 0.0), isDarkTheme);
        
        float finalAlpha = vAlpha * mix(0.7, 0.4, isDarkTheme); // Opacità calibrata
        float finalPulse = finalAlpha + (pulse * vAlpha * mix(0.9, 1.0, isDarkTheme));
        
        vec3 colorFinal = mix(baseColor, pulseColor, pulse);
        
        // Premultiply alpha for correct canvas compositing
        gl_FragColor = vec4(colorFinal * finalPulse, finalPulse);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending
  });
  const linesSystem = new THREE.LineSegments(linesGeom, linesMat);
  scene.add(linesSystem);

  // --- 3. ANIMAZIONE E REATTIVITA ---
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const mouseMoveHandler = (e) => {
    // Offset da centro schermo, molto lieve per non disorientare
    mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
  };
  document.addEventListener("mousemove", mouseMoveHandler);

  const resizeHandler = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", resizeHandler);

  // Reattività al tasto Dark/Light Mode nativo LIVE (Senza buttare giù il context)
  const themeObserver = new MutationObserver(() => {
    isLightMode = document.documentElement.getAttribute("data-theme") === "light";
    const isDarkFloat = !isLightMode ? 1.0 : 0.0;
    particlesMat.uniforms.isDarkTheme.value = isDarkFloat;
    linesMat.uniforms.isDarkTheme.value = isDarkFloat;

    // Switch blending mode (Normal per far vedere su bianco, Additive per glow su nero)
    particlesMat.blending = isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending;
    linesMat.blending = isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending;
    particlesMat.needsUpdate = true;
    linesMat.needsUpdate = true;

    updateRendererClearColor();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  let time = 0;
  let baseRotationY = scene.rotation.y;
  let isVisible = true; // Forziamo a true, abbandonando l'IntersectionObserver per stabilità assoluta.

  // Costruiamo e salviamo lo stato prima di annegare in animate()
  _nnState = {
    rafId: null,
    renderer,
    scene,
    geometry,
    linesGeom,
    particlesMat,
    linesMat,
    themeObserver,
    resizeHandler,
    mouseMoveHandler
  };

  function animate() {
    _nnState.rafId = requestAnimationFrame(animate);

    // Forza sempre il render (Niente return su isVisible)
    time += 0.01;
    particlesMat.uniforms.time.value = time;
    linesMat.uniforms.time.value = time;

    // Morph animation logic
    const targetTransition = isLightMode ? 1.0 : 0.0;
    particlesMat.uniforms.themeTransition.value += (targetTransition - particlesMat.uniforms.themeTransition.value) * 0.05;
    linesMat.uniforms.themeTransition.value = particlesMat.uniforms.themeTransition.value;

    // Parallax damping
    targetX = mouseX;
    targetY = mouseY;

    // Rotation mapping for both X (up/down) and Y (left/right) based on mouse
    baseRotationY += 0.0008;
    scene.rotation.y += ((baseRotationY + targetX * 0.01) - scene.rotation.y) * 0.05;
    scene.rotation.x += (targetY * 0.01 - scene.rotation.x) * 0.05;

    // Tilt the brain slightly up so it looks majestic
    scene.rotation.z = -0.1;

    renderer.render(scene, camera);
  }

  animate();
}

// ===== DYNAMIC PROJECT LOADING (Example) =====
// Projects section now shows a CTA card instead
// No need for loadProjects function anymore

// ===== EXPORT FUNCTIONS FOR TESTING =====
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    setTheme,
    setLanguage,
  };
}

console.log(
  "%c© Alessio Alaimo | Data Analyst%c\nSystem Ready.",
  "color: #4ade80; font-size: 20px; font-weight: bold;",
  "color: #ededed; font-size: 12px;"
);
