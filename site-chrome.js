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
      } else if (key === "download") {
        active = path === "/" && window.location.hash === "#download";
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
