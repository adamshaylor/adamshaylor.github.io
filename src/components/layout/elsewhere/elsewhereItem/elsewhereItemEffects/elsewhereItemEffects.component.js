import { expoIn, expoOut } from 'eases-jsnext';
import { calculateElsewhereSquareSize } from '~/lib/geometry.js';

const enterDurationMs = 500;
const exitDurationMs = 200;
const twoPi = 2 * Math.PI;

const nodeList = document.querySelectorAll('canvas.elsewhere-item-effects');
const elements = Array.from(nodeList);
const contexts = elements.map(element => element.getContext('2d'));

let squareSize = 0;
let fillRadius = 0;
const updateFillRadius = squareSize => {
  const aSquared = Math.pow(squareSize, 2);
  const bSquared = aSquared;
  const cSquared = aSquared + bSquared;
  const c = Math.sqrt(cSquared);
  fillRadius = Math.ceil(c);
};

const createFillState = () => ({
  x: null,
  y: null,
  enterTime: null,
  exitTime: null,
  fillFactor: 0
});

const fillStates = Array.from({ length: elements.length }, createFillState);

elements.forEach((element, index) => {
  const { parentElement } = element;
  const fillState = fillStates[index];

  const getCoordinatesInElement = (clientX, clientY) => {
    const { x: elementX, y: elementY } = element.getBoundingClientRect();
    return [
      (clientX - elementX) * window.devicePixelRatio,
      (clientY - elementY) * window.devicePixelRatio
    ];
  };

  parentElement.addEventListener('mouseenter', event => {
    const [x, y] = getCoordinatesInElement(event.clientX, event.clientY);
    fillState.x = x;
    fillState.y = y;
    fillState.enterTime = Date.now();
  });

  parentElement.addEventListener('mousemove', event => {
    const [x, y] = getCoordinatesInElement(event.clientX, event.clientY);
    fillState.x = x;
    fillState.y = y;
    fillState.enterTime = fillState.enterTime || Date.now();
  });

  parentElement.addEventListener('mouseleave', event => {
    const [x, y] = getCoordinatesInElement(event.clientX, event.clientY);
    fillState.x = x;
    fillState.y = y;
    fillState.exitTime = Date.now();
  });
});

const render = (state, context) => {
  const { canvas } = context;
  const computedStyle = window.getComputedStyle(canvas);
  const fillColor = computedStyle.getPropertyValue('--fill-color').trim();
  context.fillStyle = fillColor;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.arc(state.x, state.y, fillRadius * state.fillFactor, 0, twoPi);
  context.fill();
};

const animationLoop = () =>
  window.requestAnimationFrame(() => {
    const now = Date.now();
    fillStates.forEach((state, index) => {
      const entering = state.enterTime > state.exitTime && state.fillFactor < 1;
      const exiting = state.exitTime > state.enterTime && state.fillFactor > 0;
      if (entering) {
        const elapsed = now - state.enterTime;
        state.fillFactor = expoOut(elapsed / enterDurationMs);
        render(state, contexts[index]);
      } else if (exiting) {
        const elapsed = now - state.exitTime;
        state.fillFactor = expoIn(Math.max(1 - elapsed / exitDurationMs, 0));
        render(state, contexts[index]);
      }
    });
    animationLoop();
  });
animationLoop();

const onResize = () =>
  window.requestAnimationFrame(() => {
    squareSize = calculateElsewhereSquareSize(window);
    updateFillRadius(squareSize);
    elements.forEach(element => {
      element.width = squareSize;
      element.height = squareSize;
    });
    fillStates.forEach(state => {
      Object.assign(state, createFillState());
    });
  });
onResize();
window.addEventListener('resize', onResize);
