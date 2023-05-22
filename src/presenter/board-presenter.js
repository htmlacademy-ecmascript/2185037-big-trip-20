import { render, replace, RenderPosition } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyView from '../view/event-list-empty-view.js';


export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #sortComponent = new SortView();
  #eventEmptyComponent = new EventEmptyView();

  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;

  #events = [];

  constructor({
    container,
    destinationsModel,
    offersModel,
    eventsModel
  }){
    this.#container = container;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
  }

  init(){
    this.#events = this.#eventsModel.events;

    this.#renderBoard();
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

  #renderSort() {
    render(this.#sortComponent, this.#container, RenderPosition.BEFOREEND);
  }

  #renderEventEmpty(){
    render(this.#eventEmptyComponent, this.#container, RenderPosition.BEFOREEND);
  }

  #renderEvents(){
    this.#events.forEach((event) => this.#renderEvent(event));
  }

  #renderEventList(){
    render(this.#eventListComponent, this.#container);

    this.#renderEvents();
  }

  #renderBoard(){

    if(this.#eventsModel.hasEvents()){
      this.#renderEventEmpty();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
  }
}
