export default class EventModel {
  constructor(service){
    this.service = service;
    this.events = this.service.getEvents();
  }

  get(){
    return this.events;
  }
}
