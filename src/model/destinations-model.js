export default class DestinationModel {
  #destinations = null;
  #service = null;

  constructor(service){
    this.#service = service;
  }

  async init(){
    this.#destinations = await this.#service.destinations;
    return this.#destinations;
  }

  get destinations(){
    return this.#destinations;
  }

  getById(id){
    return this.#destinations.find((destination) => destination.id === id);
  }
}
