class Paddle {
    constructor(left, sketch) {
      this.sketch = sketch;
      this.y = this.sketch.height / 2;
      this.w = 10;
      this.h = 100;
      this.ychange = 0;
      if (left) {
        this.x = this.w;
      } else {
        this.x = this.sketch.width - this.w;
      }
    }
    update(){
      this.y += this.ychange;
      this.y = this.sketch.constrain(this.y, this.h/2, this.sketch.height - this.h/2);
    }
    move(steps) {
      this.ychange = steps;
    }
    show(sketch) {
        sketch.fill(255);
        sketch.rectMode(this.sketch.CENTER);
        sketch.rect(this.x,this.y,this.w,this.h);
    }
}
module.exports.Paddle = Paddle;