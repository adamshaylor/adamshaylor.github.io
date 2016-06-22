(function() {


  function scaleTypeByOffset(scaleDefinition, offset) {

    var bases = [];

    // TODO: Refactor with a .slice() or .map()
    var baseIndex;
    for (baseIndex in scaleDefinition.bases) {
      bases.push(scaleDefinition.bases[baseIndex]);
    }

    var sizeAtOffsetZero = bases.reduce(function(previousValue, currentValue) {
      return currentValue < previousValue ? currentValue : previousValue;
    });

    var scaledSize = sizeAtOffsetZero;

    var nextOffset;
    var previousOffset;


    // If we're going up, walk up the scale offset times
    if (offset > 0) {
      for (nextOffset = 1; nextOffset <= offset; nextOffset += 1) {
        scaledSize = getNextSize(scaledSize, bases, scaleDefinition.ratio);
      }
    }

    // If we're going down, walk down the scale offset times
    else if (offset < 0) {
      for (previousOffset = -1; previousOffset >= offset; previousOffset -= 1) {
        scaledSize = getPreviousSize(scaledSize, bases, scaleDefinition.ratio);
      }
    }

    return scaledSize + scaleDefinition.unit;

  }


  function getNextSize(fromSize, bases, ratio) {

    var lastBases;
    var scaledBases = bases;
    var nextSize;

    do {
      lastBases = scaledBases;
      scaledBases = getScaledBases(lastBases);
      nextSize = findNextSize(fromSize, lastBases.concat(scaledBases));
    } while (nextSize === undefined);

    function getScaledBases(fromBases) {
      return fromBases.map(function(base) {
        return base * ratio;
      });
    }

    function findNextSize(fromSize, candidates) {
      return candidates.reduce(function(lastCandidate, candidate) {
        if (candidate > fromSize) {
          if (lastCandidate === undefined) {
            return candidate;
          }
          return candidate < lastCandidate ? candidate : lastCandidate;
        }
        return lastCandidate;
      }, undefined);
    }

    return nextSize;

  }


  function getPreviousSize(fromSize, bases, ratio) {

    var lastBases;
    var scaledBases = bases;
    var previousSize;

    do {
      lastBases = scaledBases;
      scaledBases = getScaledBases(lastBases);
      previousSize = getPreviousSize(fromSize, lastBases.concat(scaledBases));
    } while (previousSize === undefined);

    function getScaledBases(fromBases) {
      return fromBases.map(function(base) {
        return base / ratio;
      });
    }

    function getPreviousSize(fromSize, candidates) {
      return candidates.reduce(function(lastCandidate, candidate) {
        if (candidate < fromSize) {
          if (lastCandidate === undefined) {
            return candidate;
          }
          return candidate > lastCandidate ? candidate : lastCandidate;
        }
        return lastCandidate;
      }, undefined);
    }

    return previousSize;

  }


  if (typeof module === 'object') {
    module.exports = scaleTypeByOffset;
  }

  else if (typeof window === 'object') {
    window.shaylor = window.shaylor || {};
    window.shaylor.scaleTypeByOffset = scaleTypeByOffset;
  }


})();
