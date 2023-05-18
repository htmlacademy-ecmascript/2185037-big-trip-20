import AbstractView from '../framework/view/abstract-view.js';

const FiltersText = {
  everthing: 'Click New Event to create your first point',
  past: 'There are no past events now',
  present: 'There are no present events now',
  future:'There are no future events now'
};

function createEventListTemplate(){
  return `<p class="trip-events__msg">${FiltersText.everthing}</p>`;
}

export default class EventEmptyView extends AbstractView {
  get template(){
    return createEventListTemplate();
  }
}
