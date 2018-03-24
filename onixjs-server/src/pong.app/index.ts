import {Application, MicroService} from '@onixjs/core';
import {PongModule} from './modules/pong.module';
/**
 * @class PongApp
 * @author Andres Jimenez
 * @license MIT
 * @description This example app is used as example
 * and for testing purposes. It imports a TodoModule.
 */
@MicroService({
  host: '127.0.0.1',
  port: 8081,
  modules: [PongModule],
})
export class PongApp extends Application {}
