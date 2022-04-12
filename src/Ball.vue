<script>
export default {
  props: {
    radius: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
  },
  emits: ['touchEdge'],
  data() {
    return {
      x: 0,
      y: 0,
      speed_x: 0,
      speed_y: 0
    }
  },
  methods: {
    move() {
      this.undraw();  
      this.x += this.speed_x;
      this.y += this.speed_y;
      this.draw();
    },
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    },
    undraw(ctx) {
      ctx.clearRect(this.x-this.radius-2, this.y-this.radius-2, this.radius*2+4, this.radius*2+4);
    }
  }
}
</script>

<template>
</template>