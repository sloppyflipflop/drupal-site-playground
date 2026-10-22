(function (Drupal, once) {
  Drupal.behaviors.siteHeader = {
    attach(context) {
      once("site-header", ".site-header__toggle", context).forEach((button) => {
        const navigation = document.getElementById(
          button.getAttribute("aria-controls"),
        );

        if (!navigation) return;

        const mediaQuery = window.matchMedia("(max-width: 767px)");

        function setExpanded(expanded) {
          button.setAttribute("aria-expanded", String(expanded));
          navigation.classList.toggle("is-open", expanded);
        }

        button.addEventListener("click", () => {
          setExpanded(button.getAttribute("aria-expanded") !== "true");
        });

        navigation.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && mediaQuery.matches) {
            setExpanded(false);
            button.focus();
          }
        });

        mediaQuery.addEventListener("change", () => {
          setExpanded(false);
        });
      });
    },
  };
})(Drupal, once);
