const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;
const url = require('./config').urls.production.url;

const createClient = (token) => {
  return new Lokka({
    transport: new Transport(
      `${url}/graphql`,
      token ? {
        headers: {
          'X-AUTH': token,
          'X-SERVICE': 'gc-graphql'
        }
      } : {}),
  });
};

exports.defaultClient = createClient();