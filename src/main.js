import { skillGroups, skillLevels } from "./data/skills.js";
import { projects } from "./data/projects.js";
import { certificates, plannedCertifications } from "./data/certificates.js";
import { socialLinks } from "./data/socialLinks.js";

const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function initRoleTyping() {
  const target = document.querySelector("#typed-role");
  if (!target || prefersReducedMotion) return;
  const roles = [
    "Student In SMK Negeri 1 Cibinong",
    "Web Developer",
    "Software Developer",
    "Game Developer",
  ];
  let roleIndex = 0;
  let length = roles[0].length;
  let deleting = true;
  let timer;
  const tick = () => {
    if (document.hidden) {
      timer = window.setTimeout(tick, 250);
      return;
    }
    const role = roles[roleIndex];
    length += deleting ? -1 : 1;
    target.textContent = role.slice(0, length);
    let delay = deleting ? 42 : 78;
    if (!deleting && length === role.length) {
      deleting = true;
      delay = 1250;
    } else if (deleting && length === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 320;
    }
    timer = window.setTimeout(tick, delay);
  };
  timer = window.setTimeout(tick, 1500);
}

function initTerminal() {
  const terminal = document.querySelector("#terminal-body");
  const replay = document.querySelector("#terminal-replay");
  if (!terminal || !replay) return;
  const targets = [...terminal.querySelectorAll(".terminal-command, .terminal-output")];
  const contents = targets.map((node) => node.textContent);
  let timer = 0;
  let started = false;
  let index = 0;
  let char = 0;
  const restore = () => targets.forEach((node, i) => (node.textContent = contents[i]));
  const animate = () => {
    window.clearTimeout(timer);
    index = 0;
    char = 0;
    if (prefersReducedMotion) {
      restore();
      replay.disabled = false;
      return;
    }
    targets.forEach((node) => (node.textContent = ""));
    replay.disabled = true;
    const typeNext = () => {
      if (index >= targets.length) {
        replay.disabled = false;
        return;
      }
      const target = targets[index];
      char += 1;
      target.textContent = contents[index].slice(0, char);
      if (char >= contents[index].length) {
        index += 1;
        char = 0;
        timer = window.setTimeout(typeNext, 170);
      } else {
        timer = window.setTimeout(typeNext, target.classList.contains("terminal-command") ? 34 : 18);
      }
    };
    typeNext();
  };
  replay.addEventListener("click", animate);
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting) && !started) {
      started = true;
      observer.disconnect();
      animate();
    }
  }, { threshold: 0.2 });
  observer.observe(terminal.closest(".terminal-panel"));
}

function initHeroParticles() {
  const canvas = document.querySelector(".hero-particles");
  const hero = document.querySelector("#home");
  const context = canvas?.getContext("2d", { alpha: true });
  if (!canvas || !hero || !context || prefersReducedMotion) {
    hero?.classList.add("particles-static");
    return;
  }
  let width = 0;
  let height = 0;
  let frame = 0;
  let inView = false;
  let pointer = { x: -1000, y: -1000 };
  let dots = [];
  const resize = () => {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const amount = Math.min(52, Math.max(18, Math.round((width * height) / 21000)));
    dots = Array.from({ length: amount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: 0.8 + Math.random() * 1.3,
    }));
    if (inView) start();
  };
  const draw = () => {
    frame = 0;
    if (!inView || document.hidden) return;
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < dots.length; i += 1) {
      const dot = dots[i];
      dot.x += dot.vx;
      dot.y += dot.vy;
      if (dot.x < 0 || dot.x > width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > height) dot.vy *= -1;
      const dx = pointer.x - dot.x;
      const dy = pointer.y - dot.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 100 && distance > 0) {
        dot.x -= (dx / distance) * (100 - distance) * 0.012;
        dot.y -= (dy / distance) * (100 - distance) * 0.012;
      }
      context.beginPath();
      context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(74, 222, 128, 0.48)";
      context.fill();
      for (let j = i + 1; j < dots.length; j += 1) {
        const other = dots[j];
        const lineDistance = Math.hypot(dot.x - other.x, dot.y - other.y);
        if (lineDistance > 92) continue;
        context.beginPath();
        context.moveTo(dot.x, dot.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(74, 222, 128, ${0.13 * (1 - lineDistance / 92)})`;
        context.lineWidth = 0.7;
        context.stroke();
      }
    }
    frame = window.requestAnimationFrame(draw);
  };
  function start() {
    if (inView && !document.hidden && !frame) frame = window.requestAnimationFrame(draw);
  }
  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };
  const visibilityObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        if (inView) start();
        else stop();
      }, { threshold: 0 })
    : null;
  visibilityObserver?.observe(hero);
  if (!visibilityObserver) inView = true;
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener("resize", resize, { passive: true });
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = hero.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }, { passive: true });
  hero.addEventListener("pointerleave", () => (pointer = { x: -1000, y: -1000 }), { passive: true });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  resize();
}

const technologyLogos = {
  HTML5: "html5",
  CSS3: "css3",
  JavaScript: "javascript",
  PHP: "php",
  "C#": "csharp",
  Java: "java",
  Python: "python",
  Dart: "dart",
  "Node.js": "nodejs",
  Bootstrap: "bootstrap",
  Laravel: "laravel",
  Flutter: "flutter",
  Django: "django",
  MySQL: "mysql",
  "SQL Server": "microsoftsqlserver",
  "SQL Server LocalDB": "microsoftsqlserver",
  Git: "git",
  GitHub: "github",
  "Visual Studio Code": "vscode",
  "Visual Studio": "visualstudio",
  NetBeans: "netbeans",
  "draw.io": "drawio",
  XAMPP: "xampp",
  Laragon: "laragon",
  GDevelop: "gdevelop",
  Vercel: "vercel",
};

function renderTechnology(item, category, index) {
  const logo = technologyLogos[item] || "code";
  return `<div class="technology-card technology-card-${escapeHtml(logo)} reveal" title="${escapeHtml(category)}" style="--skill-delay:${index * 35}ms;--reveal-delay:${Math.min(index, 9) * 45}ms">
    <span class="technology-logo" aria-hidden="true"><img src="images/skills/${escapeHtml(logo)}.svg" alt="" loading="lazy" decoding="async"></span>
    <span class="technology-name">${escapeHtml(item)}</span>
  </div>`;
}

const allTechnologies = skillGroups.flatMap((group) => group.items);
let technologyIndex = 0;
document.querySelector("#skills-grid").innerHTML = skillGroups
  .map(
    (group) => `<section class="technology-category" aria-label="${escapeHtml(group.title)}">
      <h4 class="technology-category-title">${escapeHtml(group.title)}</h4>
      <div class="technology-group-grid">${group.items
        .map((item) => renderTechnology(item, group.title, technologyIndex++))
        .join("")}</div>
    </section>`,
  )
  .join("");

document.querySelector("#skill-levels").innerHTML = skillLevels
  .map((skill, index) => {
    const percent = Math.max(0, Math.min(100, Number(skill.percent) || 0));
    return `<div class="skill-level" style="--skill-delay:${index * 100}ms">
    <div class="skill-level-label"><span>${escapeHtml(skill.label)}</span><strong>${percent}%</strong></div>
    <div class="skill-meter" role="progressbar" aria-label="${escapeHtml(skill.label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
      <span class="skill-meter-fill" style="--skill-progress:${percent / 100}"></span>
    </div>
  </div>`;
  })
  .join("");
document.querySelector("#skill-level-count").textContent =
  `01 — ${String(skillLevels.length).padStart(2, "0")}`;
document.querySelector("#technology-count").textContent =
  `${allTechnologies.length} TECHNOLOGIES`;

const filterOptions = [
  { label: "All Projects", value: "All" },
  { label: "Web", value: "Web" },
  { label: "Desktop", value: "Desktop" },
  { label: "Games", value: "Games" },
  { label: "Automation", value: "Automation" },
];
const filterRoot = document.querySelector("#project-filters");
const projectRoot = document.querySelector("#projects-grid");
// Initialized before the first project render, which invokes observeReveals().
let revealObserver;

filterRoot.innerHTML = filterOptions
  .map(
    (item, index) =>
      `<button type="button" class="filter-button" data-filter="${escapeHtml(item.value)}" aria-pressed="${index === 0}">${escapeHtml(item.label)}</button>`,
  )
  .join("");

function renderProjects(filter = "All") {
  const shown = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => filter === "All" || project.filter === filter);
  projectRoot.innerHTML = shown
    .map(
      ({ project, index }) => `
      <article class="project-card reveal" style="--reveal-delay:${index * 65}ms">
      <div class="project-art">
        <img class="project-image" src="${escapeHtml(project.image)}" alt="Screenshot project ${escapeHtml(project.title)}" loading="lazy" decoding="async">
        <span class="art-number">${escapeHtml(project.number)} / ${String(projects.length).padStart(2, "0")}</span>
      </div>
      <div class="project-body"><div class="project-meta"><span>${escapeHtml(project.category)}</span><span class="project-status">${escapeHtml(project.status)}</span></div>
        <h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p>
        ${project.features?.length ? `<ul class="project-features" aria-label="Fitur utama">${project.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>` : ""}
        ${project.technologies.length ? `<div class="project-tags">${project.technologies.map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`).join("")}</div>` : '<div class="project-tags"><span class="tag">Technology details to be confirmed</span></div>'}
      </div>
    </article>`,
    )
    .join("");
  observeReveals();
}
renderProjects();

projectRoot.addEventListener(
  "error",
  (event) => {
    const image = event.target.closest?.("img.project-image");
    if (!image || image.dataset.fallbackShown) return;
    image.dataset.fallbackShown = "true";
    image.hidden = true;
    const fallback = document.createElement("div");
    fallback.className = "image-fallback";
    const mark = document.createElement("span");
    mark.className = "image-fallback-mark";
    mark.textContent = "↻";
    const message = document.createElement("strong");
    message.textContent = "Preview image not found";
    const path = document.createElement("code");
    path.textContent = image.getAttribute("src");
    const hint = document.createElement("small");
    hint.textContent =
      "Place the image at this path or update its path in src/data/projects.js.";
    fallback.append(mark, message, path, hint);
    image.closest(".project-art").append(fallback);
  },
  true,
);

filterRoot.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  filterRoot
    .querySelectorAll("[data-filter]")
    .forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
  renderProjects(button.dataset.filter);
});

const certificateRoot = document.querySelector("#certificate-list");
const certificateFilterRoot = document.querySelector("#certificate-filters");
const plannedCertificateRoot = document.querySelector("#planned-certificate-list");
const certificateDialog = document.querySelector(".certificate-dialog");
const certificatePreview = certificateDialog.querySelector(
  "#certificate-preview-content",
);
const certificateFileUrl = (file) => encodeURI(file);
const certificateFilters = [
  { label: "All", value: "All" },
  { label: "Course", value: "Course" },
  { label: "Competency", value: "Competency" },
];
certificateFilterRoot.innerHTML = certificateFilters
  .map(
    (filter, index) =>
      `<button type="button" class="certificate-filter${index === 0 ? " is-active" : ""}" data-certificate-filter="${filter.value}" aria-pressed="${index === 0}">${filter.label}</button>`,
  )
  .join("");

function renderCertificates(filter = "All") {
  const visibleCertificates = certificates.filter(
    (certificate) => filter === "All" || certificate.group === filter,
  );
  certificateRoot.innerHTML = visibleCertificates
    .map((certificate, index) => {
      const originalIndex = certificates.indexOf(certificate);
      return `
    <article class="certificate-card reveal" style="--reveal-delay:${index * 75}ms"><div class="certificate-art certificate-art-image"><img src="${escapeHtml(certificateFileUrl(certificate.cover))}" alt="Cover ${escapeHtml(certificate.title)}" loading="lazy" decoding="async"></div>
      <div class="certificate-copy"><span class="certificate-status">${escapeHtml(certificate.group)}</span><h3>${escapeHtml(certificate.title)}</h3><p>${escapeHtml(certificate.issuer)}${certificate.date ? ` · ${escapeHtml(certificate.date)}` : ""}${certificate.category ? ` · ${escapeHtml(certificate.category)}` : ""}</p></div>
      <div class="certificate-actions"><button type="button" class="certificate-view" data-certificate-view="${originalIndex}">Preview</button></div></article>`;
    })
    .join("");
  observeReveals();
}
renderCertificates();
certificateFilterRoot.addEventListener("click", (event) => {
  const button = event.target.closest("[data-certificate-filter]");
  if (!button) return;
  certificateFilterRoot.querySelectorAll("[data-certificate-filter]").forEach((filter) => {
    const active = filter === button;
    filter.classList.toggle("is-active", active);
    filter.setAttribute("aria-pressed", String(active));
  });
  renderCertificates(button.dataset.certificateFilter);
});
certificateRoot.addEventListener("click", (event) => {
  const button = event.target.closest("[data-certificate-view]");
  if (!button) return;
  const certificate = certificates[Number(button.dataset.certificateView)];
  const url = certificateFileUrl(certificate.file);
  const isPdf = certificate.file.toLowerCase().endsWith(".pdf");
  certificatePreview.innerHTML = isPdf
    ? `<iframe class="certificate-pdf" src="${escapeHtml(url)}#toolbar=0&navpanes=0" title="${escapeHtml(certificate.title)}"></iframe>`
    : `<img class="certificate-image-preview" src="${escapeHtml(url)}" alt="${escapeHtml(certificate.title)}">`;
  certificateDialog.querySelector(".certificate-dialog-title").textContent =
    certificate.title;
  certificateDialog.showModal();
});
const plannedMarkup = plannedCertifications
  .map(
    (item, index) => `
  <article class="certificate-card planned-card reveal" style="--reveal-delay:${(certificates.length + index) * 75}ms"><div class="certificate-art planned-art"><span>PLANNED<br>CERTIFICATION</span></div>
    <div><span class="certificate-status planned-status">${escapeHtml(item.status)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.issuer)} · ${escapeHtml(item.category)}</p></div></article>`,
  )
  .join("");
plannedCertificateRoot.innerHTML = plannedMarkup;

document
  .querySelectorAll("dialog .dialog-close")
  .forEach((button) =>
    button.addEventListener("click", () => button.closest("dialog").close()),
  );
document.querySelectorAll("dialog").forEach((dialog) =>
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  }),
);

const socialIcons = {
  instagram: "instagram",
  linkedin: "linkedin",
  whatsapp: "whatsapp",
  github: "github",
  gmail: "gmail",
};
document.querySelector("#social-grid").innerHTML = socialLinks
  .map(
    (link, index) => `
  <a class="social-card reveal" href="${escapeHtml(link.url)}"${link.url.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener noreferrer"'} style="--social-color:${escapeHtml(link.color)};--reveal-delay:${index * 70}ms" aria-label="${escapeHtml(link.name)} — ${escapeHtml(link.handle)}">
    <span class="social-icon" aria-hidden="true"><img src="images/social/${socialIcons[link.icon]}.svg" alt="" loading="lazy" decoding="async"></span>
    <span class="social-copy"><strong>${escapeHtml(link.name)}</strong><span class="social-handle">${escapeHtml(link.handle)}</span></span>
    <span class="social-arrow" aria-hidden="true">↗</span>
  </a>`,
  )
  .join("");

document.querySelector("#current-year").textContent = new Date().getFullYear();
initRoleTyping();
initTerminal();
initHeroParticles();
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  menuButton.setAttribute(
    "aria-label",
    expanded ? "Buka menu navigasi" : "Tutup menu navigasi",
  );
  navLinks.classList.toggle("open", !expanded);
});
navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Buka menu navigasi");
  }
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.focus();
  }
});

function observeReveals() {
  if (
    !("IntersectionObserver" in window) ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("visible"));
    return;
  }
  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal:not(.visible)")
    .forEach((el) => revealObserver.observe(el));
}
document.documentElement.classList.add("js-motion");
observeReveals();
const navAnchors = [...document.querySelectorAll(".nav-links a")];
if ("IntersectionObserver" in window) {
  const activeObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((anchor) => {
          const active = anchor.getAttribute("href") === `#${entry.target.id}`;
          anchor.classList.toggle("active", active);
          if (active) anchor.setAttribute("aria-current", "location");
          else anchor.removeAttribute("aria-current");
        });
      }),
    { rootMargin: "-25% 0px -65% 0px" },
  );
  document
    .querySelectorAll("main section[id]")
    .forEach((section) => activeObserver.observe(section));
}
