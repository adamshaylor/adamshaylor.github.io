/**
 * Keep in sync with geometry.styl
 */

export const gridColumns = 46;
export const gridUnitsPerSquare = 6;
export const maxGridUnitDips = 30;

export const calculateElsewhereSquareSize = ({
  innerWidth,
  devicePixelRatio
}) => {
  const maxGridUnitSize = maxGridUnitDips * devicePixelRatio;
  const nominalGridUnitSize = (innerWidth * devicePixelRatio) / gridColumns;
  const gridUnitSize = Math.min(maxGridUnitSize, nominalGridUnitSize);
  return gridUnitSize * gridUnitsPerSquare;
};
