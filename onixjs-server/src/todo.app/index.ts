import {Application, MicroService} from '@onixjs/core';
import {TodoModule} from './modules/todo.module';
/**
 * @class TodoApp
 * @author Jonathan Casarrubias
 * @license MIT
 * @description This example app is used as example
 * and for testing purposes. It imports a TodoModule.
 */
@MicroService({
  port: 8080,
  modules: [TodoModule],
})
export class TodoApp extends Application {}
