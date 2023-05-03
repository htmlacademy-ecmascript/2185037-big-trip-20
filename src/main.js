import FilterView from './view/filter-view.js';
import EventPresenter from './presenter/event-presenter.js';
import { render } from './render.js';
import EventsModel from './model/events-model.js';

const siteMainElement = document.querySelector('main');
const siteHeaderElement = document.querySelector('header');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = siteMainElement.querySelector('.trip-events');
const eventsModel = new EventsModel();
const eventPresenter = new EventPresenter({eventContainer: siteEventsElement, eventsModel});


render(new FilterView(), siteFiltersElement);

eventPresenter.init();
