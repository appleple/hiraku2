'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scrollToElement = require('scroll-to-element');

var _scrollToElement2 = _interopRequireDefault(_scrollToElement);

var _debounce = require('debounce');

var _debounce2 = _interopRequireDefault(_debounce);

require('es6-object-assign/auto');

require('custom-event-polyfill');

var _lib = require('../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
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

var Hiraku = function () {
  function Hiraku(selector, opt) {
    var _this = this;

    _classCallCheck(this, Hiraku);

    this.body = document.querySelector('body');
    this.opt = Object.assign({}, defaults, opt);
    this.side = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.btn = typeof this.opt.btn === 'string' ? document.querySelector(this.opt.btn) : this.opt.btn;
    this.fixed = typeof this.opt.fixedHeader === 'string' ? document.querySelector(this.opt.fixedHeader) : this.opt.fixedHeader;
    this.closeBtns = typeof this.opt.closeBtn === 'string' ? document.querySelectorAll(this.opt.closeBtn) : this.opt.closeBtn;
    this.windowWidth = 0;
    this.id = (0, _lib.getUniqId)();
    this.opened = false;
    this.scrollAmount = 0;
    this.oldPosY = 0;
    this.vy = 0;
    this.windowHeight = 0;
    this.isIE = (0, _lib.isIE)();
    if (!this.side || !this.btn) {
      return;
    }
    if (this.fixed) {
      (0, _lib.addClass)(this.fixed, 'js-hiraku-fixed');
    }
    window.addEventListener('resize', (0, _debounce2.default)(function () {
      _this._resizeHandler();
    }, 200));
    window.addEventListener('touchstart', function (e) {
      _this._onTouchStart(e);
    });
    window.addEventListener('touchmove', function (e) {
      _this._onTouchMove(e);
    }, { passive: false });
    window.addEventListener('touchend', function (e) {
      _this._onTouchEnd(e);
    });
    this._setOffcanvasWidth(this.opt.width);
    this._setHirakuSideMenu();
    this._setHirakuBtn();
    this._setHirakuCloseBtns();
    this._setHirakuBody();
    this._resizeHandler();
  }

  _createClass(Hiraku, [{
    key: 'fire',
    value: function fire(eventName) {
      (0, _lib.triggerEvent)(this.side, eventName);
    }
  }, {
    key: 'on',
    value: function on(event, fn) {
      var _this2 = this;

      this.side.addEventListener(event, function (e) {
        fn.call(_this2, e);
      });
    }
  }, {
    key: 'open',
    value: function open() {
      if (this.opened === true) {
        return;
      }
      var side = this.side,
          btn = this.btn,
          fixed = this.fixed,
          body = this.body;
      var _opt = this.opt,
          direction = _opt.direction,
          focusableElements = _opt.focusableElements;

      var elements = side.querySelectorAll(focusableElements);
      // tab focus
      if (elements && elements.length) {
        var first = elements[0];
        var last = elements[elements.length - 1];
        var lastFocus = function lastFocus(e) {
          if (e.which === 9 && e.shiftKey) {
            last.focus();
          }
        };
        var firstFocus = function firstFocus(e) {
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
      this.windowHeight = (0, _lib.getWindowHeight)();
      btn.setAttribute('aria-expanded', true);
      (0, _lib.addClass)(btn, 'js-hiraku-offcanvas-btn-active');
      if (direction === 'right') {
        (0, _lib.addClass)(body, 'js-hiraku-offcanvas-body-right');
      } else {
        (0, _lib.addClass)(body, 'js-hiraku-offcanvas-body-left');
      }
      if (fixed) {
        if (this.isIE) {
          fixed.style.transform = 'translateX(' + side.offsetWidth + 'px)';
        } else {
          fixed.style.transform = 'translateY(' + (0, _lib.getScrollTop)() + 'px)';
        }
      }
      this.scrollAmount = 0;
      side.setAttribute('aria-hidden', false);
      side.style.height = (0, _lib.getWindowHeight)() + 'px';
      if (direction === 'right') {
        if (this.isIE) {
          side.style.transform = 'translateX(0px)';
        } else {
          side.style.transform = 'translateX(100%) translateY(' + (0, _lib.getScrollTop)() + 'px)';
        }
      } else if (this.isIE) {
        side.style.transform = 'translateX(0px)';
      } else {
        side.style.transform = 'translateX(-100%) translateY(' + (0, _lib.getScrollTop)() + 'px)';
      }
      side.style.marginTop = '0px';
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      if (this.opened === false) {
        return;
      }
      var body = this.body,
          fixed = this.fixed,
          btn = this.btn,
          side = this.side;
      var direction = this.opt.direction;

      var onTransitionEnd = function onTransitionEnd(e) {
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
        (0, _lib.removeClass)(btn, 'js-hiraku-offcanvas-btn-active');
        _this3.opened = false;
        _this3._fireEvent('close');
        callback();
      };
      if (direction === 'right') {
        (0, _lib.removeClass)(body, 'js-hiraku-offcanvas-body-right');
      } else {
        (0, _lib.removeClass)(body, 'js-hiraku-offcanvas-body-left');
      }
      body.addEventListener('webkitTransitionEnd', onTransitionEnd);
      body.addEventListener('transitionend', onTransitionEnd);
    }
  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(e) {
      if (this.opened === false) {
        return;
      }
      this.vy = 0;
      this.side.style.height = 'auto';
      this.oldPosY = this._getTouchPos(e).y;
    }
  }, {
    key: '_onTouchMove',
    value: function _onTouchMove(e) {
      if (this.opened === false) {
        return;
      }
      if (this.side.scrollHeight < this.windowHeight) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      var posY = this._getTouchPos(e).y;
      var y = posY - this.oldPosY;
      var limitHeight = this.side.scrollHeight - this.windowHeight;
      this.scrollAmount += y;
      if (this.scrollAmount < -limitHeight) {
        this.scrollAmount = -limitHeight;
      } else if (this.scrollAmount > 0) {
        this.scrollAmount = 0;
      }
      this.side.style.marginTop = this.scrollAmount + 'px';
      this.oldPosY = posY;
      this.vy = y;
    }
  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd() {
      var _this4 = this;

      if (this.opened === false) {
        return;
      }
      var limitHeight = this.side.offsetHeight - this.windowHeight;
      var registance = 0.4;

      var interval = function interval() {
        if (_this4.vy > 0) {
          _this4.vy -= registance;
        }
        if (_this4.vy < 0) {
          _this4.vy += registance;
        }
        if (Math.abs(_this4.vy) < registance) {
          return;
        }
        _this4.scrollAmount += _this4.vy;
        if (_this4.scrollAmount < -limitHeight) {
          _this4.scrollAmount = -limitHeight;
          _this4.side.style.marginTop = _this4.scrollAmount + 'px';
          return;
        }
        if (_this4.scrollAmount > 0) {
          _this4.scrollAmount = 0;
          _this4.side.style.marginTop = _this4.scrollAmount + 'px';
          return;
        }
        _this4.side.style.marginTop = _this4.scrollAmount + 'px';
        window.requestAnimationFrame(interval);
      };
      window.requestAnimationFrame(interval);
    }
  }, {
    key: '_setOffcanvasWidth',
    value: function _setOffcanvasWidth(width) {
      if (!document.querySelector('#style-' + this.id)) {
        (0, _lib.append)(this.body, '<style id="style-' + this.id + '"></style>');
      }
      var style = document.querySelector('#style-' + this.id);
      var html = '\n\t\t.js-hiraku-offcanvas-sidebar-right,\n\t\t.js-hiraku-offcanvas-sidebar-left {\n\t\t\twidth: ' + width + ' !important;\n\t\t}\n\t\t.js-hiraku-offcanvas-body-right {\n\t\t\ttransform: translateX(-' + width + ') !important;\n\t\t}\n\t\t.js-hiraku-offcanvas-body-left {\n\t\t\ttransform: translateX(' + width + ') !important;\n\t\t}\n\t\t';
      style.innerHTML = html;
    }
  }, {
    key: '_setHirakuCloseBtns',
    value: function _setHirakuCloseBtns() {
      var _this5 = this;

      var closeBtns = this.closeBtns;

      if (closeBtns) {
        [].forEach.call(closeBtns, function (closeBtn) {
          closeBtn.addEventListener('click', function () {
            _this5.close();
          });
        });
      }
    }
  }, {
    key: '_setHirakuSideMenu',
    value: function _setHirakuSideMenu() {
      var _this6 = this;

      var side = this.side,
          id = this.id;
      var _opt2 = this.opt,
          closeLabel = _opt2.closeLabel,
          direction = _opt2.direction;

      var links = side.querySelectorAll('a');
      (0, _lib.after)(side, '<div class="js-hiraku-offcanvas"></div>');
      if (direction === 'right') {
        (0, _lib.addClass)(side, 'js-hiraku-offcanvas-sidebar-right');
      } else {
        (0, _lib.addClass)(side, 'js-hiraku-offcanvas-sidebar-left');
      }
      side.setAttribute('aria-hidden', true);
      side.setAttribute('aria-labelledby', 'hiraku-offcanvas-btn-' + id);
      side.setAttribute('id', id);
      side.setAttribute('aria-label', closeLabel);
      this.parentElement = side.nextElementSibling;
      this.parentElement.addEventListener('click', function (e) {
        _this6._offcanvasClickHandler(e);
      });
      this.parentElement.addEventListener('touchstart', function (e) {
        _this6._offcanvasClickHandler(e);
      });
      this.parentElement.addEventListener('keyup', function (e) {
        _this6._offcanvasClickHandler(e);
      });
      [].forEach.call(links, function (link) {
        link.addEventListener('click', function (e) {
          var href = link.getAttribute('href');
          if (href.charAt(0) === '#') {
            e.preventDefault();
            _this6.close(function () {
              _this6.opened = true;
              if (href === '#') {
                _this6.opened = false;
                return;
              }
              var target = document.querySelector(href);
              if (!target) {
                _this6.opened = false;
                return;
              }
              var offset = 0;
              if (_this6.fixed) {
                offset = -_this6.fixed.offsetHeight;
              }
              (0, _scrollToElement2.default)(target, { offset: offset, duration: 1000 });
              setTimeout(function () {
                _this6.opened = false;
              }, 1000);
            });
          }
        });
      });
    }
  }, {
    key: '_setHirakuBtn',
    value: function _setHirakuBtn() {
      var _this7 = this;

      var btn = this.btn,
          id = this.id;
      var btnLabel = this.opt.btnLabel;

      (0, _lib.addClass)(btn, 'js-hiraku-offcanvas-btn');
      btn.setAttribute('aria-expanded', false);
      btn.setAttribute('aria-label', btnLabel);
      btn.setAttribute('aria-controls', id);
      btn.setAttribute('id', 'hiraku-offcanvas-btn-' + id);
      btn.addEventListener('click', function () {
        _this7.open();
      });
    }
  }, {
    key: '_setHirakuBody',
    value: function _setHirakuBody() {
      var body = this.body;
      var side = this.side;
      (0, _lib.addClass)(body, 'js-hiraku-offcanvas-body');
      if (this.isIE) {
        (0, _lib.addClass)(body, 'js-hiraku-offcanvas-body-ie');
        side.style.transition = 'none';
        setTimeout(function () {
          side.style.transition = '';
        }, 1);
      }
    }
  }, {
    key: '_offcanvasClickHandler',
    value: function _offcanvasClickHandler(e) {
      var parentElement = this.parentElement;

      if (e.type === 'keyup' && e.keyCode !== 27) {
        return;
      }
      if (e.target !== parentElement) {
        return;
      }
      this.close();
    }
  }, {
    key: '_isTouched',
    value: function _isTouched(e) {
      if (e && e.touches) {
        return true;
      }
      return false;
    }
  }, {
    key: '_getTouchPos',
    value: function _getTouchPos(e) {
      var x = 0;
      var y = 0;
      e = typeof event === 'undefined' ? e : event;
      if (this._isTouched(e)) {
        x = e.touches[0].pageX;
        y = e.touches[0].pageY;
      } else if (e.pageX) {
        x = e.pageX;
        y = e.pageY;
      }
      return { x: x, y: y };
    }
  }, {
    key: '_fireEvent',
    value: function _fireEvent(eventName) {
      (0, _lib.triggerEvent)(this.side, eventName);
    }
  }, {
    key: '_resizeHandler',
    value: function _resizeHandler() {
      var windowWidth = (0, _lib.getWindowWidth)();
      var body = this.body,
          side = this.side,
          opt = this.opt;
      var breakpoint = opt.breakpoint;

      if (windowWidth === this.windowWidth) {
        return;
      }
      this.windowWidth = windowWidth;
      if ((0, _lib.hasClass)(side, 'js-hiraku-offcanvas-open') && (breakpoint === 1 || breakpoint >= windowWidth)) {
        return;
      }
      if (breakpoint === -1 || breakpoint >= windowWidth) {
        (0, _lib.addClass)(body, 'js-hiraku-offcanvas-body-active');
      } else {
        (0, _lib.removeClass)(body, 'js-hiraku-offcanvas-body-active');
      }
      this.close();
    }
  }]);

  return Hiraku;
}();

exports.default = Hiraku;
module.exports = exports['default'];