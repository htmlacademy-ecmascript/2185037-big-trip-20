import { Events } from '../mock/event.js';
import { Destinations } from '../mock/destination.js';
import { Offers } from '../mock/offer.js';

export default class MockService {
  #events = null;
  #destinations = null;
  #offers = null;

  constructor() {
    this.#events = Events;
    this.#destinations = Destinations;
    this.#offers = Offers;
  }

  get events(){
    return this.#events;
  }

  get destinations(){
    return this.#destinations;
  }

  get offers(){
    return this.#offers;
  }

  updateEvent(update){
    const index = this.#events.findIndex((event) => event.id === update.id);

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1)
    ];
  }

  addEvent(event){
    this.#events = [
      event,
      ...this.#events
    ];
  }

  deleteEvent(update){
    const index = this.#events.findIndex((event) => event.id === update.id);

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1)
    ];
  }
}
