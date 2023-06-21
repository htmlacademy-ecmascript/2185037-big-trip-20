import { remove, render, RenderPosition } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import { UserAction, UpdateType, EditType } from '../const.js';
import { escKeyDownHandler } from '../utils/event.js';

export default class NewEventPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #offersModel = null;
  #destinationsModel = null;

  #eventEditComponent = null;

  constructor({eventListContainer, destinationsModel, offersModel, onDataChange, onDestroy}){
    this.#eventListContainer = eventListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(){
    if(this.#eventEditComponent !== null){
      return;
    }

    this.#eventEditComponent = new EventEditView({
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteClick: this.#deleteClickHandler,
      type: EditType.CREATING
    });

    render(this.#eventEditComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if(this.#eventEditComponent === null){
      return;
    }

    this.#handleDestroy();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving(){
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting(){
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #formSubmitHandler = (event) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event
    );
  };

  #deleteClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => escKeyDownHandler(evt, this.destroy);
}
