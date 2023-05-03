import { TYPES_EVENT, TEXT } from '../const.js';
import { getRandomArrayElement } from '../utils.js';

const mockEvents = [
  {
    id: '1',
    basePrice: 800,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: '1',
    isFavorite: true,
    offers: [],
    type: 'drive'
  },
  {
    id: '2',
    basePrice: 1100,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: '2',
    isFavorite: false,
    offers: ['2'],
    type: 'bus'
  },
  {
    id: '3',
    basePrice: 2200,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: '3',
    isFavorite: true,
    offers: ['1','3'],
    type: 'taxi'
  }
];

const mockDestinations = [
  {
    id: '1',
    description: getRandomArrayElement(TEXT.split('.')),
    name: 'Chamonix',
    pictures: []
  },
  {
    id: '2',
    description: getRandomArrayElement(TEXT.split('.')),
    name: 'Geneva',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: '3',
    description: getRandomArrayElement(TEXT.split('.')),
    name: 'Amsterdam',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: 'Chamonix parliament building'
      },
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: 'aaa aaa aa'
      },
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: 'bbb bb bb'
      }
    ]
  }
];

const mockOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: '1',
        title: 'Upgrade to a business class',
        price: 20
      },
      {
        id: '2',
        title: 'Book tickets',
        price: 30
      },
      {
        id: '3',
        title: 'Rent a car',
        price: 190
      }
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: '1',
        title: 'Add luggage',
        price: 120
      },
      {
        id: '2',
        title: 'Switch to comfort',
        price: 90
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: '1',
        title: 'Add breakfast',
        price: 200
      },
      {
        id: '2',
        title: 'Lunch in city',
        price: 111
      }
    ]
  }
];

function getRandomEvent() {
  return getRandomArrayElement(mockEvents);
}

export {getRandomEvent, mockDestinations, mockOffers};
