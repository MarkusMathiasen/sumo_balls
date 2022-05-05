<script setup>
import { useBall } from '../composables/ball.js'
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

let redBall = null;
let blueBall = null;
let balls = [];

const canvas = ref(null);

onMounted(() => {
  ctx = canvas.value.getContext("2d");
  redBall = useBall(ctx, props.ballRadius, 'red', props.acceleration, {up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD'});
  blueBall = useBall(ctx, props.ballRadius, 'blue', props.acceleration, {up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight'});
  balls = [redBall, blueBall];
  setupArena();
});

function sleep(ms) {  
  return new Promise(resolve => setTimeout(resolve, ms));  
}
function setupArena() {
  for (let ball of balls) {
    ball.speed_x = 0;
    ball.speed_y = 0;
    ball.y = props.height/2;
  }
  redBall.x = props.width/4;
  blueBall.x = 3*props.width/4;
  ctx.clearRect(0, 0, props.width, props.height);
  for (let ball of balls)
    ball.draw();
  interval = setInterval(update, 20);
}

function update() {
  for (let ball of balls)
    ball.undraw();
  for (let ball of balls)
    ball.update();
  for (let ball of balls)
    ball.draw();
  handleBallCollision();
  handleEdgeCollision();
}

function handleBallCollision() {
  let dx = blueBall.x - redBall.x;
  let dy = blueBall.y - redBall.y;
  let dist = Math.sqrt(dx*dx + dy*dy);
  if (dist <= 2*props.ballRadius) {
    let cos = dx / dist;
    let sin = dy / dist;
    let add_1 = redBall.speed_x*cos + redBall.speed_y*sin;
    let add_1x = add_1*cos;
    let add_1y = add_1*sin;
    let add_0 = blueBall.speed_x*cos + blueBall.speed_y*sin;
    let add_0x = add_0*cos;
    let add_0y = add_0*sin;
    redBall.speed_x += add_0x - add_1x;
    redBall.speed_y += add_0y - add_1y;
    blueBall.speed_x += add_1x - add_0x;
    blueBall.speed_y += add_1y - add_0y;
  }
}
async function handleEdgeCollision() {
  for (let ball of balls) {
    if (ball.x + props.ballRadius > props.width
    || ball.x - props.ballRadius < 0
    || ball.y + props.ballRadius > props.height
    || ball.y - props.ballRadius < 0) {
      clearInterval(interval);
      await sleep(1500);
     emit(ball.color + 'Dead');
    }
  }
}
defineExpose({
  setupArena
});
</script>

<template>
  <canvas :width="width" :height="height" ref="canvas"></canvas>
</template>

<style>
canvas {
  border: 5px red solid;
}
</style>