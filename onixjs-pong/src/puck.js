const p5 = require('p5');
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};
Math.map = function(n, start1, stop1, start2, stop2, withinBounds) {
    p5._validateParameters('map', arguments);
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return this.constrain(newval, start2, stop2);
    } else {
        return this.constrain(newval, stop2, start2);
    }
};
let leftScore = 0;
let rightScore = 0;
class Puck {
    constructor(skecth) {
      this.skecth = skecth;
      this.x = this.skecth.width / 2;
      this.y = this.skecth.height / 2;
      this.xspeed;
      this.yspeed;
      this.r = 12;
      this.reset();
    }
    checkPaddleLeft(p) {
      if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2  && this.x - this.r < p.x + p.w/2 ) {
        // if (this.x < p.x) {
          let diff = this.y - (p.y - p.h /2);
          let rad = Math.radians(45);
          let angle = Math.map(diff, 0, p.h, -rad, rad);
          this.xspeed = 25 * Math.cos(angle);
          this.yspeed = 25 * Math.sin(angle);
          this.x = p.x - (p.w /2) -this.r;
          // this.xspeed *= -1;
        // }
      }
    }
    checkPaddleRight(paddle) {
      let p = paddle;
      if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2  && this.x + this.r > p.x - p.w/2 ) {
        // if (this.x < p.x) {
          let diff = this.y -(p.y - p.h /2);
          let rad = Math.radians(135);
          let angle = Math.map(diff, 0, p.h, -rad, rad);
          this.xspeed = 25 * Math.cos(angle);
          this.yspeed = 25 * Math.sin(angle);
          this.x = p.x - (p.w /2) - this.r;
          // this.xspeed *= -1;
        // }jjjmj
      }
    }
  
    update() {
      this.x = this.x + this.xspeed;
      this.y = this.y + this.yspeed;
    }
    edges(){
        if (this.y < 0 || this.y > this.skecth.height) {
            this.yspeed *= -1;
        }
        // if (this.x + this.r < 0) {
        //       this.reset();
        // }
        // if( this.x - this.r > this.skecth.width ) {
        //        this.reset();
        // }
    }
    getScoreRight() {
        if (this.x + this.r < 0) {
          rightScore++;
        //   this.reset();
          return rightScore;
        }
        return rightScore;
    }
    getScoreLeft() {
     if( this.x - this.r > this.skecth.width ) {
       leftScore++;
    //    this.reset();
       return leftScore;
     }
     return leftScore;
    }
    reset() {
      this.x = this.skecth.width / 2;
      this.y = this.skecth.height / 2;
      
      this.angle = this.getRndInteger(-this.skecth.PI/4, this.skecth.PI/4);
      this.xspeed = 5 * Math.cos(this.angle);
      this.yspeed = 5 * Math.sin(this.angle);
      if( this.getRndInteger(1) < 0.5) {
        this.xspeed *= -1;
      }
    }
    show(sketch) {
        sketch.fill(255);
        sketch.ellipse(this.x, this.y, this.r*2, this.r*2);
    }
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
  }
module.exports.Puck = Puck;