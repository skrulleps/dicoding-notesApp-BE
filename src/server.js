require('dotenv/config');
const Hapi = require('@hapi/hapi');
const notes = require('./api/notes/index.js');
const NoteServices = require('./services/postgres/NotesServices.js');
const NotesValidator = require('./validator/notes/index.js');
const ClientError = require('./exceptions/ClientError.js');

// Importing the users API
const users = require('./api/users');
const UserServices = require('./services/postgres/UsersServices.js');
const UserValidator = require('./validator/users/index.js');
const init = async () => {
  const notesService = new NoteServices();
  const userService = new UserServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    // Penanganan server error
    if (response instanceof Error) {
      // Log error untuk debugging
      console.error(response);
      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
      
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
