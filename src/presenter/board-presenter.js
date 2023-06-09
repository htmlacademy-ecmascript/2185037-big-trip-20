import { remove, render, RenderPosition, replace } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyView from '../view/event-list-empty-view.js';
import EventPresenter from './event-presenter.js';
import { sort } from '../utils/sort.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { filter } from '../utils/filter.js';

export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #sortComponent = null;
  #eventEmptyComponent = new EventEmptyView();

  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;
  #filterModel = null;

  #eventPresenters = new Map();

  #currentSortType = SortType.DAY;

  constructor({
    container,
    destinationsModel,
    offersModel,
    eventsModel,
    filterModel
  }){
    this.#container = container;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init(){
    this.#renderBoard();
  }

  get events(){
    const filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[filterType](events);

    return sort[this.#currentSortType](filteredEvents);
  }

  #renderEvent(event){
    const eventPresenter = new EventPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(event);

    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard();
    this.#renderBoard();
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.update(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.add(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.delete(updateType,update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    switch (UpdateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearEventList(){
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #clearBoard({resetSortType = false} = {}){
    this.#clearEventList();

    remove(this.#sortComponent);
    remove(this.#eventEmptyComponent);

    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderSort() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
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

  #renderEvents(events){
    events.forEach((event) => this.#renderEvent(event));
  }

  #renderEventList(){
    render(this.#eventListComponent, this.#container);

    this.#renderEvents(this.events);
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
