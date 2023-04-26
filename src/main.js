import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import { render } from './render.js';

const siteMainElement = document.querySelector('main');
const siteHeaderElement = document.querySelector('header');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteSortsElement = siteMainElement.querySelector('.trip-events');

render(new FilterView(), siteFiltersElement);
render(new SortView(), siteSortsElement);
