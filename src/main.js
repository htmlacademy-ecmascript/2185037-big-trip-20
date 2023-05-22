import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import EventModel from './model/events-model.js';
import DestinationModel from './model/destinations-model.js';
import OfferModel from './model/offers-model.js';

import MockService from './service/mock-service.js';

const siteMainElement = document.querySelector('main');
const siteHeaderElement = document.querySelector('header');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = siteMainElement.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationModel(mockService);
const offersModel = new OfferModel(mockService);
const eventsModel = new EventModel(mockService);

const filterPresenter = new FilterPresenter({
  filterContainer: siteFiltersElement,
  eventsModel
});

const eventPresenter = new BoardPresenter({
  eventContainer: siteEventsElement,
  destinationsModel,
  offersModel,
  eventsModel
});

filterPresenter.init();
eventPresenter.init();
