import FilterView from './view/filter-view.js';
import EventPresenter from './presenter/event-presenter.js';
import { render } from './render.js';

const siteMainElement = document.querySelector('main');
const siteHeaderElement = document.querySelector('header');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = siteMainElement.querySelector('.trip-events');
const eventPresenter = new EventPresenter({eventContainer: siteEventsElement});

render(new FilterView(), siteFiltersElement);

eventPresenter.init();
