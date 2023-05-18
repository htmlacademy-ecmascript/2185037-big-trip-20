import { render } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { generateFilters } from '../mock/filter.js';

export default class FilterPresenter {
  #container = null;
  #eventsModel = null;
  #filters = [];

  constructor({filterContainer, eventsModel}){
    this.#container = filterContainer;
    this.#eventsModel = eventsModel;
    this.#filters = generateFilters(this.#eventsModel.events);
  }

  init(){
    render(new FilterView(this.#filters), this.#container);
  }
}
