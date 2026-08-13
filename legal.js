const STORAGE_KEY = "nutrifrenchy-landing-lang";

function resolveInitialLang() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("lang");
  if (fromQuery === "pl" || fromQuery === "en") return fromQuery;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "pl" || stored === "en") return stored;

  const browser = (navigator.language || "pl").toLowerCase();
  return browser.startsWith("pl") ? "pl" : "en";
}

function t(lang, key) {
  const parts = key.split(".");
  let value = LandingI18n[lang];
  for (const part of parts) {
    value = value?.[part];
  }
  return typeof value === "string" ? value : "";
}

function homeHref(lang) {
  return lang === "en" ? "/?lang=en" : "/";
}

function applyLegalLang(lang) {
  if (lang !== "pl" && lang !== "en") return;

  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-lang-section]").forEach((section) => {
    section.hidden = section.dataset.langSection !== lang;
  });

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(lang, node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(lang, node.dataset.i18nAria));
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("lang-btn--active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  const brand = document.querySelector(".brand");
  if (brand) brand.href = homeHref(lang);

  const breadcrumbHome = document.querySelector(".legal-header .breadcrumb a");
  if (breadcrumbHome) breadcrumbHome.href = homeHref(lang);

  const page = document.body.dataset.legalPage;
  if (page === "privacy") {
    document.title = `${t(lang, "legal.privacyTitle")} - Nutri Frenchy`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t(lang, "legal.privacyDescription"));
  } else if (page === "terms") {
    document.title = `${t(lang, "legal.termsTitle")} - Nutri Frenchy`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t(lang, "legal.termsDescription"));
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => applyLegalLang(button.dataset.lang));
});

applyLegalLang(resolveInitialLang());
