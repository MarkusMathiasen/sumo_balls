<script>
import Ball from './Ball.vue'

export default {
  components: {
    Ball
  },
  props: {
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
  },
  emits: ['redDead', 'blueDead'],
  data() {
    return {
      interval: null,
      ctx: null,
      keysPressed: []
    }
  },
  computed: {
    balls() {
      return [this.$refs.redBall, this.$refs.blueBall];
    }
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup);
    this.setup();
  },
  methods: {
    keydown(e) {
      this.keysPressed[e.keyCode] = true;
    },
    keyup(e) {
      this.keysPressed[e.keyCode] = false;
    },
    sleep(ms) {  
      return new Promise(resolve => setTimeout(resolve, ms));  
    },
    setup() {
      for (let ball of this.balls) {
        ball.speed_x = 0;
        ball.speed_y = 0;
        ball.y = this.height/2;
      }
      this.$refs.redBall.x = this.width/4;
      this.$refs.blueBall.x = 3*this.width/4;
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (let ball of this.balls)
        ball.draw(this.ctx);
      this.interval = setInterval(this.update, 20);
    },
    update() {
      for (let ball of this.balls)
        ball.undraw(this.ctx);
      this.updateSpeeds();
      this.checkCollision();
      this.updatePositions();
      for (let ball of this.balls)
        ball.draw(this.ctx);
    },
    updateSpeeds() {
      if (this.keysPressed[37]) this.$refs.blueBall.speed_x -= this.acceleration;
      if (this.keysPressed[38]) this.$refs.blueBall.speed_y -= this.acceleration;
      if (this.keysPressed[39]) this.$refs.blueBall.speed_x += this.acceleration;
      if (this.keysPressed[40]) this.$refs.blueBall.speed_y += this.acceleration;

      if (this.keysPressed[65]) this.$refs.redBall.speed_x -= this.acceleration;
      if (this.keysPressed[87]) this.$refs.redBall.speed_y -= this.acceleration;
      if (this.keysPressed[68]) this.$refs.redBall.speed_x += this.acceleration;
      if (this.keysPressed[83]) this.$refs.redBall.speed_y += this.acceleration;
    },
    checkCollision() {
      let dx = this.$refs.blueBall.x - this.$refs.redBall.x;
      let dy = this.$refs.blueBall.y - this.$refs.redBall.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist <= 2*this.ballRadius) {
        let cos = dx / dist;
        let sin = dy / dist;
        let add_1 = this.$refs.redBall.speed_x*cos + this.$refs.redBall.speed_y*sin;
        let add_1x = add_1*cos;
        let add_1y = add_1*sin;
        let add_0 = this.$refs.blueBall.speed_x*cos + this.$refs.blueBall.speed_y*sin;
        let add_0x = add_0*cos;
        let add_0y = add_0*sin;
        this.$refs.redBall.speed_x += add_0x - add_1x;
        this.$refs.redBall.speed_y += add_0y - add_1y;
        this.$refs.blueBall.speed_x += add_1x - add_0x;
        this.$refs.blueBall.speed_y += add_1y - add_0y;
      }
    },
    async updatePositions() {
      for (let ball of this.balls) {
        ball.x += ball.speed_x;
        ball.y += ball.speed_y;
        if (ball.x + this.ballRadius > this.width
        || ball.x - this.ballRadius < 0
        || ball.y + this.ballRadius > this.height
        || ball.y - this.ballRadius < 0) {
          clearInterval(this.interval);
          await this.sleep(1500);
          this.$emit(ball.color + 'Dead');
        }
      }
    }
  }
}
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