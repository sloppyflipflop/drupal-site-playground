(function (Drupal, once) {
  Drupal.behaviors.siteHeader = {
    attach(context) {
      once("site-header", ".site-header", context).forEach((header) => {
        const toggle = header.querySelector(".site-header__toggle");
        const navigation = header.querySelector(".site-header__navigation");
        const mediaQuery = window.matchMedia("(max-width: 1260px)");

        function updateHeaderHeight() {
          document.documentElement.style.setProperty(
            "--site-header-height",
            `${header.getBoundingClientRect().height}px`,
          );
        }

        function setExpanded(expanded) {
          if (!toggle || !navigation) return;

          toggle.setAttribute("aria-expanded", String(expanded));
          navigation.classList.toggle("is-open", expanded);
          updateHeaderHeight();
        }

        toggle?.addEventListener("click", () => {
          setExpanded(toggle.getAttribute("aria-expanded") !== "true");
        });

        header.addEventListener("keydown", (event) => {
          if (
            event.key === "Escape" &&
            mediaQuery.matches &&
            toggle?.getAttribute("aria-expanded") === "true"
          ) {
            setExpanded(false);
            toggle.focus();
          }
        });

        mediaQuery.addEventListener("change", () => {
          setExpanded(false);
          updateHeaderHeight();
        });

        const resizeObserver = new ResizeObserver(updateHeaderHeight);
        resizeObserver.observe(header);

        updateHeaderHeight();
      });
    },
  };
})(Drupal, once);
