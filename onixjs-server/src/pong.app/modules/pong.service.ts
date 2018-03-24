import {Inject, Service} from '@onixjs/core';
import {Model} from 'mongoose';
import { RoomModel } from './room.model';
// import { PlayerModel } from './player.model';
/**
 * @class PongService
 * @author Andres Jimenez
 * @license MIT
 * @description Example class that explains how to create
 * module level injectable services.
 *
 * Injectable services won't be directly accessible from
 * other modules or applications
 */
@Service()
export class PongService {
  /**
   * @property model
   * @description This is a dependency injection example.
   * Here we inject a singleton instance of RoomModel.
   *
   * Models and Services are injectables either from
   * Components or other Services, but are not exposed
   * through the RPC API as the component methods does.
   */
  @Inject.Model(RoomModel) private roomModel: Model<RoomModel>;
  // @Inject.Model(PlayerModel) private playerModel: Model<PlayerModel>;
  
  /**
   * @method createRoom
   * @param Room
   * @returns Promise<RoomModel>
   * @description Example method of a service providing access
   * to a model method. Technically the model could be directly
   * injected within a component, but doing it within a service
   * allows to re-use these methods within different components.
   */
  async createRoom(room: RoomModel): Promise<RoomModel> {
    return this.roomModel.create(room);
  }
  /**
   * @method findRoom
   * @returns Promise<RoomModel>
   * @description Example method of a service providing access
   * to a model method.
   */
  async findRoom(): Promise<any[]> {
    return this.roomModel.find();
  }
  /**
   * @method findRoom
   * @returns Promise<RoomModel>
   * @description Example method of a service providing access
   * to a model method.
   */
  async findRoomById(id): Promise<RoomModel[]> {
    return this.roomModel.findById();
  }
  /**
   * @method removeRoom
   * @returns Promise<RoomModel>
   * @description Example method of a service providing access
   * to a model method.
   */
  async removeRoom(Room: RoomModel): Promise<RoomModel> {
    return this.roomModel.remove(Room);
  }
}
