$(function sitePostrender() {

  var $initialPage = $('.page');
  var $container = $('#smooth-state-container');
  var pageTransitionDurationS = window.shaylor.design.animationDefaults.durationsInSeconds.medium;
  var pageTransitionDurationMs = pageTransitionDurationS * 1000;
  var initialPageName = getPageNameFromElement($initialPage);

  $container.attr('data-current-page', initialPageName);

  if (initialPageName === 'home') {
    $('body').addClass('fixed-home-projects');
  }

  // http://stackoverflow.com/a/33681490/293656
  $('body *').on('touchstart', function() {});

  var timingFunction = window.shaylor.design.animationDefaults.timingFunctions.gsap;
  TweenLite.defaultEase = com.greensock.easing[timingFunction[0]][timingFunction[1]];

  $container.smoothState({
    onReady: {
      duration: pageTransitionDurationMs,
      render: smoothStateOnReadyRenderer
    },
    onAfter: smoothStateOnAfter
  });

  if (window.matchMedia) {
    Object.keys(window.shaylor.design.layout.breakpoints).forEach(function(breakpointName) {
      var breakpoint = window.shaylor.design.layout.breakpoints[breakpointName];
      var breakpointQuery = window.shaylor.querifyBreakpoint(breakpoint);
      var mediaQueryList = window.matchMedia(breakpointQuery);
      mediaQueryList.addListener(function() {
        breakpointChangeHandler(breakpointName);
      });
      if (mediaQueryList.matches) {
        breakpointChangeHandler(breakpointName);
      }
    });
  }

  function breakpointChangeHandler(breakpointName) {

    var allBreakpointNames = Object.keys(window.shaylor.design.layout.breakpoints);

    var allClassNames = allBreakpointNames.map(function(breakpointName) {
      return 'breakpoint-' + breakpointName;
    });

    $('body')
      .removeClass(allClassNames.join(' '))
      .addClass('breakpoint-' + breakpointName);

  }

  function smoothStateOnReadyRenderer($container, $newPage) {

    var newPageName = getPageNameFromElement($newPage);
    var oldPageName = $container.attr('data-current-page');
    var $oldPage = $('.page-' + oldPageName);
    var newPageOrigin;
    var oldPageDestination;

    // From project to home: right to left
    if (newPageName === 'home') {
      newPageOrigin = '-100vw';
      oldPageDestination = '100vw';
    }

    // From home to project: left to right
    else {
      newPageOrigin = '100vw';
      oldPageDestination = '-100vw';
    }

    if ($container.find('.page-' + newPageName).length) {
      $newPage = $container.find('.page-' + newPageName);
    }

    else {
      TweenLite.to($newPage, 0, {
        transform: 'translateX(' + newPageOrigin + ')'
      });
      $newPage.appendTo($container);
    }

    TweenLite.to($oldPage, pageTransitionDurationS, {
      transform: 'translateX(' + oldPageDestination + ')'
    });

    var newPageAnimation = TweenLite.to($newPage, pageTransitionDurationS, {
      transform: 'translateX(0)'
    });

    $('body').addClass('freeze-pages');

    newPageAnimation.eventCallback('onComplete', function() {

      // Restore coordinate system for fixed position elements
      $newPage.css('transform', '');

      // Work around a Chrome bug wherein translated elements within a fixed
      // element are rendered incorrectly
      if (newPageName === 'home') {
        $('body').addClass('fixed-home-projects');
      }
      else {
        $('body').removeClass('fixed-home-projects');
      }

      // TweenLite converts the responsive viewport units passed to it into
      // unitless transform matrices
      $oldPage.css('transform', 'translateX(' + oldPageDestination + ')');

      $('body').removeClass('freeze-pages');

    });

  }

  function smoothStateOnAfter($container, $newPage) {

    var newPageName = getPageNameFromElement($newPage);
    var oldPageName = $container.attr('data-current-page');

    // Prepare old page to be reloaded at the top
    $container
      .find('.page')
      .not($newPage)
      .scrollTop(0);

    // Transition colors
    $('body')
      .removeClass('colors-' + oldPageName)
      .addClass('colors-' + newPageName);

    $container.attr('data-current-page', newPageName);

    // Send Google Analytics tracking event
    if (window.ga) {
      window.ga('set', 'page', window.location.pathname);
      window.ga('send', 'pageview');
    }

  }

  function getPageNameFromElement(element) {
    var pageClassPrefixRegExp = /\bpage\-/;
    var pageClassRegExp = new RegExp(pageClassPrefixRegExp.source + '.*');
    var pageNameClass = $(element).attr('class').match(pageClassRegExp)[0];
    return pageNameClass.replace(pageClassPrefixRegExp, '');
  }

  if (window.location.search.includes('show-grid')) {
    $.getScript('/grid-overlay.js');
  }

});
