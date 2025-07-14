import 'dotenv/config.js';
import Hapi from '@hapi/hapi';
import notes from './api/notes/index.js';
import NoteServices from './services/postgres/NotesServices.js';
import NotesValidator from './validator/notes/index.js';
import ClientError from './exceptions/ClientError.js';

const init = async () => {
  const notesService = new NoteServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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
