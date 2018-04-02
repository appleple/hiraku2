'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getUniqId = exports.getUniqId = function getUniqId() {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
};

var getWindowWidth = exports.getWindowWidth = function getWindowWidth() {
  if (document && document.documentElement) {
    return document.documentElement.clientWidth;
  } else if (window && window.innerWidth) {
    return window.innerWidth;
  }
  return 0;
};

var getWindowHeight = exports.getWindowHeight = function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight || 0;
};

var hasClass = exports.hasClass = function hasClass(el, className) {
  if (el.classList) {
    el.classList.contains(className);
  } else {
    new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
};

var addClass = exports.addClass = function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ' ' + className;
  }
};

var removeClass = exports.removeClass = function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

var getScrollTop = exports.getScrollTop = function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

var wrap = exports.wrap = function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
};

var after = exports.after = function after(el, html) {
  el.insertAdjacentHTML('afterend', html);
};

var isIE = exports.isIE = function isIE() {
  var userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.match(/(msie|MSIE)/) || userAgent.match(/(T|t)rident/)) {
    return true;
  }
  return false;
};

var triggerEvent = exports.triggerEvent = function triggerEvent(el, eventName, options) {
  var event = void 0;
  if (window.CustomEvent) {
    event = new CustomEvent(eventName, { cancelable: true });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, false, false, options);
  }
  el.dispatchEvent(event);
};

var append = exports.append = function append(element, string) {
  var div = document.createElement('div');
  div.innerHTML = string;
  while (div.children.length > 0) {
    element.appendChild(div.children[0]);
  }
};