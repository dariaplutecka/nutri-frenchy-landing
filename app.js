document.getElementById("year").textContent = String(new Date().getFullYear());

const STORAGE_KEY = "nutrifrenchy-landing-lang";
const betaForm = document.getElementById("beta-form");
const betaMessage = document.getElementById("beta-message");
const appStoreLink = document.getElementById("app-store-link");
const langButtons = document.querySelectorAll("[data-lang]");
const isArticlesIndex = window.location.pathname.replace(/\/$/, "") === "/articles";

let currentLang = "pl";

function resolveInitialLang() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("lang");
  if (fromQuery === "pl" || fromQuery === "en") return fromQuery;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "pl" || stored === "en") return stored;

  const browser = (navigator.language || "pl").toLowerCase();
  return browser.startsWith("pl") ? "pl" : "en";
}

function t(key) {
  const parts = key.split(".");
  let value = LandingI18n[currentLang];
  for (const part of parts) {
    value = value?.[part];
  }
  return typeof value === "string" ? value : "";
}

function applyTranslations() {
  document.documentElement.lang = currentLang;

  const pageTitle = isArticlesIndex ? t("articles.pageTitle") : t("meta.title");
  const pageDescription = isArticlesIndex ? t("articles.pageDescription") : t("meta.description");

  if (pageTitle) document.title = pageTitle;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && pageDescription) {
    metaDescription.setAttribute("content", pageDescription);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');

  if (ogTitle && pageTitle) ogTitle.setAttribute("content", pageTitle);
  if (ogDescription && pageDescription) ogDescription.setAttribute("content", pageDescription);
  if (twitterTitle && pageTitle) twitterTitle.setAttribute("content", pageTitle);
  if (twitterDescription && pageDescription) twitterDescription.setAttribute("content", pageDescription);

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLang;
    button.classList.toggle("lang-btn--active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function setLang(lang) {
  if (lang !== "pl" && lang !== "en") return;
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations();
  setMessage("");
}

function setMessage(text, type) {
  if (!betaMessage) return;
  betaMessage.textContent = text;
  betaMessage.className = `form-message${type ? ` ${type}` : ""}`;
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLang(button.dataset.lang));
});

if (betaForm) {
  betaForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("");

    const emailInput = document.getElementById("beta-email");
    const email = emailInput.value.trim();

    if (!email || !emailInput.checkValidity()) {
      setMessage(t("form.invalidEmail"), "error");
      return;
    }

    const submitButton = betaForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    setMessage(t("form.saving"));

    try {
      const response = await fetch("/api/beta/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.detail || t("form.serverError"));
      }

      const message = payload.already_registered ? t("form.successAgain") : t("form.success");

      setMessage(message, "success");
      betaForm.reset();
    } catch (error) {
      setMessage(error.message || t("form.error"), "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

async function loadStoreLinks() {
  try {
    const response = await fetch("/api/landing/config");
    if (!response.ok) return;

    const config = await response.json();

    if (config.app_store_url && appStoreLink) {
      appStoreLink.href = config.app_store_url;
      appStoreLink.hidden = false;
    }
  } catch {
    // Brak linku — przycisk zostaje ukryty do publikacji landera.
  }
}

setLang(resolveInitialLang());
loadStoreLinks();
