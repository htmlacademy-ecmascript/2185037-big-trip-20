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

  update(updateType, update){
    this.#events = this.#service.updateEvent(update);
    this._notify(updateType, update);
  }

  add(updateType, event){
    this.#events = this.#service.addEvent(event);
    this._notify(updateType, event);
  }

  delete(updateType, event){
    this.#events = this.#service.deleteEvent(event);
    this._notify(updateType, event);
  }
}
