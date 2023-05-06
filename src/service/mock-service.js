import { getEventsFromServer } from '../mock/event.js';
import { getDestinationsFromServer } from '../mock/destination.js';
import { getOffersFromServer } from '../mock/offer.js';

export default class MockService {
  constructor() {
    this.events = getEventsFromServer();
    this.destinations = getDestinationsFromServer();
    this.offers = getOffersFromServer();
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
