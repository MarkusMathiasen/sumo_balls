<script setup>
import { ref } from 'vue'
const props = defineProps({
  radius: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
});

const emit = defineEmits(['touchEdge']);
let x = ref(0);
let y = ref(0);
let speed_x = ref(0);
let speed_y = ref(0);
function move() {
  undraw();  
  x.value += speed_x;
  y.value += speed_y;
  draw();
}
function draw(ctx) {
  ctx.beginPath();
  ctx.arc(x.value, y.value, props.radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = props.color;
  ctx.fill();
}
function undraw(ctx) {
  ctx.clearRect(x.value-props.radius-2, y.value-props.radius-2, props.radius*2+4, props.radius*2+4);
}
function getColor() {
  return props.color;
}
defineExpose({x, y, speed_x, speed_y, draw, move, undraw, getColor})
</script>

<template>
</template>