const UsersHandler = require("./handler.js");
const { routes } = require("./routes.js");

module.exports = {
    name: 'users',
    version: '1.0.0',
    description: 'User management API',
    register: async (server, { service, validator }) => {
        const usersHandler = new UsersHandler(service, validator);
        server.route(routes(usersHandler));
    }
}