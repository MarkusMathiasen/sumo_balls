import { ref } from "vue";

const keysPressed = {};
window.addEventListener('keydown', (e) => {
  keysPressed[e.code] = true;
});
window.addEventListener('keyup', (e) => {
  keysPressed[e.code] = false;
});

export function useBall(ctx, radius, color, acceleration, keys) {
  const x = ref(0);
  const y = ref(0);
  const speed_x = ref(0);
  const speed_y = ref(0);

  function draw() {
    ctx.beginPath();
    ctx.arc(x.value, y.value, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function undraw() {
    ctx.clearRect(x.value-radius-2, y.value-radius-2, radius*2+4, radius*2+4);
  }

  function updateSpeed() {
    if (keysPressed[keys.up]) speed_y.value -= acceleration;
    if (keysPressed[keys.down]) speed_y.value += acceleration;
    if (keysPressed[keys.left]) speed_x.value -= acceleration;
    if (keysPressed[keys.right]) speed_x.value += acceleration;
  }

  function updatePosition() {
    x.value += speed_x.value;
    y.value += speed_y.value;
  }

  function update() {
    updateSpeed();
    updatePosition();
  }

  return {
    x, y,
    speed_x, speed_y,
    color,
    draw, undraw, update,
  }
}