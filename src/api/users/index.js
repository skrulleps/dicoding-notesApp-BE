const UsersHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'users',
    version: '1.0.0',
    description: 'User management API',
    register: async (server, { services, validator }) => {
        const usersHandler = new UsersHandler(services, validator);
        server.route(routes(usersHandler));
    }
}