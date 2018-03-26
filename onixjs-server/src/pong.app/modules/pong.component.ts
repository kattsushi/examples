import { IComponent, Inject, Component, RPC, Stream } from '@onixjs/core';
import { PongService } from './pong.service';
import { EventEmitter } from 'events';
import { RoomModel } from './room.model';
/**
 * @class PongComponent
 * @author Andres Jimenez
 * @license MIT
 * @description This class is an example of how to
 * declare components for your application.
 *
 * It must implement the IComponent interface.
 */
@Component({
  // Optional component level lifecycle
  // will execute on every RPC Call, do your magic here. :)
  lifecycle: async (app, metadata, method): Promise<any> => {
    // before call
    const result = await method();
    // after call
    console.log('Custom Logger: ', result);
    return result;
  },
})
export class PongComponent implements IComponent {
  /**
   * @prop emmiter
   * @description Event emmiter will be used for
   * the pub-sub pattern.
   */
  private emmiter: EventEmitter = new EventEmitter();
  /**
   * @property service
   * @description This is a dependency injection example.
   * Here we inject a singleton instance of TodoService.
   */
  @Inject.Service(PongService) private service: PongService;
  /**
   * @method init
   * @description This method will be executed by the framework
   * when everything has been configured.
   */
  init() {
    // Some emmiters won't require a max number of listeners
    // Others will. That is up to you and your infrastructure.
    // You can also use Mongo/Redis PubSub instead of Emmiters
    this.emmiter.setMaxListeners(0);
  }
    /**
   * @method addRoom
   * @param room
   * @returns Promise<RoomModel>
   * @description Example method of how to expose through
   * RPC methods that internally might add business logic
   * or database/services calls.
   */
  @RPC()
  async addRoom(room: RoomModel): Promise<RoomModel> {
    const result = await this.service.createRoom(room);
    this.emmiter.emit('onCreate', result);
    return result;
  }
  /**
   * @method removeRoom
   * @param room
   * @returns Promise<RoomModel>
   * @description Example method of how to expose through
   * RPC methods that internally might add business logic
   * or database/services calls.
   */
  @RPC()
  async removeRoom(room: RoomModel): Promise<RoomModel> {
    console.log(room);
    const result = await this.service.removeRoom(room);
    this.emmiter.emit('onRemove', result);
    return result;
  }
  /**
   * @method listRooms
   * @param room
   * @returns Promise<TodoModel>
   * @description Example of endpoint listing rooms, this will
   * return an initial list of roons, then will update
   * on every created or removed room.
   */
  @Stream()
  async listRooms(stream) {
    // Publish initial stream
    this.publish(stream);
    // Publish on create todos
    this.emmiter.on('onCreate', () => this.publish(stream));
    // Publish on remove todos
    this.emmiter.on('onRemove', () => this.publish(stream))
  }
  /**
   * @method publish
   * @param stream 
   * @description This method will publish a list of todos
   * to the given stream instance.
   */
  private async publish(stream) {
    const room: any[] = await this.service.findRoom();
    stream(room);
  }
  /**
   * @method onCreate
   * @param room
   * @description Example method of how to implement the
   * pub-sub pattern. Clients will subscribe to this stream
   * and receive each new created todo.
   */
  @Stream()
  onCreate(stream: (todo: any) => void) {
    this.emmiter.on('onCreate', (todo: any) => stream(todo));
  }
  /**
   * @method destroy
   * @param room
   * @description Destroy method will be executed before terminating
   * an application process.
   */
  destroy() { }
}
