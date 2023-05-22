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

  #onDataChange = null;

  constructor({
    container,
    destinationsModel,
    offersModel,
    onDataChange
  }){
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
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
      onEditClick: this.#editClickHandler,
      onFavoriteClick: this.#favoriteClickHandler
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: this.#formSubmitHandler,
      onResetClick: this.#resetButtonClickHandler
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
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEvent();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #editClickHandler = () => {
    this.#replaceEventToForm();
  };

  #formSubmitHandler = (event) => {
    this.#onDataChange(event);
    this.#replaceFormToEvent();
  };

  #resetButtonClickHandler = () => {
    this.#replaceFormToEvent();
  };

  #favoriteClickHandler = () => {
    this.#onDataChange({...this.#event, isFavorite: !this.#event.isFavorite});
  };
}
