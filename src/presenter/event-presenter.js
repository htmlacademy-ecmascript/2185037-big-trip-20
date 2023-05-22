import { render, replace } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

export default class EventPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;

  #eventComponent = null;
  #eventEditComponent = null;

  constructor({
    container,
    destinationsModel,
    offersModel
  }){
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(event){
    const offersByType = this.#offersModel.getByType(event.type);

    this.#eventComponent = new EventView({
      event,
      destination: this.#destinationsModel.getById(event.destination),
      offers: this.#offersModel.getByIds(offersByType, event.offers),
      onEditClick: eventEditClickHandler
    });

    this.#eventEditComponent = new EventEditView({
      event,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: eventSubmitHandler
    });

    const replaceEventToForm = () => {
      replace(this.#eventEditComponent, this.#eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(this.#eventComponent, this.#eventEditComponent);
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

    render(this.#eventComponent, this.#container);
  }
}
