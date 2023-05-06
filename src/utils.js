import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const DAY_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizeEventDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function humanizeEventDay(day) {
  return day ? dayjs(day).format(DAY_FORMAT) : '';
}

function humanizeEventTime(time) {
  return time ? dayjs(time).format(TIME_FORMAT) : '';
}

export {
  getRandomArrayElement,
  humanizeEventDate,
  humanizeEventDay,
  humanizeEventTime
};
