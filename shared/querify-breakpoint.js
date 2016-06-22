(function() {


  // Create a media query string based on a breakpoint object, e.g.:
  //
  // querifyBreakpoint({ minWidthPx: 1280 })
  // //=> '(min-width: 1280px)'

  function querifyBreakpoint(breakpoint) {


    if (!breakpoint.maxWidthPx) {
      // Assume that the largest breakpoint represents the print version
      return 'print, screen and (min-width: ' + breakpoint.minWidthPx + 'px)';
    }

    else if (!breakpoint.minWidthPx) {
      return 'screen and (max-width: ' + breakpoint.maxWidthPx + 'px)';
    }

    return 'screen and (min-width: ' + breakpoint.minWidthPx + 'px) and (max-width: ' + breakpoint.maxWidthPx + 'px)';

  }


  if (typeof module === 'object') {
    module.exports = querifyBreakpoint;
  }

  else if (typeof window === 'object') {
    window.shaylor = window.shaylor || {};
    window.shaylor.querifyBreakpoint = querifyBreakpoint;
  }


})();
