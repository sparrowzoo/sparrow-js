/* Shared article enhancements. The document remains readable without JavaScript. */
(() => {
  'use strict';

  function init() {
    const article = document.getElementById('article');
    const toc = document.getElementById('article-toc');
    const tocNav = document.getElementById('toc-links');
    const progress = document.getElementById('reading-progress');
    const toast = document.getElementById('toast');
    const media = window.matchMedia ? window.matchMedia('(max-width: 760px)') : null;
    const isMobile = () => media ? media.matches : window.innerWidth <= 760;
    let toastTimer;
    let scheduled = false;
    let printState;

    function announce(message) {
      if (!toast) return;
      clearTimeout(toastTimer);
      toast.textContent = message;
      toast.hidden = false;
      toastTimer = setTimeout(() => { toast.hidden = true; }, 6000);
    }

    const headings = article ? [...article.querySelectorAll('section[id]')].flatMap(section => {
      const heading = [...section.children].map(child => {
        if (child.matches('h2, h3')) return child;
        if (child.classList.contains('section-heading')) return [...child.children].find(node => node.matches('h2, h3'));
        return null;
      }).find(Boolean);
      return heading ? [{section, heading}] : [];
    }) : [];

    if (tocNav && headings.length) {
      const fragment = document.createDocumentFragment();
      headings.forEach(({section, heading}) => {
        const link = document.createElement('a');
        const title = heading.cloneNode(true);
        title.querySelectorAll('.step, [aria-hidden="true"]').forEach(node => node.remove());
        link.href = '#' + encodeURIComponent(section.id);
        link.textContent = title.textContent.trim();
        if (heading.tagName === 'H3') link.className = 'sub';
        fragment.appendChild(link);
      });
      tocNav.replaceChildren(fragment);
    }
    const tocLinks = tocNav ? [...tocNav.querySelectorAll('a[href^="#"]')] : [];

    function updateReading() {
      scheduled = false;
      if (!article) return;
      const bounds = article.getBoundingClientRect();
      const distance = bounds.height - window.innerHeight;
      const percentage = distance > 0 ? -bounds.top / distance * 100 : (bounds.top <= 0 ? 100 : 0);
      if (progress) progress.style.width = Math.max(0, Math.min(100, percentage)) + '%';
      const header = document.querySelector('header');
      const offset = (header ? header.getBoundingClientRect().height : 0) + 24;
      let current = headings[0];
      headings.forEach(item => {
        if (item.section.getBoundingClientRect().top <= offset) current = item;
      });
      tocLinks.forEach(link => {
        const active = Boolean(current && link.getAttribute('href') === '#' + encodeURIComponent(current.section.id));
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    function scheduleReading() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateReading);
    }

    let previousMobile = isMobile();
    function updateDisclosure() {
      const mobile = isMobile();
      if (toc && mobile !== previousMobile && !printState) toc.open = !mobile;
      previousMobile = mobile;
      scheduleReading();
    }
    if (toc) {
      toc.open = !previousMobile;
      toc.addEventListener('click', event => {
        if (isMobile() && event.target.closest('a[href^="#"]')) toc.open = false;
      });
    }
    if (media) {
      if (media.addEventListener) media.addEventListener('change', updateDisclosure);
      else if (media.addListener) media.addListener(updateDisclosure);
    }
    window.addEventListener('scroll', scheduleReading, {passive: true});
    window.addEventListener('resize', updateDisclosure);
    document.addEventListener('toggle', scheduleReading, true);
    document.addEventListener('load', scheduleReading, true);

    async function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(text); return; } catch { /* Try selection copy below. */ }
      }
      const active = document.activeElement;
      const selection = window.getSelection();
      const ranges = selection ? [...Array(selection.rangeCount)].map((_, index) => selection.getRangeAt(index).cloneRange()) : [];
      const input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(input);
      try {
        input.focus();
        input.select();
        if (!document.execCommand || !document.execCommand('copy')) throw new Error('Copy unavailable');
      } finally {
        input.remove();
        if (active && active.focus) active.focus({preventScroll: true});
        if (selection) {
          selection.removeAllRanges();
          ranges.forEach(range => selection.addRange(range));
        }
      }
    }

    document.querySelectorAll('.copy').forEach(button => {
      const box = button.closest('.codebox');
      const code = box && box.querySelector('pre code');
      if (!code) return;
      button.addEventListener('click', async () => {
        try { await copyText(code.textContent); announce('代码已复制'); }
        catch { announce('复制未完成，请选中代码后复制'); }
      });
      button.hidden = false;
    });

    function shareUrl() {
      const canonical = document.querySelector('link[rel="canonical"]');
      for (const value of [canonical && canonical.getAttribute('href'), location.href]) {
        if (!value) continue;
        try {
          const url = new URL(value, location.href);
          if (!['http:', 'https:'].includes(url.protocol)) continue;
          url.hash = '';
          return url.href;
        } catch { /* Ignore malformed canonical URLs. */ }
      }
      return null;
    }

    const shareButton = document.getElementById('share-btn');
    if (shareButton) {
      shareButton.addEventListener('click', async () => {
        if (/MicroMessenger/i.test(navigator.userAgent)) {
          window.alert('请点击微信右上角“…”菜单，选择“发送给朋友”或“分享到朋友圈”。\n也可选择“在浏览器打开”后，再点击分享按钮。');
          return;
        }
        const url = shareUrl();
        if (!url) { announce('请打开网站文章后分享'); return; }
        if (navigator.share) {
          try {
            const description = document.querySelector('meta[name="description"]');
            await navigator.share({title: document.title, text: description ? description.content : '', url});
            return;
          } catch (error) {
            if (error && error.name === 'AbortError') return;
          }
        }
        try { await copyText(url); announce('文章链接已复制，可粘贴分享'); }
        catch { announce('复制未完成，请复制浏览器地址栏链接后分享'); }
      });
      shareButton.hidden = false;
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const root = document.documentElement;
      const renderTheme = () => {
        const light = root.dataset.theme === 'light';
        themeToggle.setAttribute('aria-pressed', String(light));
        themeToggle.textContent = light ? '深色' : '浅色';
      };
      themeToggle.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
        try { localStorage.setItem('theme', root.dataset.theme); } catch { /* Ignore storage errors. */ }
        renderTheme();
      });
      renderTheme();
    }

    const groups = new Map();
    const tabPanels = [];
    document.querySelectorAll('[data-tab-group][data-target]').forEach(button => {
      const name = button.dataset.tabGroup;
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(button);
    });
    let tabId = 0;
    groups.forEach(buttons => {
      const container = buttons[0].parentElement;
      const panels = buttons.map(button => document.getElementById(button.dataset.target));
      if (buttons.length < 2 || buttons.some(button => button.parentElement !== container) ||
          panels.some(panel => !panel) || new Set(panels).size !== panels.length) return;
      const vertical = container.getAttribute('aria-orientation') === 'vertical';
      const activate = selected => {
        buttons.forEach((button, index) => {
          const active = index === selected;
          button.setAttribute('aria-selected', String(active));
          button.tabIndex = active ? 0 : -1;
          panels[index].hidden = !active;
        });
        scheduleReading();
      };
      container.setAttribute('role', 'tablist');
      buttons.forEach((button, index) => {
        if (!button.id) {
          let id;
          do { id = 'article-tab-' + (++tabId); } while (document.getElementById(id));
          button.id = id;
        }
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', panels[index].id);
        panels[index].setAttribute('role', 'tabpanel');
        panels[index].setAttribute('aria-labelledby', button.id);
        panels[index].tabIndex = 0;
        button.addEventListener('click', () => activate(index));
        button.addEventListener('keydown', event => {
          const previous = vertical ? 'ArrowUp' : 'ArrowLeft';
          const next = vertical ? 'ArrowDown' : 'ArrowRight';
          if (![previous, next, 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const target = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
            (index + (event.key === next ? 1 : -1) + buttons.length) % buttons.length;
          activate(target);
          buttons[target].focus();
        });
      });
      const selected = buttons.findIndex(button => button.getAttribute('aria-selected') === 'true');
      activate(selected < 0 ? 0 : selected);
      tabPanels.push(...panels);
    });

    window.addEventListener('beforeprint', () => {
      if (printState) return;
      printState = {
        details: [...document.querySelectorAll('details')].map(element => [element, element.open]),
        panels: tabPanels.map(element => [element, element.hidden])
      };
      printState.details.forEach(([element]) => { element.open = true; });
      printState.panels.forEach(([element]) => { element.hidden = false; });
    });
    window.addEventListener('afterprint', () => {
      if (!printState) return;
      printState.details.forEach(([element, open]) => { element.open = open; });
      printState.panels.forEach(([element, hidden]) => { element.hidden = hidden; });
      printState = null;
      scheduleReading();
    });
    scheduleReading();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
