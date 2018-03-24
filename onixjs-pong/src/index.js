const p5 = require('p5');
const {OnixClient, AppReference} = require('@onixjs/sdk');
const {Browser} = require('@onixjs/sdk/dist/core/browser.adapters');
const {Paddle} = require('./paddle');
const {Puck} = require('./puck');

let puck, left, right, ding, sdk, docsApp, postComponentRef;

let setup = async() => {
    // Initialize the SDK
    await sdk.init();
    // Create an Application Reference
    const todoApp = await sdk.AppReference('TodoApp');
    // Verify we got a valid AppReference, else throw the error.
    if (todoApp instanceof AppReference) {
      // Create Component Reference
      this.componentRef = todoApp.Module('TodoModule').Component('TodoComponent');
      // Create a listTodos stream reference
      this.componentRef.Method('listTodos').stream((todos) => {
        console.log(todos);
      });
    } else {
      throw todoApp;
    }
}
let pong = new p5((sketch) => {
  sketch.preload = ()=> {
    sdk = new OnixClient({
      host: 'http://127.0.0.1',
      port: 3000,
      adapters: {
        http: Browser.HTTP,
        websocket: Browser.WebSocket
      }
    });
    setup();
  }

  sketch.setup =()=> {
    var canvas = sketch.createCanvas(sketch.windowWidth, 400);
    var x = (sketch.windowWidth - sketch.width) / 2;
    var y = (sketch.windowHeight - sketch.height) / 2;
    canvas.parent('pong');
    puck = new Puck(sketch);
    left = new Paddle(true, sketch);
    right = new Paddle(false, sketch);
  }

  sketch.windowResized = () => {
    resizeCanvas(sketch.windowWidth, 400);
  }
  
  sketch.draw = () => {
    sketch.background(0);
    puck.checkPaddleRight(right);
    puck.checkPaddleLeft(left);
  
    left.show(sketch);
    right.show(sketch);
    left.update();
    right.update();
    puck.update();
    puck.edges();
    let rightScore = puck.getScoreRight();
    let leftScore = puck.getScoreLeft();
    puck.show(sketch);
  
    sketch.fill(255);
    sketch.textSize(32);
    sketch.text(leftScore, 32, 40);
    sketch.text(rightScore, sketch.width - 64, 40);
  }
  sketch.keyReleased = () => {
    left.move(0);
    right.move(0);
  }
  sketch.keyPressed = () => {
    if (sketch.key == 'A') {
      left.move(-10);
    } else if (sketch.key === 'Z'){
      left.move(10);
    }
  
    if (sketch.key == 'J') {
      right.move(-10);
    } else if (sketch.key == 'M'){
      right.move(10);
    }
  };
}, '.pong');
