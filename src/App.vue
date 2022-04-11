<script>
export default {
  data() {
    return {
      width: 1700,
      height: 700,
      interval: null,
      ctx: null,
      radius: 50,
      acceleration: 0.2,
      balls: [{
          id: 0,
          x: 0,
          y: 0,
          speed_x: 0,
          speed_y: 0,
          color: 'blue',
          points: 0
        },
        {
          id: 1,
          x: 0,
          y: 0,
          speed_x: 0,
          speed_y: 0,
          color: 'red',
          points: 0
        }
      ],
      keysPressed: []
    }
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup);
    this.setup();

    this.interval = setInterval(this.updateCanvas, 20);
  },
  methods: {
    setup() {
      for (let ball of this.balls) {
        ball.speed_x = ball.speed_y = 0;
        ball.y = this.height/2;
      }
      this.balls[0].x = this.width/4;
      this.balls[1].x = 3*this.width/4;
      this.ctx.clearRect(0, 0, this.width, this.height);
    },
    keydown(e) {
      this.keysPressed[e.keyCode] = true;
      console.log("pressed: " + e.keyCode);
    },
    keyup(e) {
      this.keysPressed[e.keyCode] = false;
      console.log("released: " + e.keyCode);
    },
    drawBalls() {
      for (let ball of this.balls) {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
      }
    },
    updateBalls() {
      if (this.keysPressed[37]) this.balls[1].speed_x -= this.acceleration;
      if (this.keysPressed[38]) this.balls[1].speed_y -= this.acceleration;
      if (this.keysPressed[39]) this.balls[1].speed_x += this.acceleration;
      if (this.keysPressed[40]) this.balls[1].speed_y += this.acceleration;

      if (this.keysPressed[65]) this.balls[0].speed_x -= this.acceleration;
      if (this.keysPressed[87]) this.balls[0].speed_y -= this.acceleration;
      if (this.keysPressed[68]) this.balls[0].speed_x += this.acceleration;
      if (this.keysPressed[83]) this.balls[0].speed_y += this.acceleration;

      this.checkCollision();

      for (let ball of this.balls) {
        ball.x += ball.speed_x;
        ball.y += ball.speed_y;
        if (ball.x + this.radius-5 > this.width
        || ball.x - this.radius+5 < 0
        || ball.y + this.radius-5 > this.height
        || ball.y - this.radius+5 < 0) {
          this.balls[1-ball.id].points++;
          this.setup();
        }
      }
    },
    checkCollision() {
      let ball_0 = this.balls[0];
      let ball_1 = this.balls[1];
      let dx = ball_1.x - ball_0.x;
      let dy = ball_1.y - ball_0.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist <= 2*this.radius) {
        let cos = dx / dist;
        let sin = dy / dist;
        let add_1 = ball_0.speed_x*cos + ball_0.speed_y*sin;
        let add_1x = add_1*cos;
        let add_1y = add_1*sin;
        let add_0 = ball_1.speed_x*cos + ball_1.speed_y*sin;
        let add_0x = add_0*cos;
        let add_0y = add_0*sin;
        this.balls[0].speed_x += add_0x - add_1x;
        this.balls[0].speed_y += add_0y - add_1y;
        this.balls[1].speed_x += add_1x - add_0x;
        this.balls[1].speed_y += add_1y - add_0y;
      }
    },
    updateCanvas() {
      for (let ball of this.balls)
        this.ctx.clearRect(ball.x-this.radius-5, ball.y-this.radius-5, this.radius*2+10, this.radius*2+10);
      this.updateBalls();
      this.drawBalls();
    }
  }
}
</script>

<template>
  <canvas :width="width" :height="height" ref="canvas"></canvas>
  <h4 v-for="ball in balls">{{ ball.color }} has {{ ball.points }} points</h4>
</template>

<style>
canvas {
  border: 5px red solid;
}
</style>