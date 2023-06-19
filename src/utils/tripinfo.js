import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(utc);
dayjs.extend(duration);

const TRIP_DATE_FORMAT = 'D MMM';

function humanizeTripInfoDate(date) {
  return date ? dayjs(date).format(TRIP_DATE_FORMAT) : '';
}

export {humanizeTripInfoDate};
