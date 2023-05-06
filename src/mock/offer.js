import { getDataFromServer } from './utils.js';

const PATH = '/big-trip/destinations';

const getOffersFromServer = () => getDataFromServer(PATH);

export { getOffersFromServer };
