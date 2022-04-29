<script>
import GameArena from './GameArena.vue'

export default {
  components: {
    GameArena
  },
  data() {
    return {
      redPoints: 0,
      bluePoints: 0
    }
  },
  methods: {
    setupArena() {
      this.$refs.arena.setup();
    },
    redDead() {
      this.redPoints++;
      this.setupArena();
    },
    blueDead() {
      this.bluePoints++;
      this.setupArena();
    }
  }
}
</script>

<template>
  <GameArena ref="arena" :width="1700" :height="700" @redDead="redDead()" @blueDead="blueDead()" />
  <h3>Blue points: {{bluePoints}}</h3>
  <h3>Red points: {{redPoints}}</h3>
</template>