import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createNewEventButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewEventButtonView extends AbstractStatefulView {
  #onClick = null;

  constructor({onClick}) {
    super();

    this.#onClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#onClick();
  };

  setDisabled(bool){
    this.element.disabled = bool;
  }
}
