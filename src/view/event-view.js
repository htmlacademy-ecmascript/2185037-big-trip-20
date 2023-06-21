import AbstractView from '../framework/view/abstract-view.js';
import {
  humanizeEventDateShedule,
  humanizeEventDate,
  humanizeEventDay,
  humanizeEventTime,
  humanizeEventDurationTime
} from '../utils/event.js';

import he from 'he';

function createOffersTemplate(offers){
  return (
    `<ul class="event__selected-offers">
      ${ offers[0] === undefined ? '' : offers.map(({title, price}) => (
      `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`
    )).join('')}
    </ul>`
  );
}

function createEventTemplate(event, destination, offers){
  const {basePrice, dateFrom, dateTo, isFavorite, type} = event;

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const offersTemplate = createOffersTemplate(offers);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${humanizeEventDate(dateFrom)}">${humanizeEventDay(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination ? destination.name : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${humanizeEventDateShedule(dateFrom)}">${humanizeEventTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${humanizeEventDateShedule(dateTo)}">${humanizeEventTime(dateTo)}</time>
          </p>
          <p class="event__duration">${humanizeEventDurationTime(dateFrom,dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${offersTemplate}
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class EventView extends AbstractView{
  #event = null;
  #destination = null;
  #offers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({event, destination, offers, onEditClick, onFavoriteClick}){
    super();
    this.#event = event;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHanlder);
  }

  get template(){
    return createEventTemplate(this.#event, this.#destination, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHanlder = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
