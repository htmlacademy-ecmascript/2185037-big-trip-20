export default class EventModel {
  constructor(service){
    this.service = service;
    this.events = this.service.events;
  }

  get(){
    return this.events;
  }
}
