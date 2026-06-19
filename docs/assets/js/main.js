const navButton = document.querySelector(".nav-toggle");
const body = document.body;
const CONTACTS = {
  telegram: "https://t.me/coach_nikulina_alla",
  vk: "https://vk.com/coach_nikulina_alla",
  vkBusiness: "https://vk.com/neurocoach_nikulina"
};

const typographyScope = "h1, h2, h3, p, li, summary, .btn, .tag, .brand span";
const shortWordsPattern = /(^|[\s(])([А-Яа-яЁёA-Za-z]{1,2})\s+(?=[А-Яа-яЁёA-Za-z0-9])/g;

document.querySelectorAll(typographyScope).forEach((element) => {
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.nodeValue = node.nodeValue.replace(shortWordsPattern, "$1$2\u00a0");
    }
  });
});

const headerContacts = document.createElement("div");
headerContacts.className = "header-contacts";
headerContacts.innerHTML = `
  <a class="icon-link" href="${CONTACTS.telegram}" aria-label="Telegram Аллы Никулиной">TG</a>
  <a class="icon-link" href="${CONTACTS.vk}" aria-label="VK Аллы Никулиной">VK</a>
`;

const nav = document.querySelector(".nav");
if (nav && !document.querySelector(".header-contacts")) {
  nav.insertBefore(headerContacts, navButton || null);
}

if (navButton) {
  navButton.addEventListener("click", () => {
    body.classList.toggle("nav-open");
    navButton.setAttribute("aria-expanded", body.classList.contains("nav-open"));
  });
}

document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", () => body.classList.remove("nav-open"));
});

const revealItems = document.querySelectorAll("[data-reveal]");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

const modal = document.createElement("div");
modal.className = "modal";
modal.id = "contact-form";
modal.innerHTML = `
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="contact-title">
    <button class="modal-close" type="button" aria-label="Закрыть">×</button>
    <div class="eyebrow">Заявка</div>
    <h2 id="contact-title">Начать со знакомства</h2>
    <p class="lead">Оставьте имя и удобный контакт. Ключевой запрос можно описать коротко или пропустить.</p>
    <form class="contact-form">
      <label>Имя
        <input name="name" autocomplete="name" required>
      </label>
      <label>Контакт для связи
        <input name="contact" autocomplete="email" placeholder="Telegram, телефон или email" required>
      </label>
      <label>Ключевой запрос
        <textarea name="request" placeholder="Необязательно"></textarea>
      </label>
      <button class="btn primary" type="submit">Отправить в Telegram</button>
      <p class="micro form-note">После отправки откроется Telegram. Если текст не подставится автоматически, вставьте скопированное сообщение в чат.</p>
    </form>
  </div>
`;
document.body.appendChild(modal);

const openModal = () => {
  modal.classList.add("is-open");
  body.classList.remove("nav-open");
  const firstInput = modal.querySelector("input");
  if (firstInput) firstInput.focus();
};

const closeModal = () => modal.classList.remove("is-open");

document.querySelectorAll(".js-open-form, a[href='#contact-form']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openModal();
  });
});

modal.addEventListener("click", (event) => {
  if (event.target === modal || event.target.closest(".modal-close")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

const form = modal.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const message = [
      "Здравствуйте, Алла. Хочу записаться на сессию-знакомство.",
      `Имя: ${data.get("name") || ""}`,
      `Контакт: ${data.get("contact") || ""}`,
      `Ключевой запрос: ${data.get("request") || "не указан"}`
    ].join("\n");

    try {
      await navigator.clipboard.writeText(message);
    } catch (error) {
      // Clipboard can be blocked in some browsers; Telegram still opens.
    }

    window.open(CONTACTS.telegram, "_blank", "noopener");
    form.reset();
    closeModal();
  });
}
