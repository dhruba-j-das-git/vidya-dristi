(() => {
  const ENROLL_CODE = "ADRE3.0Batch1";
  const CLASSROOM_URL = "https://classroom.google.com/c/ODM1MzMzMDQyOTUy";

  const modal = document.querySelector("[data-modal]");
  const openButtons = document.querySelectorAll("[data-open-enroll]");
  const closeButtons = document.querySelectorAll("[data-close-enroll]");
  const form = document.querySelector("[data-enroll-form]");
  const codeInput = document.getElementById("enroll-code");
  const errorEl = document.querySelector("[data-enroll-error]");

  if (!modal || !form || !codeInput || !errorEl) return;

  let lastFocusedEl = null;

  const setError = (message) => {
    errorEl.textContent = message;
  };

  const clearError = () => {
    setError("");
  };

  const isModalOpen = () => modal.getAttribute("aria-hidden") === "false";

  const getFocusable = () => {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    return Array.from(modal.querySelectorAll(selectors.join(","))).filter(
      (el) => el.offsetParent !== null
    );
  };

  const openModal = () => {
    if (isModalOpen()) return;

    lastFocusedEl = document.activeElement;
    clearError();
    codeInput.value = "";

    document.body.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");

    window.requestAnimationFrame(() => {
      codeInput.focus();
    });

    document.addEventListener("keydown", onKeyDown);
  };

  const closeModal = () => {
    if (!isModalOpen()) return;

    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onKeyDown);

    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  };

  const onKeyDown = (event) => {
    if (!isModalOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  openButtons.forEach((btn) => btn.addEventListener("click", openModal));
  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

  modal.addEventListener("click", (event) => {
    if (!isModalOpen()) return;

    const dialog = modal.querySelector(".modal-dialog");
    if (!dialog) return;

    if (!dialog.contains(event.target)) closeModal();
  });

  codeInput.addEventListener("input", () => {
    if (errorEl.textContent) clearError();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const raw = codeInput.value;
    const code = raw.trim();

    if (!code) {
      setError("Please enter the enrollment code.");
      codeInput.focus();
      return;
    }

    if (code !== ENROLL_CODE) {
      setError(
        "That code doesn’t match. Please check the spelling (case-sensitive) and try again."
      );
      codeInput.select();
      return;
    }

    setError("Redirecting to Google Classroom…");

    window.setTimeout(() => {
      window.location.assign(CLASSROOM_URL);
    }, 350);
  });

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  const showAll = () => {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
})();
