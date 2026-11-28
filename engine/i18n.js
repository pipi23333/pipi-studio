'use strict';
const PipiI18n = (function createI18n(messages) {
  const valid = (x) => ['es', 'en', 'zh'].includes(x);
  let language = 'es',
    staticNodes = [],
    attributes = [],
    dynamic = new Map(),
    listeners = [],
    mounted = false;
  const locale = () => ({ es: 'es-ES', en: 'en-GB', zh: 'zh-CN' })[language];
  // Keys are independent of every locale's wording. Unknown keys fail visibly.
  const parameters = (text) =>
    [...new Set([...text.matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g)].map((m) => m[1]))].sort();
  function hasTranslation(key, lang) {
    return (
      Object.hasOwn(messages, key) &&
      typeof messages[key][lang] === 'string' &&
      messages[key][lang].trim().length > 0
    );
  }
  function message(key, params = {}) {
    return { key, params };
  }
  function enumMessage(namespace, value) {
    const allowed = {
      source: ['pending', 'illustrative', 'reference', 'measured'],
      surface: ['top', 'left45', 'right45', 'vertical'],
    };
    if (!allowed[namespace]?.includes(value)) throw Error('Unknown translation enum: ' + namespace);
    return message(namespace + '.' + value);
  }
  function lines(items) {
    return { items };
  }
  function render(value, lang = language) {
    if (Array.isArray(value?.items)) return value.items.map((v) => render(v, lang)).join('\n');
    if (value && typeof value === 'object' && Object.hasOwn(value, 'key'))
      return translate(value.key, value.params, lang);
    return String(value ?? '');
  }
  function translate(key, params = {}, lang = language) {
    if (!hasTranslation(key, lang)) return '[missing: ' + key + ']';
    return messages[key][lang].replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (_, name) =>
      Object.hasOwn(params, name)
        ? render(params[name], lang)
        : '[missing parameter: ' + name + ']',
    );
  }
  function errorMessage(error) {
    if (error && hasTranslation(error.message, 'es'))
      return message(error.message, error.i18nParams || {});
    return String(error?.message ?? error ?? '');
  }
  function setText(el, key, params = {}) {
    const value = typeof key === 'string' && key !== '' ? message(key, params) : key;
    dynamic.set(el, () => render(value));
    el.textContent = render(value);
  }
  function setError(el, error, withPrefix = false) {
    const value = errorMessage(error);
    const msg = withPrefix ? message('error.generic', { detail: value }) : value;
    dynamic.set(el, () => render(msg));
    el.textContent = render(msg);
  }
  function setPrice(el, amount) {
    const render = () =>
      new Intl.NumberFormat(locale(), { style: 'currency', currency: 'EUR' }).format(amount);
    dynamic.set(el, render);
    el.textContent = render();
  }
  function apply(lang) {
    if (!valid(lang)) throw Error('Unsupported language');
    language = lang;
    for (const [el, key] of staticNodes) el.textContent = translate(key);
    for (const [el, attr, key] of attributes) el.setAttribute(attr, translate(key));
    for (const [el, render] of dynamic) {
      if (el.isConnected === false) {
        dynamic.delete(el);
        continue;
      }
      el.textContent = render();
    }
    for (const fn of listeners) fn(lang);
  }
  function chooseInitial(search, storage) {
    const q = String(search || '').match(/(?:^|[?&])lang=(es|en|zh)(?:&|$)/)?.[1];
    if (valid(q)) return q;
    try {
      const saved = storage?.getItem('pipi-language');
      if (valid(saved)) return saved;
    } catch {}
    return null;
  }
  // Browser preference is a recommendation, never an explicit saved choice.
  function recommendLanguage(navigator = {}) {
    for (const tag of [navigator.language, ...(navigator.languages || [])]) {
      const language = typeof tag === 'string' ? tag.toLowerCase().split(/[-_]/)[0] : '';
      if (valid(language)) return language;
    }
    return 'es';
  }
  function mount(doc, platform) {
    if (mounted) return;
    mounted = true;
    const gate = doc.getElementById('languageGate'),
      switcher = doc.getElementById('languageSwitch'),
      cancel = doc.getElementById('languageCancel');
    const page = [...doc.querySelectorAll('body > header, body > main, body > footer')];
    const recommendation = doc.getElementById('languageRecommendation');
    function setBackgroundHidden(hidden) {
      for (const el of page) {
        el.inert = hidden;
        if (hidden) el.setAttribute('aria-hidden', 'true');
        else el.removeAttribute('aria-hidden');
      }
    }
    staticNodes = [...doc.querySelectorAll('[data-i18n]')].map((el) => [
      el,
      el.getAttribute('data-i18n'),
    ]);
    for (const attr of ['aria-label', 'alt', 'placeholder', 'title'])
      for (const el of doc.querySelectorAll('[data-i18n-' + attr + ']'))
        attributes.push([el, attr, el.getAttribute('data-i18n-' + attr)]);
    let selected = false,
      previousFocus = null;
    const buttons = [...gate.querySelectorAll('[data-language]')];
    function close() {
      gate.hidden = true;
      doc.body.removeAttribute('data-language-pending');
      setBackgroundHidden(false);
      if (previousFocus?.isConnected && previousFocus !== doc.body) previousFocus.focus();
      else switcher.focus();
    }
    function open() {
      previousFocus = doc.activeElement;
      gate.hidden = false;
      cancel.hidden = !selected;
      doc.body.setAttribute('data-language-pending', '');
      for (const b of buttons) {
        if (b.dataset.language === language) b.setAttribute('data-recommended', '');
        else b.removeAttribute('data-recommended');
      }
      recommendation.hidden = selected;
      recommendation.textContent = translate('language.recommendation');
      recommendation.lang = language === 'zh' ? 'zh-CN' : language;
      buttons.find((b) => b.dataset.language === language)?.focus();
      setBackgroundHidden(true);
    }
    function select(lang) {
      selected = true;
      try {
        platform.localStorage.setItem('pipi-language', lang);
      } catch {}
      try {
        const u = new URL(platform.location.href);
        u.searchParams.set('lang', lang);
        platform.history.replaceState(null, '', u.href);
      } catch {}
      apply(lang);
      close();
    }
    listeners.push((lang) => {
      doc.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
      switcher.textContent = translate('language.switch');
      for (const a of doc.querySelectorAll(
        'a[href="index.html"], a[href="color-lab.html"], a[data-language-link]',
      )) {
        const href = a.dataset.languageLink || a.getAttribute('href').split('?')[0];
        a.dataset.languageLink = href;
        a.setAttribute('href', href + '?lang=' + lang);
      }
    });
    buttons.forEach((b) => b.addEventListener('click', () => select(b.dataset.language)));
    switcher.addEventListener('click', open);
    cancel.addEventListener('click', close);
    gate.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && selected) {
        e.preventDefault();
        close();
      }
      if (e.key === 'Tab') {
        const focusable = [...buttons, ...(selected ? [cancel] : [])],
          i = focusable.indexOf(doc.activeElement),
          next = (i + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
        e.preventDefault();
        focusable[next].focus();
      }
    });
    let storage;
    try {
      storage = platform.localStorage;
    } catch {}
    const initial = chooseInitial(platform.location.search, storage);
    if (initial) {
      selected = true;
      apply(initial);
      close();
    } else {
      apply(recommendLanguage(platform.navigator));
      open();
    }
  }
  return {
    translate,
    message,
    enumMessage,
    lines,
    errorMessage,
    setError,
    parameters,
    catalog: messages,
    setText,
    setPrice,
    apply,
    locale,
    chooseInitial,
    recommendLanguage,
    hasTranslation,
    mount,
  };
})(typeof module !== 'undefined' ? require('./messages.js') : PipiMessages);
if (typeof module !== 'undefined') module.exports = PipiI18n;
if (typeof document !== 'undefined' && typeof window !== 'undefined')
  PipiI18n.mount(document, window);
