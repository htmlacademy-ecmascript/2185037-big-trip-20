import { SortType } from '../const.js';
import { getEventsDateDiff, getEventsPriceDiff, getEventsDurationDiff } from './event.js';

if(!Array.prototype.toSorted){
  Array.prototype.toSorted = function (fn){
    return [...this].sort(fn);
  };
}

const sort = {
  [SortType.DAY]: (events) => events.toSorted(getEventsDateDiff),
  [SortType.PRICE]: (events) => events.toSorted(getEventsPriceDiff),
  [SortType.TIME]: (events) => events.toSorted(getEventsDurationDiff),
  [SortType.EVENT]: () => {
    throw new Error(`Сортивка по ${SortType.EVENT} недоступна`);
  },
  [SortType.OFFER]: () => {
    throw new Error(`Сортивка по ${SortType.OFFER} недоступна`);
  }
};

export {sort};

