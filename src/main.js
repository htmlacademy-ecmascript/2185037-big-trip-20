import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

import EventModel from './model/events-model.js';
import DestinationModel from './model/destinations-model.js';
import OfferModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';

import EventsApiService from './service/events-api-service.js';

const AUTHORIZATION = EventsApiService.getStringBasicAuth();
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const siteMainElement = document.querySelector('main');
const siteHeaderElement = document.querySelector('header');
const siteFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteTripMainContainer = siteHeaderElement.querySelector('.trip-main');
const siteBoardElement = siteMainElement.querySelector('.trip-events');

const eventsApiService = new EventsApiService(END_POINT, AUTHORIZATION);
const destinationsModel = new DestinationModel(eventsApiService);
const offersModel = new OfferModel(eventsApiService);
const eventsModel = new EventModel({
  service: eventsApiService,
  destinationsModel,
  offersModel
});

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: siteFiltersElement,
  filterModel,
  eventsModel
});

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer: siteTripMainContainer,
  eventsModel,
  offersModel,
  destinationsModel
});

const boardPresenter = new BoardPresenter({
  container: siteBoardElement,
  newEventContainer: siteTripMainContainer,
  destinationsModel,
  offersModel,
  eventsModel,
  filterModel,
});

filterPresenter.init();
tripInfoPresenter.init();
boardPresenter.init();
eventsModel.init();
