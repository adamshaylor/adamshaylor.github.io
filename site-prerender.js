/* global WebFont */

(function sitePrerender() {

  var html = document.getElementsByTagName('html')[0];

  html.className = html.className.replace('no-js', 'js');

  WebFont.load({
    google: {
      families: ['Source+Sans+Pro:400,400italic,700:latin']
    }
  });

})();
