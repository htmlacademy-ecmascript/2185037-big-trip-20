import { remove, render, RenderPosition, replace } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import EventEmptyView from '../view/event-list-empty-view.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import LoadingView from '../view/loading-view.js';

import { sort } from '../utils/sort.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';

export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #eventEmptyComponent = null;
  #newEventButton = null;
  #newEventButtonContainer = null;

  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;
  #filterModel = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isCreating = false;
  #isLoading = true;

  constructor({
    container,
    newEventContainer,
    destinationsModel,
    offersModel,
    eventsModel,
    filterModel,
  }){
    this.#container = container;
    this.#newEventButtonContainer = newEventContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewEventDestroy
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init(){
    this.#newEventButton = new NewEventButtonView({
      onClick: this.#handleNewEventButtonClick
    });
    render(this.#newEventButton, this.#newEventButtonContainer);

    this.#renderBoard();
  }

  get events(){
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

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
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        this.#eventsModel.update(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        this.#eventsModel.add(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        this.#eventsModel.delete(updateType,update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderLoading(){
    render(this.#loadingComponent, this.#container, RenderPosition.BEFOREEND);
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearEventList(){
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #clearBoard({resetSortType = false} = {}){
    this.#clearEventList();

    remove(this.#sortComponent);

    if(this.#eventEmptyComponent){
      remove(this.#eventEmptyComponent);
    }

    if(this.#loadingComponent){
      remove(this.#loadingComponent);
    }

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
    this.#eventEmptyComponent = new EventEmptyView({
      filterType: this.#filterType
    });
    render(this.#eventEmptyComponent, this.#container, RenderPosition.BEFOREEND);
  }

  #renderEvents(events){
    events.forEach((event) => this.#renderEvent(event));
  }

  #renderEventList(){
    render(this.#eventListComponent, this.#container);
  }

  #renderBoard(){

    if(this.#isLoading){
      this.#renderLoading();
      return;
    }

    if(!this.#eventsModel.hasEvents() && !this.#isCreating){
      this.#renderEventEmpty();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
    this.#renderEvents(this.events);
  }

  createEvent(){
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #handleNewEventButtonClick = () => {
    this.#isCreating = true;
    this.createEvent();
    this.#newEventButton.setDisabled(true);
  };

  #handleNewEventDestroy = () => {
    this.#isCreating = false;
    this.#newEventButton.setDisabled(false);

    if(!this.#eventsModel.hasEvents()){
      remove(this.#sortComponent);
      this.#sortComponent = null;
      this.#renderEventEmpty();
    }
  };
}
