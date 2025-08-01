const AuthenticationHandler = require("./handler")
const routes = require("./routes")

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, { 
        authService,
        usersService,
        tokenManager,
        validator 
    }) => {
        const authenticationsHandler =  new AuthenticationHandler(
            authService,
            usersService,
            tokenManager,
            validator
        )
        server.route(routes(authenticationsHandler))
    }

}