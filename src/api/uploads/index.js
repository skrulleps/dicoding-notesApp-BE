const routes = require('./routes');
const UploadsHandler = require('./handler');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    server.route(routes(UploadsHandler, service, validator));
  },
};