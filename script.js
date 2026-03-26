const state = {
  lang: localStorage.getItem("lang") || "en"
};

function getData() {
  return window.profileData[state.lang];
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function setHTML(selector, html) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = html;
}

function renderI18nText(data) {
  document.documentElement.lang = state.lang === "jp" ? "ja" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (data[key]) {
      el.textContent = data[key];
    }
  });
}

function renderHero(data) {
  setText("#heroName", data.heroName);
  setText("#heroTitle", data.heroTitle);
  setText("#heroAffiliation", data.heroAffiliation);
  setText("#heroDescription", data.heroDescription);

  const site = window.profileData.site;

  const avatarImage = document.getElementById("avatarImage");
  if (avatarImage) avatarImage.src = site.avatar;

  const emailBtn = document.getElementById("emailBtn");
  const cvBtn = document.getElementById("cvBtn");
  const githubBtn = document.getElementById("githubBtn");
  const scholarBtn = document.getElementById("scholarBtn");

  if (emailBtn) emailBtn.href = `mailto:${site.email}`;
  if (cvBtn) cvBtn.href = site.cv;
  if (githubBtn) githubBtn.href = site.github;
  if (scholarBtn) scholarBtn.href = site.scholar;

  const keywords = document.getElementById("heroKeywords");
  keywords.innerHTML = data.heroKeywords
    .map((item) => `<span class="keyword-chip">${item}</span>`)
    .join("");

  const quickInfo = document.getElementById("heroQuickInfo");
  quickInfo.innerHTML = data.quickInfo
    .map(
      (item) => `
        <div class="quick-info-card">
          <span class="label">${item.label}</span>
          <strong>${item.value}</strong>
        </div>
      `
    )
    .join("");
}

function renderAbout(data) {
  const html = data.aboutParagraphs.map((p) => `<p>${p}</p>`).join("");
  setHTML("#aboutText", html);
}

function renderNews(data) {
  const list = document.getElementById("newsList");
  list.innerHTML = data.news
    .map(
      (item) => `
        <li class="news-item">
          <div class="news-date">${item.date}</div>
          <div class="news-text">${item.text}</div>
        </li>
      `
    )
    .join("");
}

function renderTimeline(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = items
    .map(
      (item) => `
        <div class="timeline-item">
          <div class="timeline-period">${item.period}</div>
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-subtitle">${item.subtitle}</div>
          <div class="timeline-description">${item.description || ""}</div>
        </div>
      `
    )
    .join("");
}

function renderResearch(data) {
  setText("#researchOverview", data.researchOverview);

  const topics = document.getElementById("researchTopics");
  topics.innerHTML = data.researchTopics
    .map((item) => `<span class="chip">${item}</span>`)
    .join("");
}

function renderPublications(data) {
  const container = document.getElementById("publicationsList");
  container.innerHTML = data.publications
    .map((pub) => {
      const links = (pub.links || [])
        .map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`)
        .join("");
      return `
        <article class="pub-item">
          <div class="pub-title">${pub.title}</div>
          <div class="pub-meta">${pub.authors}<br>${pub.venue} · ${pub.year}</div>
          <div class="pub-note">${pub.note || ""}</div>
          <div class="pub-links">${links}</div>
        </article>
      `;
    })
    .join("");
}

function renderProjects(data) {
  const container = document.getElementById("projectsGrid");
  container.innerHTML = data.projects
    .map((project) => {
      const tags = (project.tags || [])
        .map((tag) => `<span class="chip">${tag}</span>`)
        .join("");

      const links = (project.links || [])
        .map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`)
        .join("");

      return `
        <article class="glass project-card fade-in">
          <div class="project-meta">${project.meta || ""}</div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="chip-list">${tags}</div>
          <div class="project-links">${links}</div>
        </article>
      `;
    })
    .join("");
}

function renderContact(data) {
  const container = document.getElementById("contactList");
  container.innerHTML = data.contactItems
    .map(
      (item) => `
        <a class="contact-item" href="${item.url}" target="_blank" rel="noopener noreferrer">
          <div>
            <div class="label">${item.label}</div>
          </div>
          <div class="value">${item.value}</div>
        </a>
      `
    )
    .join("");

  setText("#contactNote", data.contactNote);
}

function renderFooter(data) {
  setText("#footerText", data.footerText);
}

function renderAll() {
  const data = getData();

  renderI18nText(data);
  renderHero(data);
  renderAbout(data);
  renderNews(data);
  renderTimeline("educationList", data.education);
  renderTimeline("positionsList", data.positions);
  renderResearch(data);
  renderPublications(data);
  renderProjects(data);
  renderContact(data);
  renderFooter(data);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === state.lang);
  });

  observeFadeIn();
}

function setupLanguageButtons() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.lang = btn.dataset.lang;
      localStorage.setItem("lang", state.lang);
      renderAll();
    });
  });
}

function setupMobileMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function observeFadeIn() {
  const targets = document.querySelectorAll(".fade-in");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}

function init() {
  const site = window.profileData.site;
  document.getElementById("brandName").textContent = getData().heroName;
  document.getElementById("avatarImage").src = site.avatar;

  setupLanguageButtons();
  setupMobileMenu();
  renderAll();
}

window.addEventListener("DOMContentLoaded", init);
``
