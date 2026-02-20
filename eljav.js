document.addEventListener('DOMContentLoaded', () => {
  const panels = document.querySelectorAll('.event-panel');
  const MAX_HISTORY = 6;

  panels.forEach(panel => {
    const ev = panel.dataset.event;
    const control = panel.querySelector('.event-control') || panel;
    const logEl = panel.querySelector('.event-log');
    const clearBtn = panel.querySelector('.clear-log');
    if (!ev || !control || !logEl) return;

    const history = [];
    function render() {
      logEl.innerHTML = history.slice(-MAX_HISTORY).reverse().map(h => `<div class="log-entry">${h}</div>`).join('');
    }
    function push(msg) {
      const time = new Date().toLocaleTimeString();
      history.push(`${time} — ${msg}`);
      if (history.length > 100) history.shift();
      render();
    }

    let lastMove = 0;

    const handler = (e) => {
      if (ev === 'mousemove') {
        const now = performance.now();
        if (now - lastMove < 50) return; 
        lastMove = now;
        const x = (e.offsetX !== undefined) ? e.offsetX : Math.round(e.clientX);
        const y = (e.offsetY !== undefined) ? e.offsetY : Math.round(e.clientY);
        push(`mousemove @ ${x},${y}`);
      } else if (ev === 'keydown') {
        push(`keydown: ${e.key || e.code}`);
      } else if (ev === 'dblclick') {
        push('dblclick');
      } else if (ev === 'mousedown') {
        push(`mousedown (button ${e.button})`);
      } else if (ev === 'mouseenter') {
        push('mouseenter');
      } else if (ev === 'mouseleave') {
        push('mouseleave');
      } else if (ev === 'click') {
        push('click');
      } else {
        push(`${ev} fired`);
      }

      panel.classList.add('flash');
      setTimeout(() => panel.classList.remove('flash'), 260);
    };

   
    if (ev === 'focus') {
      if (control.tabIndex === undefined || control.tabIndex < 0) control.tabIndex = 0;
      const focusHandler = (e) => { push('focused (selected)'); panel.classList.add('flash'); setTimeout(() => panel.classList.remove('flash'), 260); };
      const blurHandler = (e) => { push('blurred (deselected)'); panel.classList.add('flash'); setTimeout(() => panel.classList.remove('flash'), 260); };
      control.addEventListener('focus', focusHandler);
      control.addEventListener('blur', blurHandler);
    } else {
      if ((ev === 'keydown') && (control.tabIndex === -1)) control.tabIndex = 0;
      if (ev === 'keydown') control.addEventListener('keydown', handler);
      else control.addEventListener(ev, handler);
    }

    if (clearBtn) clearBtn.addEventListener('click', () => { history.length = 0; render(); });

    push(`panel ready (listening for ${ev})`);
  });
});

