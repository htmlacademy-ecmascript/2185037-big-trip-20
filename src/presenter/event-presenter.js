import { render, replace, remove } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import SortView from '../view/sort-view.js';

export default class EventPresenter {
  #eventListComponent = new EventListView();
  #eventContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;
  #events = null;

  constructor({
    eventContainer,
    destinationsModel,
    offersModel,
    eventsModel
  }){
    this.#eventContainer = eventContainer;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;

    this.#events = eventsModel.events;
  }

  init(){
    render(new SortView(), this.#eventContainer);
    render(this.#eventListComponent, this.#eventContainer);

    this.#events.forEach((item) => {
      this.#renderEvent(item);
    });
  }

  #renderEvent(item){
    const offersByType = this.#offersModel.getByType(item.type);

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventComponent = new EventView({
      event: item,
      destination: this.#destinationsModel.getById(item.destination),
      offers: this.#offersModel.getByIds(offersByType, item.offers),
      onEditClick: () => {
        replaceEventToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const eventEditComponent = new EventEditView({
      event: item,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: () => {
        replaceFormToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceEventToForm() {
      replace(eventEditComponent, eventComponent);
    }

    function replaceFormToEvent() {
      replace(eventComponent, eventEditComponent);
    }

    render(eventComponent, this.#eventListComponent.element);
  }
}
