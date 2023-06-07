import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #container = null;
  #eventsModel = null;
  #filterModel = null;

  #filterComponent = null;

  constructor({filterContainer, filterModel, eventsModel}){
    this.#container = filterContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters(){
    const events = this.#eventsModel.events;

    return Object.entries(FilterType).map(
      ([filterType, filterEvents]) => ({
        type: filterType,
        hasEvents: filterEvents(events).length > 0,
      }),
    );
  }

  init(){
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if(prevFilterComponent === null){
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterTypeChange = (filterType) => {
    if(this.#filterModel.filter === filterType){
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
