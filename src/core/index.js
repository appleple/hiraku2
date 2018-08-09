import scrollToElement from 'scroll-to-element';
import debounce from 'debounce';
import 'es6-object-assign/auto';
import 'custom-event-polyfill';
import { getUniqId, getWindowWidth, getWindowHeight, hasClass,
	addClass, removeClass, getScrollTop, after, isIE, triggerEvent, append } from '../lib';

const defaults = {
  direction: 'right',
  breakpoint: -1,
  btn: '.js-hiraku-offcanvas-btn',
  btnLabel: 'Menu',
  closeLabel: 'Close',
  fixedHeader: '.js-hiraku-fixed-header',
  closeBtn: '.js-hiraku-close-btn',
  width: '70%',
  focusableElements: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]'
};

export default class Hiraku {

  constructor(selector, opt) {
    this.body = document.querySelector('body');
    this.opt = Object.assign({}, defaults, opt);
    this.side = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.btn = typeof this.opt.btn === 'string' ? document.querySelector(this.opt.btn) : this.opt.btn;
    this.fixed = typeof this.opt.fixedHeader === 'string' ? document.querySelector(this.opt.fixedHeader) : this.opt.fixedHeader;
    this.closeBtns = typeof this.opt.closeBtn === 'string' ? document.querySelectorAll(this.opt.closeBtn) : this.opt.closeBtn;
    this.windowWidth = 0;
    this.id = getUniqId();
    this.opened = false;
    this.scrollAmount = 0;
    this.oldPosY = 0;
    this.vy = 0;
    this.windowHeight = 0;
    this.isIE = isIE();
    if (!this.side || !this.btn) {
      return;
    }
    if (this.fixed) {
      addClass(this.fixed, 'js-hiraku-fixed');
    }
    window.addEventListener('resize', debounce(() => {
      this._resizeHandler();
    }, 200));
    window.addEventListener('touchstart', (e) => {
      this._onTouchStart(e);
    });
    window.addEventListener('touchmove', (e) => {
      this._onTouchMove(e);
    }, { passive: false });
    window.addEventListener('touchend', (e) => {
      this._onTouchEnd(e);
    });
    this._setOffcanvasWidth(this.opt.width);
    this._setHirakuSideMenu();
    this._setHirakuBtn();
    this._setHirakuCloseBtns();
    this._setHirakuBody();
    this._resizeHandler();
  }

  fire(eventName) {
    triggerEvent(this.side, eventName);
  }

  on(event, fn) {
    this.side.addEventListener(event, (e) => {
      fn.call(this, e);
    });
  }

  open() {
    if (this.opened === true) {
      return;
    }
    const { side, btn, fixed, body } = this;
    const { direction, focusableElements } = this.opt;
    const elements = side.querySelectorAll(focusableElements);
    // tab focus
    if (elements && elements.length) {
      const first = elements[0];
      const last = elements[elements.length - 1];
      const lastFocus = (e) => {
        if (e.which === 9 && e.shiftKey) {
          last.focus();
        }
      };
      const firstFocus = (e) => {
        if (e.which === 9 && !e.shiftKey) {
          first.focus();
        }
      };
      first.removeEventListener('keydown', lastFocus);
      first.addEventListener('keydown', lastFocus);
      last.removeEventListener('keydown', firstFocus);
      last.addEventListener('keydown', firstFocus);
    }
    this.opened = true;
    this._fireEvent('open');
    this.windowHeight = getWindowHeight();
    btn.setAttribute('aria-expanded', true);
    addClass(btn, 'js-hiraku-offcanvas-btn-active');
    if (direction === 'right') {
      addClass(body, 'js-hiraku-offcanvas-body-right');
    } else {
      addClass(body, 'js-hiraku-offcanvas-body-left');
    }
    if (fixed) {
      if (this.isIE) {
        fixed.style.transform = `translateX(${side.offsetWidth}px)`;
      } else {
        fixed.style.transform = `translateY(${getScrollTop()}px)`;
      }
    }
    this.scrollAmount = 0;
    side.setAttribute('aria-hidden', false);
    side.style.height = `${getWindowHeight()}px`;
    if (direction === 'right') {
      if (this.isIE) {
        side.style.transform = 'translateX(0px)';
      } else {
        side.style.transform = `translateX(100%) translateY(${getScrollTop()}px)`;
      }
    } else if (this.isIE) {
      side.style.transform = 'translateX(0px)';
    } else {
      side.style.transform = `translateX(-100%) translateY(${getScrollTop()}px)`;
    }
    side.style.marginTop = '0px';
  }

  close(callback = () => {}) {
    if (this.opened === false) {
      return;
    }
    const { body, fixed, btn, side } = this;
    const { direction } = this.opt;
    const onTransitionEnd = (e) => {
      if (fixed) {
        fixed.style.transform = 'translateY(0px)';
      }
      if (e.propertyName !== 'transform') {
        return;
      }
      body.removeEventListener('webkitTransitionEnd', onTransitionEnd);
      body.removeEventListener('transitionend', onTransitionEnd);
      btn.setAttribute('aria-expanded', false);
      side.style.transform = '';
      side.setAttribute('aria-hidden', true);
      removeClass(btn, 'js-hiraku-offcanvas-btn-active');
      this.opened = false;
      this._fireEvent('close');
      callback();
    };
    if (direction === 'right') {
      removeClass(body, 'js-hiraku-offcanvas-body-right');
    } else {
      removeClass(body, 'js-hiraku-offcanvas-body-left');
    }
    body.addEventListener('webkitTransitionEnd', onTransitionEnd);
    body.addEventListener('transitionend', onTransitionEnd);
  }

  _onTouchStart(e) {
    if (this.opened === false) {
      return;
    }
    this.vy = 0;
    this.side.style.height = 'auto';
    this.oldPosY = this._getTouchPos(e).y;
  }

  _onTouchMove(e) {
    if (this.opened === false) {
      return;
    }
    if (this.side.scrollHeight < this.windowHeight) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const posY = this._getTouchPos(e).y;
    const y = posY - this.oldPosY;
    const limitHeight = this.side.scrollHeight - this.windowHeight;
    this.scrollAmount += y;
    if (this.scrollAmount < -limitHeight) {
      this.scrollAmount = -limitHeight;
    } else if (this.scrollAmount > 0) {
      this.scrollAmount = 0;
    }
    this.side.style.marginTop = `${this.scrollAmount}px`;
    this.oldPosY = posY;
    this.vy = y;
  }

  _onTouchEnd() {
    if (this.opened === false) {
      return;
    }
    const limitHeight = this.side.offsetHeight - this.windowHeight;
    const registance = 0.4;

    const interval = () => {
      if (this.vy > 0) {
        this.vy -= registance;
      }
      if (this.vy < 0) {
        this.vy += registance;
      }
      if (Math.abs(this.vy) < registance) {
        return;
      }
      this.scrollAmount += this.vy;
      if (this.scrollAmount < -limitHeight) {
        this.scrollAmount = -limitHeight;
        this.side.style.marginTop = `${this.scrollAmount}px`;
        return;
      }
      if (this.scrollAmount > 0) {
        this.scrollAmount = 0;
        this.side.style.marginTop = `${this.scrollAmount}px`;
        return;
      }
      this.side.style.marginTop = `${this.scrollAmount}px`;
      window.requestAnimationFrame(interval);
    };
    window.requestAnimationFrame(interval);
  }

  _setOffcanvasWidth(width) {
    if (!document.querySelector(`#style-${this.id}`)) {
      append(this.body, `<style id="style-${this.id}"></style>`);
    }
    const style = document.querySelector(`#style-${this.id}`);
    const html = `
		.js-hiraku-offcanvas-sidebar-right,
		.js-hiraku-offcanvas-sidebar-left {
			width: ${width} !important;
		}
		.js-hiraku-offcanvas-body-right {
			transform: translateX(-${width}) !important;
		}
		.js-hiraku-offcanvas-body-left {
			transform: translateX(${width}) !important;
		}
		`;
    style.innerHTML = html;
  }

  _setHirakuCloseBtns() {
    const { closeBtns } = this;
    if (closeBtns) {
      [].forEach.call(closeBtns, (closeBtn) => {
        closeBtn.addEventListener('click', () => {
          this.close();
        });
      });
    }
  }

  _setHirakuSideMenu() {
    const { side, id } = this;
    const { closeLabel, direction } = this.opt;
    const links = side.querySelectorAll('a');
    after(side, '<div class="js-hiraku-offcanvas"></div>');
    if (direction === 'right') {
      addClass(side, 'js-hiraku-offcanvas-sidebar-right');
    } else {
      addClass(side, 'js-hiraku-offcanvas-sidebar-left');
    }
    side.setAttribute('aria-hidden', true);
    side.setAttribute('aria-labelledby', `hiraku-offcanvas-btn-${id}`);
    side.setAttribute('id', id);
    side.setAttribute('aria-label', closeLabel);
    this.parentElement = side.nextElementSibling;
    this.parentElement.addEventListener('click', (e) => {
      this._offcanvasClickHandler(e);
    });
    this.parentElement.addEventListener('touchstart', (e) => {
      this._offcanvasClickHandler(e);
    });
    this.parentElement.addEventListener('keyup', (e) => {
      this._offcanvasClickHandler(e);
    });
    [].forEach.call(links, (link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.charAt(0) === '#') {
          e.preventDefault();
          this.close(() => {
            this.opened = true;
            if (href === '#') {
              this.opened = false;
              return;
            }
            const target = document.querySelector(href);
            if (!target) {
              this.opened = false;
              return;
            }
            let offset = 0;
            if (this.fixed) {
              offset = -this.fixed.offsetHeight;
            }
            scrollToElement(target, { offset, duration: 1000 });
            setTimeout(() => {
              this.opened = false;
            }, 1000);
          });
        }
      });
    });
  }

  _setHirakuBtn() {
    const { btn, id } = this;
    const { btnLabel } = this.opt;
    addClass(btn, 'js-hiraku-offcanvas-btn');
    btn.setAttribute('aria-expanded', false);
    btn.setAttribute('aria-label', btnLabel);
    btn.setAttribute('aria-controls', id);
    btn.setAttribute('id', `hiraku-offcanvas-btn-${id}`);
    btn.addEventListener('click', () => {
      this.open();
    });
  }

  _setHirakuBody() {
    const body = this.body;
    const side = this.side;
    addClass(body, 'js-hiraku-offcanvas-body');
    if (this.isIE) {
      addClass(body, 'js-hiraku-offcanvas-body-ie');
      side.style.transition = 'none';
      setTimeout(() => {
        side.style.transition = '';
      }, 1);
    }
  }

  _offcanvasClickHandler(e) {
    const { parentElement } = this;
    if (e.type === 'keyup' && e.keyCode !== 27) {
      return;
    }
    if (e.target !== parentElement) {
      return;
    }
    this.close();
  }

  _isTouched(e) {
    if (e && e.touches) {
      return true;
    }
    return false;
  }

  _getTouchPos(e) {
    let x = 0;
    let y = 0;
    e = typeof event === 'undefined' ? e : event;
    if (this._isTouched(e)) {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    } else if (e.pageX) {
      x = e.pageX;
      y = e.pageY;
    }
    return { x, y };
  }

  _fireEvent(eventName) {
    triggerEvent(this.side, eventName);
  }

  _resizeHandler() {
    const windowWidth = getWindowWidth();
    const { body, side, opt } = this;
    const { breakpoint } = opt;
    if (windowWidth === this.windowWidth) {
      return;
    }
    this.windowWidth = windowWidth;
    if (hasClass(side, 'js-hiraku-offcanvas-open') && (breakpoint === 1 || breakpoint >= windowWidth)) {
      return;
    }
    if (breakpoint === -1 || breakpoint >= windowWidth) {
      addClass(body, 'js-hiraku-offcanvas-body-active');
    } else {
      removeClass(body, 'js-hiraku-offcanvas-body-active');
    }
    this.close();
  }
}
