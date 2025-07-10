const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/NotesServices');
const NotesValidator = require('./validator/notes');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

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