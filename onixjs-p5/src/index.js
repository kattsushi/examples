const p5 = require('p5');
require("p5/lib/addons/p5.dom");
const {OnixClient, AppReference} = require('@onixjs/sdk');
const {Browser} = require('@onixjs/sdk/dist/core/browser.adapters');
const {Paddle} = require('./paddle');
const {Puck} = require('./puck');

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
/**
 * @method setupSdk
 * 
 * @memberof Pong
 */
async setupSdk() {
    // Initialize the SDK
    await this.sdk.init();
    // Create an Application Reference
    const todoApp = await this.sdk.AppReference('PongApp');
    // Verify we got a valid AppReference, else throw the error.
    if (todoApp instanceof AppReference) {
      // Create Component Reference
      this.componentRef = todoApp.Module('PongModule').Component('PongComponent');
      // Create a listTodos stream reference
      this.componentRef.Method('listRooms').stream((rooms) => {
        this.rooms = rooms;
        this.rooms.forEach((e) => {
          this.listRoom(e);
        });
      });
    } else {
      throw todoApp;
    }
  }

  preload() {
    this.sdk = new OnixClient({
      host: 'http://127.0.0.1',
      port: 3000,
      adapters: {
        http: Browser.HTTP,
        websocket: Browser.WebSocket
      }
    });
    this.setupSdk();
  }

  setup() {
    var canvas = this.createCanvas(this.windowWidth, 500);
    var x = (this.windowWidth - this.width) / 2;
    var y = (this.windowHeight - this.height) / 2;
    puck = new Puck(this);
    left = new Paddle(true, this);
    right = new Paddle(false, this);
  }

  windowResized() {
    this.resizeCanvas(this.windowWidth + 10, 500);
  }
  
  draw() {
    this.background(0);
    puck.checkPaddleRight(right);
    puck.checkPaddleLeft(left);
    puck.update();
    puck.edges(this);
    puck.show(this);
    
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
