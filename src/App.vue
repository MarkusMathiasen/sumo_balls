<script>
import GameArena from './GameArena.vue'

export default {
  components: {
    GameArena
  }
}
</script>

<template>
  <GameArena ref="arena" :width="1700" :height="700" @redDead="$refs.arena.setup()" @blueDead="$refs.arena.setup()" />
</template>