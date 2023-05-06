import { Buffer } from 'buffer';

const PATH_SERVER = 'https://20.objects.pages.academy';

const getHeadersBasicAuth = () => ({
  'Authorization' : `Basic ${Buffer.from('TEST:TEST').toString('base64')}`,
  'Content-Type': 'application/json'
});

const getDataFromServer = async (link) => {
  const response = await fetch(`${PATH_SERVER}${link}`, { headers: getHeadersBasicAuth() });
  return await response.json();
};

export { getDataFromServer };
