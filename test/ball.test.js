import { describe, expect, test, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import { useBall } from '@/composables/ball'

const ctx = {beginPath: vi.fn(), arc: vi.fn(), clearRect: vi.fn(), fill: vi.fn() };
const defaultRadius = 50;
const defaultColor = 'red';
const defaultAcceleration = 1;
const defaultKeys = {up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight'};

function createBall(params) {
  return useBall(ctx,
    params.radius === undefined ? defaultRadius : params.radius,
    params.color === undefined ? defaultColor : params.color,
    params.acceleration === undefined ? defaultAcceleration : params.acceleration,
    params.keys === undefined ? defaultKeys : params.keys
    );
}

describe('Draw function', () => {
  test('All correct calls to ctx', () => {
    let ball = createBall({});
    let beginPathSpy = vi.spyOn(ctx, 'beginPath');
    let arcSpy = vi.spyOn(ctx, 'arc');
    let fillSpy = vi.spyOn(ctx, 'fill');
    ball.draw();
    expect(beginPathSpy).toHaveBeenCalled();
    expect(arcSpy).toHaveBeenCalled();
    expect(fillSpy).toHaveBeenCalled();
  });

  test.each(['blue', 'red', 'green'])('Color should be %s', (color) => {
    let ball = createBall({'color': color});
    ball.draw();
    expect(ctx.fillStyle).toEqual(color);
  });

  test.each([
    [0, 0, 50],
    [1, 2, 60],
    [3, 3, 40]
  ])('Drawing position should be (%d, %d) with radius %d', (x, y, r) => {
    let ball = createBall({radius: r});
    let spy = vi.spyOn(ctx, 'arc');
    ball.x += x;
    ball.y += y;
    ball.draw();
    expect(spy).toHaveBeenCalledWith(x, y, r, 0, Math.PI*2, false);
  });
});

test.each([
  [0, 0, 5],
  [2, 5, 10],
  [10, 9, 50]
])('Undraw while at position (%d, %d) with radius %d', (x, y, r) => {
  let ball = createBall({radius: r});
  let spy = vi.spyOn(ctx, 'clearRect');
  ball.x = x;
  ball.y = y;
  ball.undraw();
  expect(spy).toHaveBeenCalled();
  let [sx, sy, dx, dy] = spy.calls[0];
  expect(sx).toBeLessThanOrEqual(x);
  expect(sy).toBeLessThanOrEqual(y);
  expect(sx+dx).toBeGreaterThanOrEqual(x);
  expect(sy+dy).toBeGreaterThanOrEqual(y);
});

describe('Movement', () => {
  test.each([0.3, 0.5, 1.1])('Movement with acceleration %d', (accel) => {
    let ball = createBall({acceleration: accel});
    expect(ball.x).toBeCloseTo(0);
    expect(ball.y).toBeCloseTo(0);
    expect(ball.speed_x).toBeCloseTo(0);
    expect(ball.speed_y).toBeCloseTo(0);
    fireEvent.keyDown(window, {
      key: defaultKeys.right,
      code: defaultKeys.right
    });
    ball.update();
    expect(ball.speed_x).toBeCloseTo(accel);
    expect(ball.speed_y).toBeCloseTo(0);
    expect(ball.x).toBeCloseTo(accel);
    expect(ball.y).toBeCloseTo(0);
    ball.update();
    expect(ball.speed_x).toBeCloseTo(2*accel);
    expect(ball.speed_y).toBeCloseTo(0);
    expect(ball.x).toBeCloseTo(3*accel);
    expect(ball.y).toBeCloseTo(0);
    fireEvent.keyUp(window, {
      key: defaultKeys.right,
      code: defaultKeys.right
    });
  });

  test.each([
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
    ['w', 's', 'a', 'd'],
    ['8', '5', '4', '6']
  ])('Test different keys for movement: %s %s %s %s', (up, down, left, right) => {
    let ball = createBall({keys: {up, down, left, right}});
    fireEvent.keyDown(window, {
      key: up,
      code: up
    });
    ball.update();
    expect(ball.x).toBeCloseTo(0);
    expect(ball.y).toBeCloseTo(-defaultAcceleration);
    fireEvent.keyUp(window, {
      key: up,
      code: up
    });
    fireEvent.keyDown(window, {
      key: right,
      code: right
    });
    ball.update();
    expect(ball.x).toBeCloseTo(defaultAcceleration);
    expect(ball.y).toBeCloseTo(-2*defaultAcceleration);
    fireEvent.keyUp(window, {
      key: right,
      code: right
    });
    fireEvent.keyDown(window, {
      key: down,
      code: down
    });
    ball.update();
    expect(ball.x).toBeCloseTo(2*defaultAcceleration);
    expect(ball.y).toBeCloseTo(-2*defaultAcceleration);
    fireEvent.keyUp(window, {
      key: down,
      code: down
    });
    fireEvent.keyDown(window, {
      key: left,
      code: left
    });
    ball.update();
    expect(ball.x).toBeCloseTo(2*defaultAcceleration);
    expect(ball.y).toBeCloseTo(-2*defaultAcceleration);
    fireEvent.keyUp(window, {
      key: left,
      code: left
    });
  });
});