import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import EventPresenter from './presenter/event-presenter.js';

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

const eventPresenter = new EventPresenter({
  eventContainer: siteEventsElement,
  destinationsModel,
  offersModel,
  eventsModel
});


render(new FilterView(), siteFiltersElement);

eventPresenter.init();
