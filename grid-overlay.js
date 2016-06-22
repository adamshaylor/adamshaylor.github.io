/* eslint no-console: 0 */

(function() {

  var gridColor = 'rgb(35, 45, 246)';
  var gridOpacity = 0.1;

  $.getJSON('/design.json', function(designData) {

    var canvas = createCanvas(gridOpacity);

    // TODO: debounce
    $(window).on('resize', render.bind(this, canvas, designData.layout));

    render(canvas, designData.layout);

    function render(canvas, layout) {
      var breakpointName = getBreakpointName(layout.breakpoints);
      setCanvasCssWidthForBreakpoint(canvas, layout, breakpointName);
      setCanvasSizeToCssSize(canvas);
      drawGridToCanvas(canvas, layout, breakpointName, gridColor);
    }

  });

  function createCanvas(gridOpacity) {

    var canvas = document.createElement('canvas');

    var canvasStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      'max-width': '100vw',
      'min-height': '100vh',
      margin: 'auto',
      opacity: gridOpacity,
      'pointer-events': 'none'
    };

    $(canvas)
      .css(canvasStyle)
      .appendTo('body');

    return canvas;

  }

  function getBreakpointName(breakpoints) {

    return Object.keys(breakpoints).find(function(name) {
      var breakpoint = breakpoints[name];
      var breakpointQueries = [];
      if (breakpoint.minWidthPx) {
        breakpointQueries.push('(min-width: ' + breakpoint.minWidthPx + 'px)');
      }
      if (breakpoint.maxWidthPx) {
        breakpointQueries.push('(max-width: ' + breakpoint.maxWidthPx + 'px)');
      }
      return window.matchMedia(breakpointQueries.join(' and ')).matches;
    });
    
  }

  function setCanvasCssWidthForBreakpoint(canvas, layout, breakpointName) {

    var breakpoint = layout.breakpoints[breakpointName];
    var widthString;

    if (breakpoint.forceFitAspectRatio) {
      widthString = layout.gridAspectRatio.numerator * 100 / layout.gridAspectRatio.denominator + 'vh';
    }

    else {
      widthString = '100vw';
    }

    $(canvas).css('width', widthString);

  }

  function setCanvasSizeToCssSize(element) {
    var $element = $(element);
    var width = $element.width();
    var height = $element.height();
    element.width = width;
    element.height = height;
  }

  function drawGridToCanvas(canvas, layout, breakpointName, gridColor) {

    var breakpoint = layout.breakpoints[breakpointName];

    // Draw columns

    var columnToGutterRatio = breakpoint.columnToGutterRatio;
    var columnCount = breakpoint.columnCount;
    var gutterCount = columnCount + 1;
    var canvasWidth = canvas.width;
    var gutterWidth = canvasWidth / (gutterCount + columnToGutterRatio * columnCount);
    var columnWidth = canvasWidth / (gutterCount / columnToGutterRatio + columnCount);
    var gutterIndex;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = gridColor;

    for (gutterIndex = 0; gutterIndex < gutterCount; gutterIndex += 1) {
      ctx.fillRect(gutterIndex * (gutterWidth + columnWidth), 0, gutterWidth, canvas.height);
    }

    // Draw rows

    var gridAspectRatioString = layout.gridAspectRatio.numerator + '/' + layout.gridAspectRatio.denominator;
    var rowCount = breakpoint.rowCount;
    var viewportWiderOrEqualToGridQuery = '(min-aspect-ratio: ' + gridAspectRatioString + ')';
    var isViewportProportionateOrWiderThanGrid = window.matchMedia(viewportWiderOrEqualToGridQuery).matches;
    // http://stackoverflow.com/a/8876069
    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var gridAspectRatioNumber = layout.gridAspectRatio.numerator / layout.gridAspectRatio.denominator;
    var gridBasisHeight = canvas.width / gridAspectRatioNumber;
    var rowHeight = isViewportProportionateOrWiderThanGrid ? (gridBasisHeight / rowCount) : (viewportWidth / (gridAspectRatioNumber * rowCount));
    var rowLineY;

    ctx.strokeStyle = gridColor;

    for (rowLineY = rowHeight; rowLineY < canvas.height; rowLineY += rowHeight) {
      ctx.beginPath();
      ctx.moveTo(0, rowLineY);
      ctx.lineTo(canvas.width, rowLineY);
      ctx.stroke();
      for (gutterIndex = 0; gutterIndex < gutterCount; gutterIndex += 1) {
        ctx.clearRect(gutterIndex * (gutterWidth + columnWidth) - 0.5, rowLineY, gutterWidth, 1);
      }
    }

  }

})();
