export default class EventModel {
  #events = null;

  constructor(service){
    this.service = service;
    this.#events = this.service.events;
  }

  get events(){
    return this.#events;
  }

  hasEvents(){
    return this.#events.length <= 1;
  }
}
