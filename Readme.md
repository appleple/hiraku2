# hiraku2

We made hiraku.js so that more people can use Offcanvas-menu functionality which is used in a CMS we make.

You can easily find source code or plugins for Offcanvas-menu via Google by searching with "offcanvas JavaScript", but we can't find any plugins which meet all features that hiraku.js has. That's Why we made it from the scratch.

## Feature

- Not affected by the DOM structure.
- Enable to open both right and left side menu.
- Main canvas is not scrolled, while scrolling Offcanvas-menu.
- Easy to control the movement
- Accessible for keyboard navigation and screen readers.

## Installation

npm

```
$ npm install hiraku
```

## Setup

```html
<link rel="stylesheet" type="text/css" href="./path/to/hiraku.css">
<script src="./path/to/hiraku.js"></script>
```

## Option
hiraku.js has following options. Via options, you can control the behavior when you open the Offcanvas-menu.
And if you want to change the width of the Offcanvas-menu, You may want to change CSS properties instead of changing the JavaScript.

| Variable | Description |
|-----------|----------------------------------------------------------------|
| btn       | Selector of the button to open the Offcanvas-menu |
| fixedHeader | Selector of the fixed elements |
| direction | Offcanvas-menu from "left" or "right" |

## Demo

### From right side
```html
<button class="hiraku-open-btn" id="offcanvas-btn-right" data-toggle-offcanvas="#js-hiraku-offcanvas-1">
  <span class="hiraku-open-btn-line"></span>
</button>
<div class="offcanvas-right">
  <ul><li>hogehoge</li></ul>
</div>
```

```js
new Hiraku(".offcanvas-right", {
  btn: "#offcanvas-btn-right",
  fixedHeader: "#header",
  direction: "right"
});
```
### From left side

```html
<button class="hiraku-open-btn" id="offcanvas-btn-left" data-toggle-offcanvas="#js-hiraku-offcanvas-1">
  <span class="hiraku-open-btn-line"></span>
</button>
<div class="offcanvas-left">
  <ul><li>hogehoge</li></ul>
</div>
```

```js
new Hiraku(".offcanvas-left", {
  btn: "#offcanvas-btn-left",
  fixedHeader: "#header",
  direction: "left"
});
```
### From both side

```html
<button class="hiraku-open-btn" id="offcanvas-btn-left" data-toggle-offcanvas="#js-hiraku-offcanvas-1">
  <span class="hiraku-open-btn-line"></span>
</button>
<div class="offcanvas-left">
  <ul><li>hogehoge</li></ul>
</div>

<button class="hiraku-open-btn" id="offcanvas-btn-right" data-toggle-offcanvas="#js-hiraku-offcanvas-1">
  <span class="hiraku-open-btn-line"></span>
</button>
<div class="offcanvas-right">
  <ul><li>hogehoge</li></ul>
</div>
```

```js
new Hiraku(".offcanvas-left", {
  btn: "#offcanvas-btn-left",
  fixedHeader: "#header",
  direction: "left"
});


new Hiraku(".offcanvas-right", {
  btn: "#offcanvas-btn-right",
  fixedHeader: "#header",
  direction: "right"
});
```

### Specify the width of the Offcanvas-menu in pixels

```js
new Hiraku(".offcanvas-right", {
  btn: "#offcanvas-btn-right",
  fixedHeader: "#header",
  direction: "right",
  width: '100px' // default 70%
});
```

### open/close methods

```js
var hiraku = new Hiraku(".offcanvas-right", {
  breakpoint: -1,
  btn: "#offcanvas-btn-right",
  closeBtn: '.#offcanvas-btn-close',
  fixedHeader: "#header",
  direction: "right",
  width: '100px' // default 70%
});
hiraku.open(); // open offcanvas;
hiraku.close(); // close offcanvas;
```

### open/close events

```js
var hiraku = new Hiraku(".offcanvas-right", {
  breakpoint: -1,
  btn: "#offcanvas-btn-right",
  closeBtn: '.#offcanvas-btn-close',
  fixedHeader: "#header",
  direction: "right",
  width: '100px' // default 70%
});
hiraku.on('open', function(){
  // this will be executed when the offcanvas opened
});
hiraku.on('close', function(){
  // this will be executed when the offcanvas closed
});
```

## Download

You can download from here.

[Download hiraku.js](http://github.com/appleple/hiraku2/archive/master.zip)

## Github

[hiraku.js on Github](http://github.com/appleple/hiraku2)
