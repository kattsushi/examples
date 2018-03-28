const p5 = require('p5');
require("p5/lib/addons/p5.dom");
const {Paddle} = require('./paddle');
const {Puck} = require('./puck');
// const {Service} = require('./service');

let puck, left, right, ding;
/**
 * Onixjs Pong Example P5
 * 
 * @class Pong
 * @author Andres Jimenez
 * @license MIT
 * @extends {p5}
 *
 */
class Pong extends p5 {
  constructor(sketch = ()=> {}, node = false, sync = false) {
    super(sketch, node, sync);
    this.preload = this.preload.bind(this);
    this.setup = this.setup.bind(this);
    this.draw = this.draw.bind(this);
    this.windowResized = this.windowResized.bind(this);
    this.keyReleased = this.keyReleased.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
  }

  preload() {
    // this.sdk = new Service();
    // this.sdk.setup();
  }

  async setup() {
    var canvas = this.createCanvas(this.windowWidth, 500);
    var x = (this.windowWidth - this.width) / 2;
    var y = (this.windowHeight - this.height) / 2;
    puck = new Puck(this);
    await puck.setup();
    puck.reset(this);
    left = new Paddle(true, this);
    right = new Paddle(false, this);
  }

  windowResized() {
    this.resizeCanvas(this.windowWidth + 10, 500);
  }
  
  async draw() {
    this.background(0);
    if (puck.componentRef) {
      puck.show(this);
      await puck.update();
      await puck.checkPaddleRight(right);
      await puck.checkPaddleLeft(left);
      puck.edges(this);

      left.show(this);
      right.show(this);
      left.update(this);
      right.update(this);
      let rightScore = puck.getScoreRight();
      let leftScore = puck.getScoreLeft(this);
    
      this.fill(255);
      this.textSize(32);
      this.text(leftScore, 32, 40);
      this.text(rightScore, this.width - 64, 40);
    }
  }
  keyReleased() {
    left.move(0);
    right.move(0);
  }
  keyPressed() {
    if (this.key == 'A') {
      left.move(-10);
    } else if (this.key === 'Z'){
      left.move(10);
    }
  
    if (this.key == 'J') {
      right.move(-10);
    } else if (this.key == 'M'){
      right.move(10);
    }
  };
}
let pong = new Pong();
