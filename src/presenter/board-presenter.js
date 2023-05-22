import { render, RenderPosition } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyView from '../view/event-list-empty-view.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils/common.js';


export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #sortComponent = new SortView();
  #eventEmptyComponent = new EventEmptyView();

  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;

  #events = [];

  #eventPresenters = new Map();

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
    this.#events = [...this.#eventsModel.events];

    this.#renderBoard();
  }

  #renderEvent(event){
    const eventPresenter = new EventPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(event);

    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearEventList(){
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
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
