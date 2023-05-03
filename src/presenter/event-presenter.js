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

    render(new SortView(), this.eventContainer);
    render(this.eventListComponent, this.eventContainer);
    render(new EventEditView(), this.eventListComponent.getElement());
    render(new EventNewView(), this.eventListComponent.getElement());

    for (let i = 0; i < this.events.length; i++) {
      render(new EventView(this.events[i]), this.eventListComponent.getElement());
    }

  }
}
