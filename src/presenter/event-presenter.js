import EventView from '../view/event-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../render.js';

export default class EventPresenter {
  eventListComponent = new EventListView();

  constructor({
    eventContainer,
    destinationsModel,
    offersModel,
    eventsModel
  }){
    this.eventContainer = eventContainer;

    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.eventsModel = eventsModel;

    this.events = eventsModel.get();
  }

  init(){
    render(new SortView(), this.eventContainer);
    render(this.eventListComponent, this.eventContainer);
    // render(new EventEditView(events[0]), this.eventListComponent.getElement());

    this.events.forEach((item) => {
      render(new EventView({
        event: item,
        destination: this.destinationsModel.getById(item.destination),
        offer: this.offersModel
      }), this.eventListComponent.getElement());
    });
  }
}
