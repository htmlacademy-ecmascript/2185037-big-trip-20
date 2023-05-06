import { Events } from '../mock/event.js';
import { Destinations } from '../mock/destination.js';
import { Offers } from '../mock/offer.js';

export default class MockService {
  constructor() {
    this.events = Events;
    this.destinations = Destinations;
    this.offers = Offers;
  }

  getEvents(){
    return this.events;
  }

  getDestinations(){
    return this.destinations;
  }

  getOffers(){
    return this.offers;
  }
}
