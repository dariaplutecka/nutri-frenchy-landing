/** Oznacza aktywną pozycję w globalnym menu nawigacji. */
(function markActiveNav() {
  function update() {
    const path = window.location.pathname.replace(/\/$/, "") || "/";

    document.querySelectorAll(".header-nav [data-nav]").forEach((link) => {
      const key = link.dataset.nav;
      let active = false;

      if (key === "articles") {
        active = path === "/articles" || path.startsWith("/articles/");
      } else if (key === "contact") {
        active = path === "/contact";
      } else if (key === "features") {
        active = path === "/" && window.location.hash === "#features";
      }

      link.classList.toggle("nav-link--active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  update();
  window.addEventListener("hashchange", update);
})();

/** Ustawia link App Store na wszystkich przyciskach „Pobierz”. */
(function initStoreLinks() {
  function apiBase() {
    const raw = window.LANDING_CONFIG?.apiBaseUrl;
    if (typeof raw !== "string") return "";
    return raw.replace(/\/$/, "");
  }

  async function resolveAppStoreUrl() {
    const fromConfig = window.LANDING_CONFIG?.appStoreUrl;
    if (typeof fromConfig === "string" && fromConfig.trim()) {
      return fromConfig.trim();
    }

    try {
      const response = await fetch(`${apiBase()}/api/landing/config`);
      if (!response.ok) return "";

      const config = await response.json();
      return typeof config.app_store_url === "string" ? config.app_store_url.trim() : "";
    } catch {
      return "";
    }
  }

  function applyStoreUrl(url) {
    document.querySelectorAll("[data-app-store-link]").forEach((link) => {
      link.href = url;
      link.hidden = false;
      link.removeAttribute("hidden");
      link.removeAttribute("aria-disabled");
    });
  }

  void resolveAppStoreUrl().then((url) => {
    if (url) applyStoreUrl(url);
  });
})();
