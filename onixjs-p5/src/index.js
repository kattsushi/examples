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
  setRooms() {
    this.newRoomInput = this.createInput();
    this.newRoomInput.position(this.height / 2, 290 );
    this.addButtonRoom = this.createButton('Add new Room');
    this.addButtonRoom.mouseClicked(() => this.addRoom());
    this.addButtonRoom.position(this.newRoomInput.x + this.newRoomInput.width, 290);
  }

  /**
   * @method addRoom
   * @description Uses the component reference to call the addTodo remote method.
   * It will create a new todo on the database.
   */
  async addRoom() {
    // if (this.rooms.lenght <= 5 ) {
      await this.componentRef.Method('addRoom').call({ name: this.newRoomInput.value() });
      this.newRoomInput.value('');
    // }
  }
  /**
   * @method removeTodo
   * @description Uses the component reference to call the removeTodo remote method.
   * It will remove a given todo from the database.
   */
  async deleteRoom(room) {
    console.log(room);
    await this.componentRef.Method('removeRoom').call(room);
    this.rooms = this.rooms.filter((e) => e !== room);
  }
  /**
   * @method listRoom
   * @description Uses the component reference to call the addTodo remote method.
   * It will create a new todo on the database.
   */
  listRoom(e) {
    const room = this.createElement('h2', e.name);
    room.position(this.newRoomInput.x, this.newRoomInput.y + 20);
    room.style('color: white');

    const buttonDelete = this.createButton('delete room');
    buttonDelete.mouseClicked(() => {
      this.deleteRoom(e);
    });
    buttonDelete.position(room.x + 290, room.y);
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
    canvas.parent('pong');
    this.setRooms();
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
  
    left.show(this);
    right.show(this);
    left.update(this);
    right.update(this);
    puck.update();
    puck.edges(this);
    let rightScore = puck.getScoreRight();
    let leftScore = puck.getScoreLeft(this);
    puck.show(this);
  
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
