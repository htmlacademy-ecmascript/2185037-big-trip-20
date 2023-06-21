import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES_EVENT } from '../const.js';
import { humanizeEventDateForm } from '../utils/event.js';
import { EditType, EVENT_BLANK } from '../const.js';

import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import he from 'he';

const ButtonLabel = {
  [EditType.CREATING]: 'Cancel',
  [EditType.EDITING]: 'Delete'
};

function createTypeList(typeEvent){
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${TYPES_EVENT.map((type) => (
      `<div class="event__type-item">
            <input
              id="event-type-${type}-1"
              class="event__type-input  visually-hidden"
              type="radio"
              name="event-type"
              value="${type}"
              ${typeEvent === type ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
          </div>`
    )).join('')}
      </fieldset>
    </div>`
  );
}

function createDestinationList(event, destinations, type, isDisabled){
  const destination = destinations.find((item) => item.id === event.destination);
  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input
        class="event__input  event__input--destination"
        id="event-destination-1"
        type="text"
        name="event-destination"
        ${isDisabled ? 'disabled' : ''}
        value="${destination ? destination.name : ''}" list="destination-list-1">
      <datalist id="destination-list-1">
      ${destinations.map((item) => (
      `<option ${item.id === event.destination ? 'selected' : ''} value="${item.name}">${item.name}</option>`
    )).join('')}
      </datalist>
    </div>`
  );
}

function createOffersList(event, offers, isDisabled){
  const offersByType = offers.find((offer) => offer.type === event.type)?.offers;

  if(offersByType.length < 1){
    return '';
  }

  const offersByIds = [...offersByType.filter((offer) => event.offers.find((id) => offer.id === id))];

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

      ${offersByType.map(({id, price, title}) =>
      (
        `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          data-offer-id="${id}"
          id="event-offer-${id}"
          type="checkbox"
          name="event-offer-${id}"
          ${isDisabled ? 'disabled' : ''}
          ${ offersByIds.find((offer) => id === offer.id) ? 'checked' : ''}
        >
        <label class="event__offer-label" for="event-offer-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`)).join('')}

      </div>
    </section>`
  );
}

function createPhotosList(pictures){
  if(!pictures){
    return '';
  }
  return (
    `<div class="event__photos-tape">
      ${pictures.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('')}
    </div>`
  );
}

function createDestinationTemplate(destination){
  return `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">${ destination?.description ? 'Destination' : ''}</h3>
    <p class="event__destination-description">${ destination?.description ?? '' }</p>
    <div class="event__photos-container">
      ${createPhotosList(destination?.pictures ?? false)}
    </div>
  </section>`;
}

function createEventEditTemplate({state, destinations, offers, editType}){
  const {event, isDeleting, isDisabled, isSaving, isDisabledSubmit} = state;
  const {basePrice, dateFrom, dateTo, type} = event;

  const destination = destinations.find((item) => item.id === event.destination);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            ${createTypeList(type)}
          </div>

          ${createDestinationList(event, destinations, type, isDisabled)}

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              ${isDisabled ? 'disabled' : ''}
              value="${humanizeEventDateForm(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              ${isDisabled ? 'disabled' : ''}
              value="${humanizeEventDateForm(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              ${isDisabled ? 'disabled' : ''}
              value="${he.encode(basePrice.toString())}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled || isDisabledSubmit ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
            ${ isDeleting ? 'Deleting...' : ButtonLabel[editType]}
          </button>
          ${editType !== EditType.CREATING ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}

        </header>
        <section class="event__details">
          ${createOffersList(event, offers, isDisabled)}
          ${destination?.description ? createDestinationTemplate(destination) : ''}
        </section>
      </form>
    </li>`
  );
}

export default class EventEditView extends AbstractStatefulView {

  #destinations = null;
  #offers = null;
  #onFormSubmit = null;
  #onResetClick = null;
  #onDeleteClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  #type;

  constructor({event = EVENT_BLANK, destinations, offers, onFormSubmit, onResetClick, onDeleteClick, type = EditType.EDITING}){
    super();

    this._setState(EventEditView.parseEventToState({event}));

    this.#destinations = destinations;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onResetClick = onResetClick;
    this.#onDeleteClick = onDeleteClick;
    this.#type = type;

    this._restoreHandlers();
  }

  get template(){
    return createEventEditTemplate({
      state: this._state,
      destinations: this.#destinations,
      offers: this.#offers,
      editType: this.#type
    });
  }

  reset = (event) => this.updateElement(EventEditView.parseEventToState({event}));

  _restoreHandlers = () => {
    if(this.#type === EditType.EDITING){
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetButtonClickHandler);
    }

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelectorAll('.event__type-input').forEach((element) => {
      element.addEventListener('change', this.#typeInputClickHandler);
    });
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHanlder);

    const offerBlock = this.element.querySelector('.event__available-offers');

    if(offerBlock){
      offerBlock.addEventListener('change', this.#offerClickHanlder);
    }

    this.#setDatepickers();
  };

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.event.dateFrom,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.event.dateTo,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      });

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.event.dateTo,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.event.dateFrom,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );
  };

  removeElement = () => {
    super.removeElement();

    if(this.#datepickerFrom){
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if(this.#datepickerTo){
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      event: {
        ...this._state.event,
        dateFrom: userDate
      }
    });
    this.#datepickerTo.set('minDate', this._state.event.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      event: {
        ...this._state.event,
        dateTo: userDate
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.event.dateTo);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EventEditView.parseStateToEvent(this._state));
  };

  #deleteButtonClickHanlder = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EventEditView.parseStateToEvent(this._state));
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #typeInputClickHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      event: {
        ...this._state.event,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #offerClickHanlder = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      event: {
        ...this._state.event,
        offers: checkedBoxes.map((element) => element.dataset.offerId)
      }
    });
  };

  #priceInputChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      event: {
        ...this._state.event,
        basePrice: evt.target.value,
      },
      isDisabledSubmit: parseInt(evt.target.value, 10) === 0
    });
  };

  #destinationInputChangeHandler = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    const selectedDestinationId = (selectedDestination) ? selectedDestination.id : null;

    this.updateElement({
      event: {
        ...this._state.event,
        destination: selectedDestinationId
      }
    });
  };

  static parseEventToState = ({event}) => ({
    event,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
    isDisabledSubmit: false
  });

  static parseStateToEvent = (state) => {
    const {event} = state;

    delete event.isDeleting;
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDisabledSubmit;

    return event;
  };
}
