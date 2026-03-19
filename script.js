// Variabili per salvare lingua e tema
let lingua = "it";
let tema = "dark";

// Funzione per il menu sul telefono
function gestisci_menu() {
  const bottone = document.getElementById("menuToggle");
  const menu = document.getElementById("navMenu");
  const link = document.querySelectorAll(".nav-link");

  if (!bottone || !menu) return;

  bottone.addEventListener("click", function () {
    bottone.classList.toggle("active");
    menu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Chiude il menu quando clicco un link
  link.forEach(function (l) {
    l.addEventListener("click", function () {
      bottone.classList.remove("active");
      menu.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });
}

// Quando la pagina e' pronta faccio partire tutto
document.addEventListener("DOMContentLoaded", function () {
  // Avvio le cose base
  imposta_tema_iniziale();
  imposta_lingua_iniziale();
  gestisci_menu();

  // Avvio lo sfondo figo con i cubi/radici
  fai_sfondo();

  // Avvio le altre funzioni del sito
  barra_sopra();
  bottone_torna_su();
  animazioni_scorrimento();
  scroll_morbido();
  saluto_mano();
  scritta_che_appare();
  mouse_che_segue();
  occhiolino_foto();
  invio_messaggio();
});

// Funzione per far fare l'occhiolino alla foto
function occhiolino_foto() {
  const immagine = document.getElementById("contact-photo");
  if (!immagine) return;

  const normale = "profile-photo.png";
  const occhiolino = "profile-photo-wink.png";

  // Carico l'immagine dell'occhiolino prima cosi non scatta
  const precarica = new Image();
  precarica.src = occhiolino;

  // Quando ci passo sopra col mouse
  immagine.addEventListener("mouseenter", function () {
    immagine.src = occhiolino;
  });

  immagine.addEventListener("mouseleave", function () {
    immagine.src = normale;
  });

  // Ne fa uno da solo ogni 8 secondi
  setInterval(function () {
    if (!immagine.matches(":hover")) {
      immagine.src = occhiolino;
      setTimeout(function () {
        immagine.src = normale;
      }, 300);
    }
  }, 8000);
}

// Funzione per far seguire il mouse ad alcuni elementi
function mouse_che_segue() {
  const form_contatto = document.querySelector(".contact-form");
  const foto_profilo = document.querySelector(".hero .profile-image");
  let frame = null;

  document.addEventListener("mousemove", function (e) {
    if (frame) cancelAnimationFrame(frame);

    frame = requestAnimationFrame(function () {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      document.documentElement.style.setProperty("--mouse-x", x);
      document.documentElement.style.setProperty("--mouse-y", y);

      if (form_contatto) {
        const bordo = form_contatto.getBoundingClientRect();
        const fx = e.clientX - bordo.left;
        const fy = e.clientY - bordo.top;
        form_contatto.style.setProperty("--mouse-x-form", fx + "px");
        form_contatto.style.setProperty("--mouse-y-form", fy + "px");
      }

      // Effetto 3D sulla foto
      if (foto_profilo) {
        const bordo_foto = foto_profilo.getBoundingClientRect();
        const sopra = (e.clientX >= bordo_foto.left && e.clientX <= bordo_foto.right &&
          e.clientY >= bordo_foto.top && e.clientY <= bordo_foto.bottom);

        if (sopra) {
          const centroX = bordo_foto.left + bordo_foto.width / 2;
          const centroY = bordo_foto.top + bordo_foto.height / 2;
          const mx = e.clientX - centroX;
          const my = e.clientY - centroY;

          const rotX = ((my / (bordo_foto.height / 2)) * -5).toFixed(2);
          const rotY = ((mx / (bordo_foto.width / 2)) * 5).toFixed(2);

          foto_profilo.style.transform = "scale(1.02) perspective(1000px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
        } else {
          foto_profilo.style.transform = "scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)";
        }
      }
    });
  });
}

// Gestione del form dei contatti
function invio_messaggio() {
  const form = document.getElementById('contactForm');
  const stato = document.getElementById('form-status');

  if (!form || !stato) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const input_chiave = document.getElementById('web3formsKey');
    if (input_chiave && input_chiave.value === "INSERISCI_QUI_LA_TUA_CHIAVE") {
      stato.style.display = "block";
      stato.style.color = "var(--accent-secondary)";

      const l = localStorage.getItem("lang") || "it";
      if (l === "en") {
        stato.innerHTML = "⚠️ Configuration error: Please insert your Web3Forms Access Key in index.html";
      } else {
        stato.innerHTML = "⚠️ Errore configurazione: Inserisci la tua Access Key di Web3Forms in index.html";
      }
      return;
    }

    const dati = new FormData(form);
    const ogg = Object.fromEntries(dati);
    const corpo = JSON.stringify(ogg);

    const l = localStorage.getItem("lang") || "it";
    stato.style.display = "block";
    stato.innerHTML = l === "it" ? "Invio in corso..." : "Sending...";

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: corpo
    })
      .then(async function (risposta) {
        let ris_json = await risposta.json();
        if (risposta.status == 200) {
          stato.style.color = "var(--accent-tertiary)";
          stato.innerHTML = l === "it" ? "✅ Messaggio inviato con successo!" : "✅ Message sent successfully!";
        } else {
          stato.style.color = "#ff4444";
          stato.innerHTML = ris_json.message;
        }
      })
      .catch(function (err) {
        stato.style.color = "#ff4444";
        stato.innerHTML = l === "it" ? "❌ Qualcosa è andato storto. Riprova." : "❌ Something went wrong. Try again.";
      })
      .then(function () {
        form.reset();
        setTimeout(function () {
          stato.style.display = "none";
        }, 5000);
      });
  });
}

// Effetto della scritta che si scrive da sola
function scritta_che_appare() {
  const el = document.getElementById("typing-text");
  if (!el) return;

  const ruoli = [
    { it: "AI & Data Engineer", en: "AI & Data Engineer" },
    { it: "Backend Developer", en: "Backend Developer" },
    { it: "Database Strategist", en: "Database Strategist" },
    { it: "Python & SQL Expert", en: "Python & SQL Expert" },
    { it: "Infrastructure Builder", en: "Infrastructure Builder" }
  ];

  let r_ind = 0;
  let c_ind = 0;
  let cancella = false;
  let vel = 100;

  function scrive() {
    const l = localStorage.getItem("lang") || "it";
    const r_attuale = ruoli[r_ind][l];

    if (cancella) {
      el.textContent = r_attuale.substring(0, c_ind - 1);
      c_ind--;
      vel = 50;
    } else {
      el.textContent = r_attuale.substring(0, c_ind + 1);
      c_ind++;
      vel = 100;
    }

    if (!cancella && c_ind === r_attuale.length) {
      cancella = true;
      vel = 2000;
    } else if (cancella && c_ind === 0) {
      cancella = false;
      r_ind = (r_ind + 1) % ruoli.length;
      vel = 500;
    }

    setTimeout(scrive, vel);
  }

  scrive();
}

// Funzioni per cambiare lingua
function imposta_lingua_iniziale() {
  const bottone_lingua = document.getElementById("langToggle");
  const salvata = localStorage.getItem("lang") || "it";

  cambia_lingua(salvata);

  if (bottone_lingua) {
    bottone_lingua.addEventListener("click", function () {
      const n = lingua === "it" ? "en" : "it";
      cambia_lingua(n);
    });
  }
}

function cambia_lingua(l) {
  lingua = l;
  localStorage.setItem("lang", l);
  document.documentElement.lang = l;

  const b = document.getElementById("langToggle");
  if (b) {
    const bandiera = b.querySelector(".lang-flag");
    if (bandiera) {
      if (l === "en") {
        bandiera.textContent = "🇬🇧";
        bandiera.title = "Passa all'Italiano";
      } else {
        bandiera.textContent = "🇮🇹";
        bandiera.title = "Switch to English";
      }
    }
  }

  document.querySelectorAll("[data-en][data-it]").forEach(function (el) {
    el.innerHTML = el.getAttribute("data-" + l);
  });

  aggiorna_saluto();
}

// Funzioni per cambiare tema (chiaro/scuro)
function imposta_tema_iniziale() {
  const bottone_tema = document.getElementById("themeToggle");
  const salvato = localStorage.getItem("theme") || "dark";

  cambia_tema(salvato);

  if (bottone_tema) {
    bottone_tema.addEventListener("click", function () {
      const n = tema === "dark" ? "light" : "dark";
      cambia_tema(n);
    });
  }
}

function cambia_tema(t) {
  tema = t;
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);

  const b = document.getElementById("themeToggle");
  if (b) {
    const sole = b.querySelector(".sun-icon");
    const luna = b.querySelector(".moon-icon");

    if (t === "light") {
      if (sole) sole.style.display = "none";
      if (luna) luna.style.display = "block";
    } else {
      if (sole) sole.style.display = "block";
      if (luna) luna.style.display = "none";
    }
  }
}

// Funzione per il saluto con la mano
function saluto_mano() {
  const mano = document.querySelector(".wave-hand");
  if (mano) {
    aggiorna_saluto();
  }
}

function aggiorna_saluto() {
  const mano = document.querySelector(".wave-hand");
  if (mano) {
    const s = lingua === "it" ? "Ciao!" : "Hi!";
    mano.setAttribute("data-greeting", s);
  }
}

// Barra sopra che cambia quando scrollo
function barra_sopra() {
  const barra = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 50) {
      barra.classList.add("scrolled");
    } else {
      barra.classList.remove("scrolled");
    }
  });
}

// Bottone per tornare in alto
function bottone_torna_su() {
  const b = document.getElementById("backToTop");
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 500) {
      b.classList.add("visible");
    } else {
      b.classList.remove("visible");
    }
  });

  b.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Scroll morbido per i link
function scroll_morbido() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      const h = this.getAttribute("href");
      if (h === "#") return;
      e.preventDefault();
      const bersaglio = document.querySelector(h);
      if (bersaglio) {
        const dist = bersaglio.offsetTop - 80;
        window.scrollTo({
          top: dist,
          behavior: "smooth",
        });
      }
    });
  });
}

// Animazioni quando appaiono gli elementi
function animazioni_scorrimento() {
  const opzioni = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) {
      if (v.isIntersecting) {
        v.target.style.opacity = "1";
        v.target.style.transform = "translateY(0)";
      }
    });
  }, opzioni);

  const el_animati = document.querySelectorAll(".service-card, .skill-category, .soft-skill-card, .project-card, .why-me-card, .highlight-item, .education-card, .bento-card, .project-oled-card");

  el_animati.forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// ----- PARTE PER LO SFONDO 3D (THREE.JS) -----
let stato_sfondo = null;

function pulisci_sfondo() {
  if (!stato_sfondo) return;
  const { r_id, b_rend, b_scena, g_geom, g_linee, m_part, m_linee, oss_tema, r_ridimensiona, r_mouse } = stato_sfondo;

  if (r_id) cancelAnimationFrame(r_id);
  if (oss_tema) oss_tema.disconnect();
  if (r_ridimensiona) window.removeEventListener('resize', r_ridimensiona);
  if (r_mouse) document.removeEventListener('mousemove', r_mouse);

  if (g_geom) g_geom.dispose();
  if (g_linee) g_linee.dispose();
  if (m_part) m_part.dispose();
  if (m_linee) m_linee.dispose();
  if (b_scena) b_scena.clear();
  if (b_rend) {
    b_rend.dispose();
    b_rend.forceContextLoss();
  }
  stato_sfondo = null;
}

function fai_sfondo() {
  pulisci_sfondo();

  const c_sfondo = document.getElementById("roots-canvas");
  if (!c_sfondo || typeof THREE === "undefined") return;

  c_sfondo.style.display = "block";
  c_sfondo.style.position = "fixed";
  c_sfondo.style.top = "0";
  c_sfondo.style.left = "0";
  c_sfondo.style.width = "100%";
  c_sfondo.style.height = "100%";
  c_sfondo.style.zIndex = "-1";
  c_sfondo.style.pointerEvents = "none";
  c_sfondo.style.opacity = "1";

  let luce = document.documentElement.getAttribute('data-theme') === 'light';

  const scena = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
  cam.position.z = 1000;

  const rend = new THREE.WebGLRenderer({ canvas: c_sfondo, antialias: true, alpha: true });
  rend.setSize(window.innerWidth, window.innerHeight);
  rend.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function colore_pulizia() {
    rend.setClearColor(0x000000, 0);
  }
  colore_pulizia();

  const tot_nodi = 700;
  const r_conn = 150;
  const r_cervello = 550;

  // Griglia per la modalità chiara
  const p_griglia = [];
  const spazio = 40;
  const tot_livelli = 16;
  let fatti = 0;

  for (let L = 0; L < tot_livelli && fatti < tot_nodi; L++) {
    const yP = (tot_livelli / 2 - L) * (spazio * 0.9);
    for (let x = 0; x <= L; x++) {
      for (let z = 0; z <= L - x; z++) {
        if (fatti >= tot_nodi) break;
        const offX = (x - L / 3.0) * spazio * 1.1;
        const offZ = (z - L / 3.0) * spazio * 1.1;
        p_griglia.push({ x: offX, y: yP, z: offZ });
        fatti++;
      }
    }
  }

  while (fatti < tot_nodi) {
    p_griglia.push({
      x: (Math.random() - 0.5) * spazio * tot_livelli * 0.5,
      y: (-tot_livelli / 2) * (spazio * 0.9),
      z: (Math.random() - 0.5) * spazio * tot_livelli * 0.5
    });
    fatti++;
  }

  for (let i = p_griglia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p_griglia[i], p_griglia[j]] = [p_griglia[j], p_griglia[i]];
  }

  const g_nodi = new THREE.BufferGeometry();
  const pos = new Float32Array(tot_nodi * 3);
  const pos_target = new Float32Array(tot_nodi * 3);
  const col = new Float32Array(tot_nodi * 3);
  const v_col = new THREE.Color();

  for (let i = 0; i < tot_nodi; i++) {
    const r = r_cervello * Math.cbrt(Math.random());
    const th = Math.random() * 2 * Math.PI;
    const ph = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(ph) * Math.cos(th);
    const y = r * Math.sin(ph) * Math.sin(th) * 0.7;
    const z = r * Math.cos(ph);

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;

    const h_dark = 0.55 + Math.random() * 0.1;
    v_col.setHSL(h_dark, 1.0, 0.5);
    col[i * 3] = v_col.r;
    col[i * 3 + 1] = v_col.g;
    col[i * 3 + 2] = v_col.b;

    pos_target[i * 3] = p_griglia[i].x;
    pos_target[i * 3 + 1] = p_griglia[i].y;
    pos_target[i * 3 + 2] = p_griglia[i].z;
  }

  g_nodi.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g_nodi.setAttribute("targetPosition", new THREE.BufferAttribute(pos_target, 3));
  g_nodi.setAttribute("color", new THREE.BufferAttribute(col, 3));

  const mat_part = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      isDarkTheme: { value: !luce ? 1.0 : 0.0 },
      themeTransition: { value: luce ? 1.0 : 0.0 }
    },
    vertexColors: true,
    vertexShader: `
      attribute vec3 targetPosition;
      varying vec3 vColorBase;
      uniform float time;
      uniform float themeTransition;
      void main() {
        vColorBase = color;
        vec3 currentPos = mix(position, targetPosition, themeTransition);
        vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
        float pulse = sin(currentPos.x * 0.005 + time * 2.0) * 0.5 + 0.5;
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
        vec3 lightColorBase = vec3(0.055, 0.647, 0.914);
        vec3 cColor = mix(lightColorBase, vColorBase, isDarkTheme);
        vec3 col = mix(cColor * 1.5, cColor * 3.0, isDarkTheme);
        float glow = smoothstep(0.5, 0.0, ll); 
        float alpha = glow * mix(0.9, 1.0, isDarkTheme);
        gl_FragColor = vec4(col * alpha, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: luce ? THREE.NormalBlending : THREE.AdditiveBlending
  });

  const sist_part = new THREE.Points(g_nodi, mat_part);
  scena.add(sist_part);

  const l_pos = [];
  const l_pos_target = [];
  const l_alfa = [];
  const l_dist = [];

  for (let i = 0; i < tot_nodi; i++) {
    let connessioni = 0;
    for (let j = i + 1; j < tot_nodi; j++) {
      const dx = pos[i * 3] - pos[j * 3];
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < r_conn * r_conn && connessioni < 12) {
        l_pos.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        l_pos_target.push(pos_target[i * 3], pos_target[i * 3 + 1], pos_target[i * 3 + 2], pos_target[j * 3], pos_target[j * 3 + 1], pos_target[j * 3 + 2]);
        const alpha = 1.0 - (Math.sqrt(distSq) / r_conn);
        l_alfa.push(alpha, alpha);
        const d_centro1 = Math.sqrt(pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2);
        const d_centro2 = Math.sqrt(pos[j * 3] ** 2 + pos[j * 3 + 1] ** 2 + pos[j * 3 + 2] ** 2);
        l_dist.push(d_centro1, d_centro2);
        connessioni++;
      }
    }
  }

  const g_linee = new THREE.BufferGeometry();
  g_linee.setAttribute("position", new THREE.Float32BufferAttribute(l_pos, 3));
  g_linee.setAttribute("targetPosition", new THREE.Float32BufferAttribute(l_pos_target, 3));
  g_linee.setAttribute("alpha", new THREE.Float32BufferAttribute(l_alfa, 1));
  g_linee.setAttribute("dCenter", new THREE.Float32BufferAttribute(l_dist, 1));

  const mat_linee = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      isDarkTheme: { value: !luce ? 1.0 : 0.0 },
      themeTransition: { value: luce ? 1.0 : 0.0 }
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
        vec3 baseColor = mix(vec3(0.055, 0.647, 0.914), vec3(0.145, 0.388, 0.922), isDarkTheme);
        vec3 pulseColor = mix(vec3(0.145, 0.388, 0.922), vec3(0.055, 0.647, 0.914), isDarkTheme);
        float alpha_finale = vAlpha * mix(0.7, 0.4, isDarkTheme);
        float pulse_finale = alpha_finale + (pulse * vAlpha * mix(0.9, 1.0, isDarkTheme));
        vec3 col_finale = mix(baseColor, pulseColor, pulse);
        gl_FragColor = vec4(col_finale * pulse_finale, pulse_finale);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: luce ? THREE.NormalBlending : THREE.AdditiveBlending
  });
  const sist_linee = new THREE.LineSegments(g_linee, mat_linee);
  scena.add(sist_linee);

  let mouseX = 0, mouseY = 0, tX = 0, tY = 0;
  const r_mouse = (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
  };
  document.addEventListener("mousemove", r_mouse);

  const r_ridimensiona = () => {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    rend.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", r_ridimensiona);

  const oss_tema = new MutationObserver(() => {
    luce = document.documentElement.getAttribute("data-theme") === "light";
    const dVal = !luce ? 1.0 : 0.0;
    mat_part.uniforms.isDarkTheme.value = dVal;
    mat_linee.uniforms.isDarkTheme.value = dVal;
    mat_part.blending = luce ? THREE.NormalBlending : THREE.AdditiveBlending;
    mat_linee.blending = luce ? THREE.NormalBlending : THREE.AdditiveBlending;
    colore_pulizia();
  });
  oss_tema.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  let tempo = 0;
  let rotBaseY = scena.rotation.y;

  stato_sfondo = {
    r_id: null,
    b_rend: rend,
    b_scena: scena,
    g_geom: g_nodi,
    g_linee: g_linee,
    m_part: mat_part,
    m_linee: mat_linee,
    oss_tema,
    r_ridimensiona,
    r_mouse
  };

  function muovi() {
    stato_sfondo.r_id = requestAnimationFrame(muovi);
    tempo += 0.01;
    mat_part.uniforms.time.value = tempo;
    mat_linee.uniforms.time.value = tempo;
    const transTarget = luce ? 1.0 : 0.0;
    mat_part.uniforms.themeTransition.value += (transTarget - mat_part.uniforms.themeTransition.value) * 0.05;
    mat_linee.uniforms.themeTransition.value = mat_part.uniforms.themeTransition.value;
    tX = mouseX;
    tY = mouseY;
    rotBaseY += 0.0008;
    scena.rotation.y += ((rotBaseY + tX * 0.01) - scena.rotation.y) * 0.05;
    scena.rotation.x += (tY * 0.01 - scena.rotation.x) * 0.05;
    scena.rotation.z = -0.1;
    rend.render(scena, cam);
  }
  muovi();
}

console.log("Sito caricato correttamente!");
