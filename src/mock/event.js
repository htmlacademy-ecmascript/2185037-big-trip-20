import { getDataFromServer } from './utils.js';

const PATH = '/big-trip/points';

const getEventsFromServer = () => getDataFromServer(PATH);

export { getEventsFromServer };
