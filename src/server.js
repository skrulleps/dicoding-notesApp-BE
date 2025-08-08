require('dotenv/config');
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const ClientError = require('./exceptions/ClientError.js');

// Importing the notes API
const notes = require('./api/notes/index.js');
const NoteServices = require('./services/postgres/NotesServices.js');
const NotesValidator = require('./validator/notes/index.js');

// Importing the users API
const users = require('./api/users');
const UserServices = require('./services/postgres/UsersServices.js');
const UserValidator = require('./validator/users/index.js');

// Importing the authentications API
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService.js');
const AuthenticationsValidator = require('./validator/authentications/index.js');
const TokenManager = require('./tokenize/TokenManager.js');

// Importing the collaborations API
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService.js');
const CollaborationsValidator = require('./validator/collaborations/index.js');

// Importing the exports API
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService.js');
const ExportValidator = require('./validator/exports/index.js');

// Importing the uploads API
const uploads =  require('./api/uploads');
const StorageService = require('./services/storage/StorageService.js');
const UploadValidator = require('./validator/uploads/index.js');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesService = new NoteServices(collaborationsService);
  const userService = new UserServices();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);
 
  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: authentications,
      options: {
        authService: authenticationsService,
        usersService: userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadValidator,
      },
    }
  ]);

  const Boom = require('@hapi/boom');

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

    // Handle Boom errors (client errors from hapi plugins like jwt)
    if (Boom.isBoom(response)) {
      if (!response.isServer) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.output.statusCode);
        return newResponse;
      }
      // For server errors, log and return generic message
      console.error(response);
      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
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
