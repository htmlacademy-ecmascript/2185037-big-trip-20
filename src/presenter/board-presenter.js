import { render, replace, RenderPosition } from '../framework/render.js';
import EventView from '../view/event-view.js';
import BoardView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyView from '../view/event-list-empty-view.js';


export default class BoardPresenter {
  #boardComponent = new BoardView();
  #sortComponent = new SortView();
  #eventEmptyComponent = new EventEmptyView();
  #eventContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;

  #events = [];

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

    this.#renderBoard();
  }

  #renderSort() {
    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
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

    render(eventComponent, this.#boardComponent.element);
  }

  #renderEventEmpty(){
    render(this.#eventEmptyComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEvents(from, to){
    this.#events
      .slice((from, to))
      .forEach((event) => this.#renderEvent(event));
  }

  #renderBoard(){
    render(this.#boardComponent, this.#eventContainer);

    if(this.#eventsModel.hasEvents()){
      this.#renderEventEmpty();
      return;
    }

    this.#events.forEach((item) => {
      this.#renderEvent(item);
    });
  }
}
