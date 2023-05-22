import { render, replace, remove } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

export default class EventPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;

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
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    const offersByType = this.#offersModel.getByType(event.type);

    this.#eventComponent = new EventView({
      event: this.#event,
      destination: this.#destinationsModel.getById(event.destination),
      offers: this.#offersModel.getByIds(offersByType, event.offers),
      onEditClick: this.#handleEditClick
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: this.#handleFormSubmit
    });

    if(prevEventComponent === null || prevEventEditComponent === null){
      render(this.#eventComponent, this.#container);
      return;
    }

    if(this.#container.contains(prevEventComponent.element)){
      replace(this.#eventComponent, prevEventComponent);
    }

    if(this.#container.contains(prevEventEditComponent.element)){
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy(){
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #replaceEventToForm = () => {
    replace(this.#eventEditComponent, this.#eventComponent);
  };

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEvent();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => {
    this.#replaceEventToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToEvent();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
