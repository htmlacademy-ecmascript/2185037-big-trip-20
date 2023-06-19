import { remove, render, replace, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { sort } from '../utils/sort.js';
import { SortType } from '../const.js';

export default class TripInfoPresenter {
  #container = null;
  #eventsModel = null;
  #offersModel = null;
  #tripInfoComponent = null;
  #destinationsModel = null;

  #events = null;

  constructor({tripInfoContainer, eventsModel, offersModel, destinationsModel}){
    this.#container = tripInfoContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init(){
    const prevTripInfoComponent = this.#tripInfoComponent;
    this.#events = sort[SortType.DAY](this.#eventsModel.events);

    this.#tripInfoComponent = new TripInfoView({
      totalSumm: this.getTotalSumm(),
      namesDestinations: this.getNamesDestinations(),
      datesTrip: this.getDatesTrip()
    });

    if(prevTripInfoComponent === null){
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);

  }

  getTotalSumm(){
    return this.#events.reduce((total, event) => total + event.basePrice + this.getSummOffersPrice(event), 0);
  }

  getSummOffersPrice(event){
    const offersByType = this.#offersModel.getByType(event.type);
    const offersEvent = this.#offersModel.getByIds(offersByType, event.offers);
    return offersEvent.reduce((total, offer) => total + offer.price, 0);
  }

  getNamesDestinations(){
    const namesDestinations = this.#events.map((event) => {
      const destination = this.#destinationsModel.getById(event.destination);
      return destination.name;
    });

    return Array.from(new Set(namesDestinations));
  }

  getDatesTrip(){
    const tripDateFrom = this.#events.at(0)?.dateFrom;
    const tripDateTo = this.#events.at(-1)?.dateTo;

    return {
      tripDateFrom,
      tripDateTo
    };
  }

  #handleModelEvent = () => {
    this.init();
  };
}
