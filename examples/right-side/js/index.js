var hiraku = new Hiraku('.js-offcanvas', {
  btn: ".js-offcanvas-btn",
  fixedHeader: ".js-fixed-header",
  direction: "right",
  breakpoint: 767
});
hiraku.on('open', function(){
	console.log('test');
});

hiraku.on('close', function(){
	console.log('close');
});

