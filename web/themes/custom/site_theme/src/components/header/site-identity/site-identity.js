(function (Drupal, once) {
  "use strict";

  const STORAGE_KEY = "site_theme_title_loaded";
  const EXPIRATION_MINUTES = 10;

  /**
   * Check whether the visitor arrived from outside this website.
   */
  function isExternalVisit() {
    if (!document.referrer) {
      return true;
    }

    try {
      const referrer = new URL(document.referrer);

      return referrer.origin !== window.location.origin;
    } catch (error) {
      return true;
    }
  }

  /**
   * Determine whether the site title animation should play.
   *
   * Based on ASU Unity's first-load behavior.
   */
  function shouldAnimateTitle() {
    const now = Date.now();

    // Avoid replaying the animation during internal navigation.
    if (!isExternalVisit()) {
      return false;
    }

    try {
      const expiration = Number(window.localStorage.getItem(STORAGE_KEY));

      // Don't replay until the 10-minute period expires.
      if (Number.isFinite(expiration) && expiration > now) {
        return false;
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        String(now + EXPIRATION_MINUTES * 60 * 1000),
      );
    } catch (error) {
      // Allow the animation if browser storage is unavailable.
    }

    return true;
  }

  /**
   * Attach the site title entrance animation.
   */
  Drupal.behaviors.siteIdentityHighlight = {
    attach(context) {
      once(
        "site-identity-highlight",
        ".site-identity__highlight",
        context,
      ).forEach((element) => {
        // Respect the visitor's reduced-motion preference.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          return;
        }

        if (!shouldAnimateTitle()) {
          return;
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            element.classList.add("active");
          });
        });
      });
    },
  };
})(Drupal, once);
