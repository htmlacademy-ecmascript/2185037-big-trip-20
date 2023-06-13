import Observable from '../framework/observable.js';

export default class EventModel extends Observable {
  #events = [];
  #service = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({service, destinationsModel, offersModel}){
    super();
    this.#service = service;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#service.events.then((events) => {
      console.log(events.map(this.#adaptToClient));
    });
  }

  get events(){
    return this.#events;
  }

  #adaptToClient(event){
    const adaptedEvent = {...event,
      basePrice: event.base_price,
      dateFrom: event.date_from,
      dateTo: event.date_to,
      isFavorite: event.is_favorite
    };

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
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
