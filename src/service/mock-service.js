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
}
