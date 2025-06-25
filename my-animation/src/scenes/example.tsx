import {makeScene2D, Code, Rect} from '@motion-canvas/2d';
import {all, createRef, waitFor, ThreadGenerator} from '@motion-canvas/core';

function* typewriter(
  code: Code,
  newText: string,
  delay: number = 0.05
): ThreadGenerator {
  const currentText = code.code().fragments.join('');
  if (currentText === "") {
    for (let i = 1; i <= newText.length; i++) {
      code.code(newText.slice(0, i));
      yield* waitFor(delay);
    }
    return;
  }

  //finding prefix
  let commonPrefix = 0;
  const maxLength = Math.min(currentText.length, newText.length);
  
  while (commonPrefix < maxLength && 
         currentText[commonPrefix] === newText[commonPrefix]) {
    commonPrefix++;
  }

  //erasing
  for (let i = currentText.length; i >= commonPrefix; i--) {
    const partialText = currentText.slice(0, i);
    code.code(partialText);
    yield* waitFor(delay);
  }

  //typing
  for (let i = commonPrefix; i <= newText.length; i++) {
    const partialText = newText.slice(0, i);
    code.code(partialText);
    yield* waitFor(delay);
  }
}

export default makeScene2D(function* (view) {
  const code = createRef<Code>();
  const container = createRef<Rect>();

  view.add(
    <Rect ref={container}>
      <Code
        ref={code}
        fontSize={28}
        fontFamily={'JetBrains Mono, monospace'}
        code={"start"}
      />
    </Rect>
  );

  container().size(code().size());
  code().position(container().size().scale(-0.5));

  yield* typewriter(
    code(),
    `123567890`,
    0.08
  );

  yield* waitFor(0.6);

  yield* all(
    code().code.replace(
      code().findFirstRange('123'),
      `54321`,
      0.6
    ),
  );
  
  yield* waitFor(0.6);

  yield* typewriter(
    code(),
    `(define square (lambda (x) (* x x)))
(square x)`
  );

  yield* waitFor(0.6);

  yield* typewriter(
    code(),
    `(define square (lambda (x) (* x x)))
(12345)`
  );
});