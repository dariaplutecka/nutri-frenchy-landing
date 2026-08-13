const STORAGE_KEY = "nutrifrenchy-landing-lang";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const form = document.getElementById("contact-form");
const successPanel = document.getElementById("contact-success");
const emailInput = document.getElementById("contact-email");
const messageInput = document.getElementById("contact-message");
const statusEl = document.getElementById("contact-message-status");
const submitBtn = document.getElementById("contact-submit");
const imageInput = document.getElementById("contact-image-input");
const imageToolbar = document.getElementById("contact-image-toolbar");
const imagePreview = document.getElementById("contact-image-preview");
const imageThumb = document.getElementById("contact-image-thumb");
const langButtons = document.querySelectorAll("[data-lang]");

let currentLang = "pl";
let selectedImage = null;

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
  document.title = t("contact.pageTitle");

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", t("contact.pageDescription"));

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const text = t(node.dataset.i18n);
    if (node.tagName === "TEXTAREA" || node.tagName === "INPUT") return;
    if (node.closest(".contact-icon-btn")) return;
    node.textContent = text;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const label = t(node.dataset.i18nAria);
    node.setAttribute("aria-label", label);
    node.setAttribute("title", label);
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
  setStatus("");
}

function setStatus(text, type) {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = `form-message${type ? ` ${type}` : ""}`;
}

function clearImage() {
  selectedImage = null;
  if (imageInput) imageInput.value = "";
  if (imagePreview) imagePreview.hidden = true;
  if (imageToolbar) imageToolbar.hidden = false;
  if (imageThumb) imageThumb.removeAttribute("src");
}

function showImagePreview(file) {
  selectedImage = file;
  if (imageToolbar) imageToolbar.hidden = true;
  if (imagePreview) imagePreview.hidden = false;
  if (imageThumb) {
    imageThumb.src = URL.createObjectURL(file);
  }
}

function validateImage(file) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    setStatus(t("contact.errorImageFormat"), "error");
    return false;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    setStatus(t("contact.errorImageSize"), "error");
    return false;
  }
  return true;
}

function apiBase() {
  const raw = window.LANDING_CONFIG?.apiBaseUrl;
  if (typeof raw !== "string") return "";
  return raw.replace(/\/$/, "");
}

function apiUrl(path) {
  const base = apiBase();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

function mapApiError(detail) {
  if (typeof detail === "string") {
    if (detail === "invalid_email") return t("contact.errorEmail");
    if (detail === "message_empty") return t("contact.errorEmpty");
    if (detail === "unsupported_image_format") return t("contact.errorImageFormat");
    if (detail === "file_too_large") return t("contact.errorImageSize");
    if (detail === "email_service_unavailable") return t("contact.serverError");
    return detail;
  }
  return t("contact.serverError");
}

async function handleSubmit(event) {
  event.preventDefault();
  setStatus("");

  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  if (!email || !emailInput.checkValidity()) {
    setStatus(t("contact.errorEmail"), "error");
    return;
  }
  if (!message) {
    setStatus(t("contact.errorEmpty"), "error");
    return;
  }

  submitBtn.disabled = true;
  setStatus(t("contact.sending"));

  const body = new FormData();
  body.append("email", email);
  body.append("message", message);
  if (selectedImage) body.append("image", selectedImage, selectedImage.name || "attachment.jpg");

  try {
    const response = await fetch(apiUrl("/api/contact"), {
      method: "POST",
      body,
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(mapApiError(payload.detail) || t("contact.serverError"));
    }

    form.hidden = true;
    successPanel.hidden = false;
  } catch (error) {
    setStatus(error.message || t("contact.serverError"), "error");
    submitBtn.disabled = false;
  }
}

function handleImagePick() {
  imageInput?.click();
}

function handleImageChange() {
  const file = imageInput?.files?.[0];
  if (!file) return;
  if (!validateImage(file)) {
    imageInput.value = "";
    return;
  }
  setStatus("");
  showImagePreview(file);
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLang(button.dataset.lang));
});

document.getElementById("contact-image-add")?.addEventListener("click", handleImagePick);
document.getElementById("contact-image-change")?.addEventListener("click", handleImagePick);
document.getElementById("contact-image-remove")?.addEventListener("click", clearImage);
imageInput?.addEventListener("change", handleImageChange);
form?.addEventListener("submit", (event) => void handleSubmit(event));

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

setLang(resolveInitialLang());
