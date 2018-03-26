class Paddle {
    constructor(left, sketch) {
      this.y = sketch.height / 2;
      this.w = 10;
      this.h = 100;
      this.ychange = 0;
      if (left) {
        this.x = this.w;
      } else {
        this.x = sketch.width - this.w;
      }
    }
    update(sketch){
      this.y += this.ychange;
      this.y = sketch.constrain(this.y, this.h/2, sketch.height - this.h/2);
    }
    move(steps) {
      this.ychange = steps;
    }
    show(sketch) {
        sketch.fill(255);
        sketch.rectMode(sketch.CENTER);
        sketch.rect(this.x,this.y,this.w,this.h);
    }
}
module.exports.Paddle = Paddle;