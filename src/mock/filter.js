import {filter} from '../utils/filter.js';

function generateFilters(events) {
  return Object.entries(filter).map(
    ([filterType, filterEvents]) => ({
      type: filterType,
      hasEvents: filterEvents(events).length > 0,
    }),
  );
}

export {generateFilters};
