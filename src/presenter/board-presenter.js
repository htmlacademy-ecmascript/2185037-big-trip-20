import { remove, render, RenderPosition, replace } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyView from '../view/event-list-empty-view.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils/common.js';
import { sort } from '../utils/sort.js';
import { SortType } from '../const.js';

export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #sortComponent = null;
  #eventEmptyComponent = new EventEmptyView();

  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;

  #events = [];

  #eventPresenters = new Map();

  #currentSortType = SortType.DAY;

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

    this.#events = sort[SortType.DAY]([...this.#eventsModel.events]);
  }

  init(){
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

  #handleSortTypeChange = (sortType) => {
    this.#sortEvents(sortType);
    this.#clearEventList();
    this.#renderSort(this.#container);
    this.#renderEventList();
  };

  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #sortEvents(sortType){
    this.#currentSortType = sortType;
    this.#events = sort[this.#currentSortType]([...this.#events]);
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearEventList(){
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderSort() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    if(prevSortComponent){
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    }else{
      render(this.#sortComponent, this.#container);
    }

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
