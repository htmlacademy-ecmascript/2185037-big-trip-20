import { getRandomEvent, mockDestinations, mockOffers } from '../mock/event.js';

const EVENT_COUNT = 9;

export default class EventsModel {
  events = Array.from({length: EVENT_COUNT}, getRandomEvent);
  destinations = mockDestinations;
  offers = mockOffers;

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
