import { Module } from '@onixjs/core';
import { PongComponent } from './pong.component';
import { PongService } from './pong.service';
import { PlayerModel } from './player.model';
import { RoomModel } from './room.model';
/**
 * @class PongModule
 * @author Andres Jimenez
 * @license MIT
 * @description This demo module is for testing
 * purposes. It contains Todo related components
 */
@Module({
  models: [PlayerModel, RoomModel],
  services: [PongService],
  components: [PongComponent],
  renderers: [],
  lifecycle: async (app, metadata, method): Promise<any> => {
    // before call
    const result = await method();
    // after call
    return result;
  },
})
export class PongModule {}
