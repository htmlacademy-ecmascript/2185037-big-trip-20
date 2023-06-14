import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

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
  }

  get events(){
    return this.#events;
  }

  async init(){
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const events = await this.#service.events;
      this.#events = events.map(this.#adaptToClient);
      this._notify(UpdateType.INIT, {isError: false});
    } catch (error) {
      this.#events = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
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
    return this.#events.length > 0;
  }

  async update(updateType, update){
    const index = this.#events.findIndex((event) => event.id === update.id);

    try {
      const response = await this.#service.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response);
      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1)
      ];
      this._notify(updateType, update);
    } catch (error) {
      throw new Error('Can\'t update event');
    }
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
