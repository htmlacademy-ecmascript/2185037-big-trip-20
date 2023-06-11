import Observable from '../framework/observable.js';

export default class EventModel extends Observable {
  #events = [];
  #service = null;

  constructor(service){
    super();
    this.#service = service;
    this.#events = this.#service.events;
  }

  get events(){
    return this.#events;
  }

  hasEvents(){
    return this.#events.length < 1;
  }

  update(updateType, update){
    const index = this.#events.findIndex((event) => event.id === update.id);

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1)
    ];
    this._notify(updateType, update);
  }

  add(updateType, update){
    this.#events = [
      update,
      ...this.#events
    ];
    this._notify(updateType, update);
  }

  delete(updateType, update){
    const index = this.#events.findIndex((event) => event.id === update.id);

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1)
    ];
    this._notify(updateType, update);
  }
}
