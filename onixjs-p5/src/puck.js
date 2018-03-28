const p5 = require('p5');
const {OnixClient, AppReference} = require('@onixjs/sdk');
const {Browser} = require('@onixjs/sdk/dist/core/browser.adapters');
// const {Service} = require('./service');
let leftScore = 0;
let rightScore = 0;
class Puck {
    constructor(sketch) {
      this.sdk = new OnixClient({
        host: 'http://127.0.0.1',
        port: 3000,
        adapters: {
          http: Browser.HTTP,
          websocket: Browser.WebSocket
        }
      });
    }
    /**
     * @method setupSdk
     * 
     * @memberof Service
     */
    async setup() {
      // Initialize the SDK
      await this.sdk.init();
      // Create an Application Reference
      const todoApp = await this.sdk.AppReference('PongApp');
      // Verify we got a valid AppReference, else throw the error.
      this.puck = null;
      if (todoApp instanceof AppReference) {
          // Create Component Reference
          this.componentRef = todoApp.Module('PongModule').Component('PongComponent');
          this.componentRef.Method('getPuck').stream((puck) => {
            console.log(puck);
            this.x = puck.x;
            this.y = puck.y;
            this.xspeed = puck.xspeed;
            this.yspeed = puck.yspeed;
            this.r = puck.r;
          });
      } else {
        throw todoApp;
      }
    }
    async updatePuck(puck) {
      console.log(puck);
      await this.componentRef.Method('updatePuck').call(puck);
    }
    async checkPaddleLeft(p) {
      if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2  && this.x - this.r < p.x + p.w/2 ) {
        // if (this.x < p.x) {
          let diff = this.y - (p.y - p.h /2);
          let rad = Math.radians(45);
          let angle = Math.map(diff, 0, p.h, -rad, rad);
          let xspeed = 25 * Math.cos(angle);
          let yspeed = 25 * Math.sin(angle);
          let x = p.x - (p.w /2) -this.r;
          await this.updatePuck({xspeed, yspeed, x});
          // this.xspeed *= -1;
        // }
      }
    }
    async checkPaddleRight(p) {
      if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2  && this.x + this.r > p.x - p.w/2 ) {
        // if (this.x < p.x) {
          let diff = this.y -(p.y - p.h /2);
          let rad = Math.radians(135);
          let angle = Math.map(diff, 0, p.h, -rad, rad);
          let xspeed = 25 * Math.cos(angle);
          let yspeed = 25 * Math.sin(angle);
          let x = p.x - (p.w /2) - this.r;
          await this.updatePuck({xspeed, yspeed, x});
          // this.xspeed *= -1;
        // }jjjmj
      }
    }
  
    update() {
      this.x = this.x + this.xspeed;
      this.y = this.y + this.yspeed;
    }
    edges(sketch){
        if (this.y < 0 || this.y > sketch.height) {
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
    getScoreLeft(sketch) {
     if( this.x - this.r > sketch.width ) {
       leftScore++;
    //    this.reset();
       return leftScore;
     }
     return leftScore;
    }
    async reset(sketch) {
      let r = 12;
      let x = sketch.width / 2;
      let y = sketch.height / 2;
      
      let angle = this.getRndInteger(-sketch.PI/4, sketch.PI/4);
      let xspeed = 5 * Math.cos(this.angle);
      let yspeed = 5 * Math.sin(this.angle);
      if( this.getRndInteger(1) < 0.5) {
        this.xspeed *= -1;
        let xspeed = this.xspeed;
      }
      await this.updatePuck({xspeed, yspeed, x, y});
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