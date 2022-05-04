<script setup>
import GameArena from './GameArena.vue'
import { ref } from 'vue'

const redPoints = ref(0);
const bluePoints = ref(0);
const arena = ref(null);

function setupArena() {
  arena.value.setupArena();
}
function redDead() {
  bluePoints.value++;
  setupArena();
}
function blueDead() {
  redPoints.value++;
  setupArena();
}
</script>

<template>
  <GameArena ref="arena" :width="1500" :height="700" @redDead="redDead()" @blueDead="blueDead()" />
  <h3>Blue points: {{bluePoints}}</h3>
  <h3>Red points: {{redPoints}}</h3>
</template>