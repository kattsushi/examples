import { IComponent, Inject, Component, RPC, Stream } from '@onixjs/core';
import { PongService } from './pong.service';
import { EventEmitter } from 'events';
// import { RoomModel } from './room.model';
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
    this.emmiter.setMaxListeners(10);
  }
    /**
   * @method updatePuck
   * @param puck
   * @returns Promise<RoomModel>
   * @description Example method of how to expose through
   * RPC methods that internally might add business logic
   * or database/services calls.
   */
  @RPC()
  updatePuck(puck: any) {
    this.service.puck = puck;
    this.emmiter.emit('onUpdate', puck);
    return new Promise(resolve => resolve(puck));
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
  async getPuck(stream) {
    // Publish initial stream
    this.publish(stream);
    // Publish on create todos
    this.emmiter.on('onUpdate', () => this.publish(stream));
  }
  /**
   * @method publish
   * @param stream 
   * @description This method will publish a list of todos
   * to the given stream instance.
   */
  private async publish(stream) {
    const puck: any =  this.service.puck;
    stream(puck);
  }
}
