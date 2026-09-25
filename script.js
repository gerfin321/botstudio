/*
 * QUICK SETTINGS
 * Change this value to use your own Telegram contact.
 */
const TELEGRAM_USERNAME = "gerfin228";
const TELEGRAM_URL = `https://t.me/${TELEGRAM_USERNAME}`;

/*
 * PRICE CONFIGURATION
 * All calculator prices live here. Change a price once and the whole UI updates.
 */
const services = {
  bot: {
    label: "Telegram-бот",
    basePrice: 500,
    options: {
      database: { label: "База даних", price: 300 },
      profile: { label: "Особистий кабінет та профіль", price: 300 },
      catalog: { label: "Каталог товарів та послуг", price: 350 },
      cart: { label: "Кошик та оформлення замовлення", price: 400 },
      payment: { label: "Онлайн-оплата", price: 500 },
      admin: { label: "Адмін-панель", price: 500 },
      forms: { label: "Анкети та форми", price: 250 },
      broadcasts: { label: "Розсилки користувачам", price: 250 },
      referrals: { label: "Реферальна система", price: 350 },
      promo: { label: "Промокоди та знижки", price: 300 },
      moderation: { label: "Модерація контенту", price: 300 },
      publishing: { label: "Автоматична публікація в канали", price: 300 },
      media: { label: "Робота з файлами, фото та відео", price: 200 },
      ai: { label: "Інтеграція AI", price: 700 },
      hosting: { label: "Налаштування хостингу", price: 200 }
    },
    quantities: {
      api: { label: "Сторонні API", singular: "API", price: 500, max: 20 },
      languages: { label: "Додаткові мови", singular: "мова", price: 300, max: 20 }
    }
  },
  miniApp: {
    label: "Telegram Mini App",
    basePrice: 2000,
    options: {
      database: { label: "База даних", price: 400 },
      profile: { label: "Особистий кабінет та профіль", price: 400 },
      catalog: { label: "Каталог товарів та послуг", price: 500 },
      cart: { label: "Кошик та оформлення замовлення", price: 600 },
      payment: { label: "Онлайн-оплата", price: 600 },
      admin: { label: "Адмін-панель", price: 700 },
      forms: { label: "Анкети та форми", price: 300 },
      broadcasts: { label: "Розсилки користувачам", price: 300 },
      referrals: { label: "Реферальна система", price: 400 },
      promo: { label: "Промокоди та знижки", price: 350 },
      moderation: { label: "Модерація контенту", price: 400 },
      publishing: { label: "Автоматична публікація в канали", price: 350 },
      media: { label: "Робота з файлами, фото та відео", price: 250 },
      ai: { label: "Інтеграція AI", price: 700 },
      hosting: { label: "Налаштування хостингу", price: 300 },
      charts: { label: "Графіки та статистика", price: 300, miniOnly: true },
      filters: { label: "Складні фільтри й пошук", price: 300, miniOnly: true },
      interactions: { label: "Нестандартні анімації та інтерактив", price: 400, miniOnly: true }
    },
    quantities: {
      api: { label: "Сторонні API", singular: "API", price: 500, max: 20 },
      languages: { label: "Додаткові мови", singular: "мова", price: 300, max: 20 },
      pages: { label: "Додаткові сторінки", singular: "сторінка", price: 250, max: 20 }
    }
  }
};

const calculatorState = {
  format: "bot",
  selected: new Set(),
  quantities: { api: 0, languages: 0, pages: 0 }
};

const optionHelp = {
  database: "Зберігає дані користувачів, заявки, товари та іншу інформацію.",
  profile: "Дає користувачу особистий простір із даними та історією дій.",
  catalog: "Показує товари або послуги з картками й категоріями.",
  cart: "Додає позиції до кошика та формує замовлення.",
  payment: "Підключає приймання оплат через потрібну платіжну систему.",
  admin: "Дає інструменти для керування контентом, замовленнями та користувачами.",
  forms: "Збирає відповіді, заявки та інші дані за заданим сценарієм.",
  broadcasts: "Надсилає повідомлення обраним користувачам або сегментам аудиторії.",
  referrals: "Обліковує запрошення, бонуси та партнерські посилання.",
  promo: "Застосовує знижки за промокодами або правилами акції.",
  moderation: "Перевіряє та обробляє контент перед публікацією.",
  publishing: "Автоматично або за розкладом публікує дописи в каналах.",
  media: "Додає роботу з файлами, фото, відео та іншими медіа.",
  ai: "Підключає AI-моделі до сценаріїв вашого продукту.",
  hosting: "Розгортає проєкт і виконує базове налаштування середовища.",
  charts: "Показує показники та динаміку у вигляді графіків.",
  filters: "Дозволяє відбирати дані за кількома умовами або параметрами.",
  interactions: "Додає нетипову поведінку та анімації елементів інтерфейсу."
};

const quantityHelp = {
  api: "Кожен зовнішній API — окреме підключення до стороннього сервісу.",
  languages: "Додає ще одну локалізацію до інтерфейсу та сценаріїв.",
  pages: "Понад три основні сторінки, що вже входять у Mini App."
};
const elements = {
  options: document.querySelector("[data-option-list]"),
  quantities: document.querySelector("[data-quantity-list]"),
  miniInfo: document.querySelector("[data-mini-info]"),
  total: document.querySelector("[data-total-price]"),
  breakdown: document.querySelector("[data-breakdown]")
};

let shownTotal = 0;
let animationFrame = null;

function formatPrice(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${new Intl.NumberFormat("uk-UA").format(safeValue)} грн`;
}

function tooltipMarkup(description) {
  return `<span class="info-tooltip" tabindex="0" aria-label="Пояснення: ${description}">?<span class="tooltip-text" role="tooltip">${description}</span></span>`;
}
function getCurrentService() {
  return services[calculatorState.format];
}

function renderOptions() {
  const service = getCurrentService();
  elements.options.innerHTML = Object.entries(service.options)
    .map(([key, option]) => {
      const isSelected = calculatorState.selected.has(key);
      return `
        <label class="option-row">
          <input type="checkbox" data-option="${key}" ${isSelected ? "checked" : ""} />
          <span class="check-box" aria-hidden="true"></span>
          <span class="option-main"><span class="option-label">${option.label}</span>${tooltipMarkup(optionHelp[key])}</span>
          <span class="option-price">+${formatPrice(option.price)}</span>
        </label>`;
    })
    .join("");
}

function renderQuantities() {
  const service = getCurrentService();
  elements.quantities.innerHTML = Object.entries(service.quantities)
    .map(([key, quantity]) => {
      const amount = calculatorState.quantities[key] || 0;
      const total = amount * quantity.price;
      return `
        <div class="quantity-row">
          <span class="quantity-name">${quantity.label}${tooltipMarkup(quantityHelp[key])}</span>
          <div class="stepper" aria-label="${quantity.label}">
            <button type="button" data-quantity="${key}" data-change="-1" aria-label="Зменшити кількість: ${quantity.label}" ${amount === 0 ? "disabled" : ""}>−</button>
            <output aria-label="Поточна кількість: ${quantity.label}">${amount}</output>
            <button type="button" data-quantity="${key}" data-change="1" aria-label="Збільшити кількість: ${quantity.label}" ${amount >= quantity.max ? "disabled" : ""}>+</button>
          </div>
          <span class="quantity-price">${total > 0 ? `+${formatPrice(total)}` : "—"}</span>
        </div>`;
    })
    .join("");
  elements.miniInfo.hidden = calculatorState.format !== "miniApp";
}

function calculateEstimate() {
  const service = getCurrentService();
  let total = service.basePrice;
  const lines = [{ label: service.label, price: service.basePrice, base: true }];

  Object.entries(service.options).forEach(([key, option]) => {
    if (calculatorState.selected.has(key)) {
      total += option.price;
      lines.push({ label: option.label, price: option.price });
    }
  });

  Object.entries(service.quantities).forEach(([key, quantity]) => {
    const amount = Math.max(0, Math.min(quantity.max, Number(calculatorState.quantities[key]) || 0));
    calculatorState.quantities[key] = amount;
    if (amount > 0) {
      const price = amount * quantity.price;
      total += price;
      lines.push({ label: `${quantity.label} ×${amount}`, price });
    }
  });

  return { total, lines };
}

function renderEstimate() {
  const { total, lines } = calculateEstimate();
  elements.breakdown.innerHTML = lines
    .map((line) => `
      <div class="breakdown-row${line.base ? " is-base" : ""}">
        <span>${line.label}</span>
        <span>${line.base ? "" : "+"}${formatPrice(line.price)}</span>
      </div>`)
    .join("");
  elements.total.textContent = formatPrice(total);
}

function updateCalculator() {
  renderOptions();
  renderQuantities();
  renderEstimate();
}

function setFormat(format) {
  if (!services[format]) return;
  calculatorState.format = format;
  document.querySelectorAll("[data-format-option]").forEach((option) => {
    option.classList.toggle("is-selected", option.dataset.formatOption === format);
  });
  updateCalculator();
}

function setTelegramLinks() {
  document.querySelectorAll("[data-telegram-link]").forEach((link) => {
    link.href = TELEGRAM_URL;
    link.textContent = link.classList.contains("telegram-handle") ? `@${TELEGRAM_USERNAME}` : "Написати в Telegram ↗";
    if (!link.classList.contains("telegram-handle")) {
      link.innerHTML = `Написати в Telegram <span aria-hidden="true">↗</span>`;
    }
  });
}

function setupCalculatorListeners() {
  document.querySelectorAll('input[name="service-format"]').forEach((input) => {
    input.addEventListener("change", (event) => setFormat(event.target.value));
  });

  elements.options.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-option]");
    if (!checkbox) return;
    if (checkbox.checked) {
      calculatorState.selected.add(checkbox.dataset.option);
    } else {
      calculatorState.selected.delete(checkbox.dataset.option);
    }
    renderEstimate();
  });

  elements.quantities.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-quantity]");
    if (!button) return;
    const { quantity: key, change } = button.dataset;
    const config = getCurrentService().quantities[key];
    if (!config) return;
    const nextValue = (calculatorState.quantities[key] || 0) + Number(change);
    calculatorState.quantities[key] = Math.max(0, Math.min(config.max, nextValue));
    renderQuantities();
    renderEstimate();
  });
}

function setupNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });
  nav.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  });

  const navLinks = [...nav.querySelectorAll('a[href^="#"]:not(.nav-cta)')];
  const targets = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-35% 0px -58% 0px", threshold: 0 }
  );
  targets.forEach((target) => observer.observe(target));
}

function init() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
  setTelegramLinks();
  setupCalculatorListeners();
  setupNavigation();
  updateCalculator();
}

init();
