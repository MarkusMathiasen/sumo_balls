import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useBall } from '@/composables/ball'

const ctx = {beginPath: vi.fn(), arc: vi.fn(), clearRect: vi.fn(), fill: vi.fn() };
const defaultRadius = 50;
const defaultColor = 'red';
const defaultAcceleration = 0.3;
const defaultKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

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