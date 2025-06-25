import {Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all} from '@motion-canvas/core';
import {ThreadGenerator} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  view.add(<Circle ref={circle} width={100} height={100} fill='blue' />);
  yield* changeScaleColor(circle());
});

function* changeScaleColor(circle: Circle): ThreadGenerator {
  yield* all(
    circle.fill('red', 1),
    circle.scale(2, 1)
  );
}