import { getDataFromServer } from './utils.js';

const PATH = '/big-trip/destinations';

const getDestinationsFromServer = () => getDataFromServer(PATH);

export { getDestinationsFromServer };
