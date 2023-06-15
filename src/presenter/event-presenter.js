import { render, replace, remove } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import { UpdateType, UserAction } from '../const.js';
import { isDatesEqual, isPricesEqual } from '../utils/event.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class EventPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;
  #mode = Mode.DEFAULT;

  #onDataChange = null;
  #onModeChange = null;

  constructor({
    container,
    destinationsModel,
    offersModel,
    onDataChange,
    onModeChange
  }){
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
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
      onResetClick: this.#resetButtonClickHandler,
      onDeleteClick: this.#deleteClickHandler,
    });

    if(prevEventComponent === null || prevEventEditComponent === null){
      render(this.#eventComponent, this.#container);
      return;
    }

    if(this.#mode === Mode.DEFAULT){
      replace(this.#eventComponent, prevEventComponent);
    }

    if(this.#mode === Mode.EDITING){
      replace(this.#eventComponent, prevEventEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  setSaving(){
    if(this.#mode === Mode.EDITING){
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting(){
    if(this.#mode === Mode.EDITING){
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  }

  resetView(){
    if(this.#mode !== Mode.DEFAULT){
      this.#replaceFormToEvent();
    }
  }

  destroy(){
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #replaceEventToForm = () => {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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

  #formSubmitHandler = (update) => {
    const isMinorUpdate = isDatesEqual(this.#event.dateFrom, update.dateFrom) || isDatesEqual(this.#event.dateTo, update.dateTo) || isPricesEqual(this.#event.basePrice, update.basePrice);

    this.#onDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );
  };

  #deleteClickHandler = (event) => {
    this.#onDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #resetButtonClickHandler = () => {
    this.#replaceFormToEvent();
  };

  #favoriteClickHandler = () => {
    this.#onDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite}
    );
  };
}
