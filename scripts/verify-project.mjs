import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../src/data/projects.js";
import { skillGroups } from "../src/data/skills.js";
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

assert.equal(projects.length, 5, "Expected all five named projects.");
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
  ["Web", "Desktop", "Games", "Automation"].map(
    (category) =>
      projects.filter((project) => project.filter === category).length,
  ),
  [1, 1, 2, 1],
  "Project filters should return the expected categories.",
);
assert.equal(skillGroups.length, 4, "Expected four skill categories.");
assert.equal(certificates.length, 5, "Expected five original certificates.");
for (const certificate of certificates) {
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

console.log(
  "Portfolio verification passed: sections, local covers, filters, certificate previews, five original certificates, planned certifications, and social URLs.",
);
