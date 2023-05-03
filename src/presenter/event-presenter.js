import EventView from '../view/event-view.js';
import EventListView from '../view/event-list-view.js';
import EventNewView from '../view/event-new-view.js';
import EventEditView from '../view/event-edit-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../render.js';

export default class EventPresenter {
  eventListComponent = new EventListView();

  constructor({eventContainer, eventsModel}){
    this.eventContainer = eventContainer;
    this.eventsModel = eventsModel;
  }

  init(){
    this.events = [...this.eventsModel.getEvents()];
    this.destinations = [...this.eventsModel.getDestinations()];
    this.offers = [...this.eventsModel.getOffers()];

    render(new SortView(), this.eventContainer);
    render(this.eventListComponent, this.eventContainer);
    render(new EventEditView(this.events[0], this.destinations, this.offers), this.eventListComponent.getElement());
    render(new EventNewView(this.events[1], this.destinations, this.offers), this.eventListComponent.getElement());

    for (let i = 2; i < this.events.length; i++) {
      render(new EventView(this.events[i],this.destinations, this.offers), this.eventListComponent.getElement());
    }

  }
}
