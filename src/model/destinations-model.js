export default class DestinationModel {
  #destinations = null;

  constructor(service){
    this.service = service;
    this.#destinations = this.service.destinations;
  }

  get destinations(){
    return this.#destinations;
  }

  getById(id){
    return this.#destinations.find((destination) => destination.id === id);
  }
}
