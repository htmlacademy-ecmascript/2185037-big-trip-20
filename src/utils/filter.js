import {FilterType} from '../const.js';
import {isEventPast, isEventFuture, isEventPresent } from './event.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => [...events],
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event))
};

export {filter};
