import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_FORMAT_FORM = 'DD/MM/YY HH:mm';
const DATE_FORMAT_SCHEDULE = 'DD/MM/YYTHH:mm';
const DAY_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizeEventDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function humanizeEventDateShedule(date) {
  return date ? dayjs(date).format(DATE_FORMAT_SCHEDULE) : '';
}

function humanizeEventDateForm(date) {
  return date ? dayjs(date).format(DATE_FORMAT_FORM) : '';
}

function humanizeEventDay(day) {
  return day ? dayjs(day).format(DAY_FORMAT) : '';
}

function humanizeEventTime(time) {
  return time ? dayjs(time).format(TIME_FORMAT) : '';
}

export {
  getRandomArrayElement,
  humanizeEventDateShedule,
  humanizeEventDateForm,
  humanizeEventDate,
  humanizeEventDay,
  humanizeEventTime
};
