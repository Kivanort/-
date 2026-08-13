/** Header: бургер, локализация, заглушки ссылок */
(function () {
  const burger = document.getElementById("burger-btn");
  const mobile = document.getElementById("mobile-menu");
  const localeBtn = document.getElementById("locale-btn");
  const localeDrop = document.getElementById("locale-drop");
  const localeWrap = document.getElementById("locale-wrap");

  document.querySelectorAll("[data-stub]").forEach((el) => {
    el.addEventListener("click", (e) => e.preventDefault());
  });

  burger?.addEventListener("click", () => {
    const open = mobile.hidden;
    mobile.hidden = !open;
    burger.classList.toggle("site-header__burger--open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  localeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = localeDrop.hidden;
    localeDrop.hidden = !open;
    localeBtn.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (e) => {
    if (localeWrap && !localeWrap.contains(e.target)) {
      localeDrop.hidden = true;
      localeBtn?.setAttribute("aria-expanded", "false");
    }
  });
})();
