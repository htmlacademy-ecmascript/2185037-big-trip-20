import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { filter } from '../utils/filter.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  #container = null;
  #eventsModel = null;
  #filterModel = null;

  #filterComponent = null;

  constructor({filterContainer, filterModel, eventsModel}){
    this.#container = filterContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get filters(){
    const events = this.#eventsModel.events;

    return Object.entries(filter)
      .map(([filterType, filterEvents]) => ({
        type: filterType,
        hasEvents: filterEvents(events).length > 0,
      }));
  }

  init(){
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#filterTypeChangeHandler
    });

    if(prevFilterComponent === null){
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #filterTypeChangeHandler = (filterType) => {
    if(this.#filterModel.filter === filterType){
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #modelEventHandler = () => {
    this.init();
  };
}
