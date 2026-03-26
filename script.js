const state = {
  lang: localStorage.getItem("lang") || "en"
};

let observer = null;

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
  if (keywords) {
    keywords.innerHTML = data.heroKeywords
      .map((item) => `<span class="keyword-chip">${item}</span>`)
      .join("");
  }

  const quickInfo = document.getElementById("heroQuickInfo");
  if (quickInfo) {
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
}

function renderAbout(data) {
  const html = data.aboutParagraphs.map((p) => `<p>${p}</p>`).join("");
  setHTML("#aboutText", html);
}

function renderNews(data) {
  const list = document.getElementById("newsList");
  if (!list) return;

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
  if (!container) return;

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
  if (!topics) return;

  topics.innerHTML = data.researchTopics
    .map((item) => `<span class="chip">${item}</span>`)
    .join("");
}

function renderPublications(data) {
  const container = document.getElementById("publicationsList");
  if (!container) return;

  container.innerHTML = data.publications
    .map((pub) => {
      const links = (pub.links || [])
        .map((link) => `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`)
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
  if (!container) return;

  container.innerHTML = data.projects
    .map((project) => {
      const tags = (project.tags || [])
        .map((tag) => `<span class="chip">${tag}</span>`)
        .join("");

      const links = (project.links || [])
        .map((link) => `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`)
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
  if (!container) return;

  container.innerHTML = data.contactItems
    .map(
      (item) => `
        <a class="contact-item" href="${item.url}" target="_blank" rel="noopener">
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

function setupObserver() {
  if (observer) observer.disconnect();

  const targets = document.querySelectorAll(".fade-in");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("show"));
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px"
    }
  );

  targets.forEach((el) => {
    el.classList.remove("show");
    observer.observe(el);
  });
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

  requestAnimationFrame(() => {
    setupObserver();
  });
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

  if (!menuBtn || !nav) return;

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function init() {
  setupLanguageButtons();
  setupMobileMenu();
  renderAll();
}

window.addEventListener("DOMContentLoaded", init);
