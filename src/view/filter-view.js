import AbstractView from '../framework/view/abstract-view.js';

function createFilterItem(filter, currentFilterType){
  const {type, hasEvents} = filter;

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? 'checked' : ''}
        ${(hasEvents) ? '' : 'disabled'}
        >
      <label
        class="trip-filters__filter-label"
        for="filter-${type}"
      >
      ${type}
      </label>
    </div>
  `;
}

function createFilterTemplate(filters, currentFilterType){
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createFilterItem(filter, currentFilterType)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #onFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}){
    super();

    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template(){
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterTypeChange(evt.target.value);
  };
}
