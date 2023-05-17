import { render, replace } from '../framework/render.js';
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
  }

  init(){
    this.#events = this.#eventsModel.events;

    this.#renderListEvents();
  }

  #renderEvent(item){
    const offersByType = this.#offersModel.getByType(item.type);

    const eventComponent = new EventView({
      event: item,
      destination: this.#destinationsModel.getById(item.destination),
      offers: this.#offersModel.getByIds(offersByType, item.offers),
      onEditClick: eventEditClickHandler
    });

    const eventEditComponent = new EventEditView({
      event: item,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: eventSubmitHandler
    });

    const replaceEventToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(eventComponent, eventEditComponent);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function eventEditClickHandler() {
      replaceEventToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function eventSubmitHandler() {
      replaceFormToEvent();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(eventComponent, this.#eventListComponent.element);
  }

  #renderListEvents(){
    render(new SortView(), this.#eventContainer);
    render(this.#eventListComponent, this.#eventContainer);

    this.#events.forEach((item) => {
      this.#renderEvent(item);
    });
  }
}
