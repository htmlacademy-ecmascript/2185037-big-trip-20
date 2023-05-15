import { render } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import SortView from '../view/sort-view.js';

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
    render(new EventEditView({
      event: this.events[0],
      destinations: this.destinationsModel.get(),
      offers: this.offersModel.get()
    }), this.eventListComponent.element());

    this.events.forEach((item) => {
      const offersByType = this.offersModel.getByType(item.type);
      render(new EventView({
        event: item,
        destination: this.destinationsModel.getById(item.destination),
        offers: this.offersModel.getByIds(offersByType, item.offers)
      }), this.eventListComponent.element());
    });
  }
}
