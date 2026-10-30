import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../src/data/projects.js";
import { skillGroups, skillLevels } from "../src/data/skills.js";
import {
  certificates,
  plannedCertifications,
} from "../src/data/certificates.js";
import { socialLinks } from "../src/data/socialLinks.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const html = readFileSync(join(root, "index.html"), "utf8");
const app = readFileSync(join(root, "src/main.js"), "utf8");

assert.ok(
  app.indexOf("let revealObserver;") < app.indexOf("renderProjects();"),
  "The reveal observer must be initialized before the first project render.",
);

assert.equal(projects.length, 8, "Expected all eight named projects.");
for (const project of projects) {
  assert.ok(
    existsSync(join(root, project.image)),
    `Missing project image: ${project.image}`,
  );
  assert.ok(
  ["Web", "Desktop", "Games", "Automation"].includes(project.filter),
    `Unknown filter: ${project.filter}`,
  );
}
assert.deepEqual(
  projects.find((project) => project.title === "For Mother")?.technologies,
  ["JavaScript", "HTML5", "CSS3"],
);
assert.deepEqual(
  projects.find((project) => project.title.startsWith("Silent Evidence"))
    ?.technologies,
  ["JavaScript", "HTML5", "CSS3"],
);
assert.deepEqual(
  projects.find((project) => project.title === "WhatsApp Bot")?.technologies,
  ["Node.js", "Visual Studio Code"],
);
assert.deepEqual(
  ["Blog Pribadi", "Google Offices", "Website Nilai Raport"].map((title) =>
    projects.find((project) => project.title === title)?.technologies,
  ),
  [
    ["Python", "Django", "MySQL"],
    ["Flutter", "Dart"],
    ["PHP", "Laravel", "MySQL"],
  ],
);
assert.deepEqual(
  ["Web", "Desktop", "Games", "Automation"].map(
    (category) =>
      projects.filter((project) => project.filter === category).length,
  ),
  [4, 1, 2, 1],
  "Project filters should return the expected categories.",
);
assert.equal(projects.find((project) => project.title === "Google Offices")?.filter, "Web");
for (const title of ["Blog Pribadi", "Google Offices", "Website Nilai Raport"]) {
  assert.ok(projects.find((project) => project.title === title)?.features?.length,
    `Expected approved feature specs for ${title}.`);
}
assert.ok(skillLevels.length >= 7, "Expected the added core skill entry.");
assert.equal(skillGroups.length, 4, "Expected four skill categories.");
const techStack = skillGroups.flatMap((group) => group.items);
assert.ok(
  techStack.includes("Java") &&
    techStack.includes("NetBeans") &&
    techStack.includes("Django") &&
    techStack.includes("draw.io"),
);
for (const logo of ["java.svg", "netbeans.svg", "django.svg", "drawio.svg"]) {
  assert.ok(existsSync(join(root, "images/skills", logo)), `Missing logo: ${logo}`);
}
assert.equal(certificates.length, 7, "Expected seven original certificates.");
assert.deepEqual(
  ["Course", "Competency"].map(
    (group) => certificates.filter((certificate) => certificate.group === group).length,
  ),
  [4, 3],
  "Expected Dicoding courses and Neo One/Clevio competency certificates in separate groups.",
);
assert.deepEqual(
  certificates.slice(2, 4).map(({ title, group, credentialId }) => ({ title, group, credentialId })),
  [
    { title: "Prompt Engineering untuk Software Developer", group: "Course", credentialId: "6RPNOY915X2M" },
    { title: "Belajar Dasar AI", group: "Course", credentialId: "07Z6Q470MZQR" },
  ],
);
for (const certificate of certificates) {
  assert.ok(["Course", "Competency"].includes(certificate.group));
  assert.ok(
    existsSync(join(root, certificate.cover)),
    `Missing certificate cover: ${certificate.cover}`,
  );
assert.ok(
  skillGroups.some(
    (group) =>
      group.title.includes("Framework") && group.items.includes("Django"),
  ),
  "Django should appear in the framework category.",
);
assert.ok(
  skillGroups.some(
    (group) => group.title.includes("Tools") && group.items.includes("draw.io"),
  ),
  "draw.io should appear in the tools category.",
);
  assert.ok(
    certificate.file.startsWith("sertifikat/"),
    `Certificate must link to sertifikat/: ${certificate.file}`,
  );
  assert.ok(
    existsSync(join(root, certificate.file)),
    `Missing original certificate: ${certificate.file}`,
  );
}
assert.ok(
  plannedCertifications.length > 0 &&
    plannedCertifications.every((item) => item.status === "Planned"),
);
assert.deepEqual(
  socialLinks.map((item) => item.url),
  [
    "https://www.instagram.com/navervan/",
    "https://www.linkedin.com/in/revan-oknanda-8950413a6/",
    "https://wa.me/628111977041",
    "https://github.com/Reclaeri",
    "mailto:revanoknanda62@gmail.com",
  ],
);
for (const id of [
  "home",
  "about",
  "services",
  "skills",
  "projects",
  "certificates",
  "social",
]) {
  assert.ok(html.includes(`id="${id}"`), `Missing section anchor: ${id}`);
}
assert.ok(
  !app.includes("data-project-details") && !html.includes('class="project-dialog"'),
  "Project details modal should be removed.",
);
assert.ok(
  !app.includes("data-certificate-original") &&
    !app.includes("certificate-original") &&
    !html.includes("certificate-dialog-original"),
  "Certificate original-file links should be removed.",
);
assert.ok(
  app.includes("aria-pressed"),
  "Project filter buttons should expose state to assistive technology.",
);
assert.ok(
  app.includes("technology-category-title"),
  "Technology stack categories should be rendered visibly.",
);
assert.ok(html.includes('id="skill-level-count"'));
assert.ok(app.includes('String(skillLevels.length).padStart(2, "0")'));

console.log(
  "Portfolio verification passed: sections, eight local project images, categorized technology logos, project filters, certificate previews, original certificates, and social URLs.",
);
