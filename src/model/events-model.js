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
    return this.#events.length <= 1;
  }
}
