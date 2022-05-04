<script setup>
import Ball from './Ball.vue'
import { ref, reactive, computed, onMounted } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  ballRadius: {
    type: Number,
    default: 50
  },
  acceleration: {
    type: Number,
    default: 0.3
  }
});

const emit = defineEmits(['redDead', 'blueDead']);
const keysPressed = [];
let interval = null;
let ctx = null;

const redBall = ref(null);
const blueBall = ref(null);
const canvas = ref(null);

const balls = computed(() => {return [redBall, blueBall]});

onMounted(() => {
  ctx = reactive(canvas.value.getContext("2d"));
  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);
  setupArena();
});

function keydown(e) {
  keysPressed[e.keyCode] = true;
}
function keyup(e) {
  keysPressed[e.keyCode] = false;
}
function sleep(ms) {  
  return new Promise(resolve => setTimeout(resolve, ms));  
}
function setupArena() {
  for (let ball of balls.value) {
    ball.value.speed_x = 0;
    ball.value.speed_y = 0;
    ball.value.y = props.height/2;
  }
  redBall.value.x = props.width/4;
  blueBall.value.x = 3*props.width/4;
  ctx.clearRect(0, 0, props.width, props.height);
  for (let ball of balls.value)
    ball.value.draw(ctx);
  interval = setInterval(update, 20);
}
function update() {
  for (let ball of balls.value)
    ball.value.undraw(ctx);
  updateSpeeds();
  checkCollision();
  updatePositions();
  for (let ball of balls.value)
    ball.value.draw(ctx);
}
function updateSpeeds() {
  if (keysPressed[37]) blueBall.value.speed_x -= props.acceleration;
  if (keysPressed[38]) blueBall.value.speed_y -= props.acceleration;
  if (keysPressed[39]) blueBall.value.speed_x += props.acceleration;
  if (keysPressed[40]) blueBall.value.speed_y += props.acceleration;

  if (keysPressed[65]) redBall.value.speed_x -= props.acceleration;
  if (keysPressed[87]) redBall.value.speed_y -= props.acceleration;
  if (keysPressed[68]) redBall.value.speed_x += props.acceleration;
  if (keysPressed[83]) redBall.value.speed_y += props.acceleration;
}
function checkCollision() {
  let dx = blueBall.value.x - redBall.value.x;
  let dy = blueBall.value.y - redBall.value.y;
  let dist = Math.sqrt(dx*dx + dy*dy);
  if (dist <= 2*props.ballRadius) {
    let cos = dx / dist;
    let sin = dy / dist;
    let add_1 = redBall.value.speed_x*cos + redBall.value.speed_y*sin;
    let add_1x = add_1*cos;
    let add_1y = add_1*sin;
    let add_0 = blueBall.value.speed_x*cos + blueBall.value.speed_y*sin;
    let add_0x = add_0*cos;
    let add_0y = add_0*sin;
    redBall.value.speed_x += add_0x - add_1x;
    redBall.value.speed_y += add_0y - add_1y;
    blueBall.value.speed_x += add_1x - add_0x;
    blueBall.value.speed_y += add_1y - add_0y;
  }
}
async function updatePositions() {
  for (let ball of balls.value) {
    ball.value.x += ball.value.speed_x;
    ball.value.y += ball.value.speed_y;
    if (ball.value.x + props.ballRadius > props.width
    || ball.value.x - props.ballRadius < 0
    || ball.value.y + props.ballRadius > props.height
    || ball.value.y - props.ballRadius < 0) {
      clearInterval(interval);
      await sleep(1500);
     emit(ball.value.getColor() + 'Dead');
    }
  }
}
defineExpose({
  setupArena
});
</script>

<template>
  <canvas :width="width" :height="height" ref="canvas">
    <Ball ref="redBall" :radius="ballRadius" color="red" />
    <Ball ref="blueBall" :radius="ballRadius" color="blue" />
  </canvas>
</template>

<style>
canvas {
  border: 5px red solid;
}
</style>