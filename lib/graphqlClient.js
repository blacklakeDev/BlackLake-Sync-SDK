const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;
const url = require('./config').urls.production.url;

const createClient = (token) => {
  return new Lokka({
    transport: new Transport(
      `${url}/graphql`,
      {
        headers: {
          'X-SERVICE': 'gc-graphql',
          'User-Agent': 'sync-sdk',
          'x-client': 'sync-sdk',
        }
      }),
  });
};

exports.defaultClient = createClient();