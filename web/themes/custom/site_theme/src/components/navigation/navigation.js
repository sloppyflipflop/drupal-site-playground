(function (Drupal, once) {
  Drupal.behaviors.siteNavigation = {
    attach(context) {
      once("site-navigation", ".navigation__list", context).forEach((menu) => {
        const mobileQuery = window.matchMedia("(max-width: 1260px)");

        const toggles = Array.from(
          menu.querySelectorAll(".navigation__toggle"),
        );

        function setOpen(button, open) {
          const submenu = document.getElementById(
            button.getAttribute("aria-controls"),
          );

          if (!submenu) return;

          button.setAttribute("aria-expanded", String(open));
          button.setAttribute(
            "aria-label",
            `${open ? "Collapse" : "Expand"} submenu for ${
              button
                .closest(".navigation__item-row")
                ?.querySelector(".navigation__link")
                ?.textContent.trim() || "navigation"
            }`,
          );

          submenu.hidden = !open;
        }

        function closeAll(except = null) {
          toggles.forEach((button) => {
            if (button !== except) {
              setOpen(button, false);
            }
          });
        }

        toggles.forEach((button) => {
          button.addEventListener("click", () => {
            const currentlyOpen =
              button.getAttribute("aria-expanded") === "true";

            const parentItem = button.closest(".navigation__item");
            const ancestorToggles = [];

            let ancestor =
              parentItem?.parentElement?.closest(".navigation__item");

            while (ancestor && menu.contains(ancestor)) {
              const ancestorToggle = ancestor.querySelector(
                ":scope > .navigation__item-row > .navigation__toggle",
              );

              if (ancestorToggle) {
                ancestorToggles.push(ancestorToggle);
              }

              ancestor = ancestor.parentElement?.closest(".navigation__item");
            }

            closeAll(button);

            ancestorToggles.forEach((ancestorToggle) => {
              setOpen(ancestorToggle, true);
            });

            setOpen(button, !currentlyOpen);
          });
        });

        menu.addEventListener("keydown", (event) => {
          if (event.key !== "Escape") return;

          const openButtons = toggles.filter(
            (button) => button.getAttribute("aria-expanded") === "true",
          );

          if (!openButtons.length) return;

          const currentSubmenu = event.target.closest(".navigation__submenu");

          const matchingToggle = currentSubmenu
            ? toggles.find(
                (button) =>
                  button.getAttribute("aria-controls") === currentSubmenu.id,
              )
            : openButtons[openButtons.length - 1];

          if (matchingToggle) {
            event.preventDefault();
            event.stopPropagation();
            setOpen(matchingToggle, false);
            matchingToggle.focus();
          }
        });

        document.addEventListener("pointerdown", (event) => {
          if (!menu.contains(event.target)) {
            closeAll();
          }
        });

        menu.addEventListener("focusout", (event) => {
          if (!mobileQuery.matches && !menu.contains(event.relatedTarget)) {
            closeAll();
          }
        });

        mobileQuery.addEventListener("change", () => {
          closeAll();
        });
      });
    },
  };
})(Drupal, once);
