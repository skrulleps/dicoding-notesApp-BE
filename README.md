# Notes App Backend - Dicoding Backend Practice

This is a comprehensive backend project for managing notes, created as part of the Dicoding Backend Developer learning path. The project is built using **Hapi.js** framework and implements a complete RESTful API with authentication, authorization, collaboration features, and export capabilities.

## 🚀 Project Overview

This backend service provides a full-featured notes management system with user authentication, real-time collaboration, file uploads, and data export functionality. It uses PostgreSQL as the primary database with Redis for caching and RabbitMQ for message queuing.

## ✨ Features

### Core Features
- **User Management**: Registration, authentication, and profile management
- **Notes Management**: Create, read, update, delete (CRUD) operations for notes
- **Authentication**: JWT-based authentication with access and refresh tokens
- **Authorization**: Role-based access control for notes ownership
- **Collaboration**: Share notes with other users for collaborative editing
- **File Upload**: Upload images for notes with storage service
- **Data Export**: Export notes to PDF via email
- **Caching**: Redis integration for improved performance
- **Message Queue**: RabbitMQ for asynchronous export processing

### Advanced Features
- **Real-time Collaboration**: Multiple users can edit shared notes
- **Search Functionality**: Search notes by username and tags
- **Validation**: Input validation using Joi
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Security**: Password hashing, JWT tokens, and input sanitization

## 🛠️ Technologies Used

- **[Hapi.js](https://hapi.dev/)** - Node.js framework for building APIs
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database
- **[Redis](https://redis.io/)** - Caching and session storage
- **[RabbitMQ](https://www.rabbitmq.com/)** - Message queuing for exports
- **[JWT](https://jwt.io/)** - Token-based authentication
- **[Joi](https://joi.dev/)** - Input validation
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Password hashing
- **[nanoid](https://github.com/ai/nanoid)** - Unique ID generation
- **[node-pg-migrate](https://github.com/salsita/node-pg-migrate)** - Database migrations
- **[ESLint](https://eslint.org/)** - Code linting

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Register new user |
| GET | `/users/{id}` | Get user details |
| POST | `/authentications` | Login and get tokens |
| PUT | `/authentications` | Refresh access token |
| DELETE | `/authentications` | Logout |

### Notes Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create new note |
| GET | `/notes` | Get all user's notes |
| GET | `/notes/{id}` | Get specific note |
| PUT | `/notes/{id}` | Update note |
| DELETE | `/notes/{id}` | Delete note |

### Collaboration
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/collaborations` | Add collaborator to note |
| DELETE | `/collaborations` | Remove collaborator from note |

### File Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload/images` | Upload image for notes |

### Export
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/export/notes` | Export notes to PDF via email |

## 🏗️ Database Schema

The project uses PostgreSQL with the following main tables:
- **users**: User accounts and profiles
- **notes**: Notes with title, body, tags, and metadata
- **authentications**: JWT refresh tokens
- **collaborations**: Note sharing relationships
- **uploads**: File upload metadata

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis
- RabbitMQ

### 1. Clone the repository
```bash
git clone [repository-url]
cd notes-app-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file:
```env
# Database
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=notes_app
PGHOST=localhost
PGPORT=5432

# Redis
REDIS_SERVER=localhost

# RabbitMQ
RABBITMQ_SERVER=amqp://localhost

# JWT
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret

# Storage
STORAGE_PATH=./uploads
```

### 4. Run database migrations
```bash
npm run migrate up
```

### 5. Start the server
```bash
# Development
npm run serve

# Production
npm start
```

The server will run on `http://localhost:3000`

## 🔧 Development Scripts

```bash
npm run serve          # Start development server with nodemon
npm start             # Start production server
npm run lint          # Run ESLint
npm run migrate       # Run database migrations
```

## 📊 Testing

The project includes comprehensive Postman collections for testing all endpoints:
- **Notes API Test**: Complete API testing collection
- **Authentication flows**: User registration, login, token refresh
- **Collaboration testing**: Note sharing and permissions
- **Export functionality**: PDF export via email

## 🔐 Authentication Flow

1. **Register**: Create a new user account
2. **Login**: Obtain access and refresh tokens
3. **Use Access Token**: Include in Authorization header as Bearer token
4. **Refresh Token**: Use refresh token to get new access token
5. **Logout**: Invalidate refresh token

## 🤝 Collaboration Workflow

1. **Owner creates note**: User creates a note they own
2. **Add collaborator**: Owner adds another user as collaborator
3. **Collaborator access**: Collaborator can view and edit the shared note
4. **Remove collaborator**: Owner can remove collaborator access

## 📁 Project Structure

```
notes-app-backend/
├── src/
│   ├── api/
│   │   ├── authentications/
│   │   ├── collaborations/
│   │   ├── exports/
│   │   ├── notes/
│   │   ├── uploads/
│   │   └── users/
│   ├── services/
│   │   ├── postgres/
│   │   ├── redis/
│   │   ├── rabbitmq/
│   │   └── storage/
│   ├── validator/
│   ├── exceptions/
│   └── utils/
├── migrations/
├── postman/
└── uploads/
```

## 🧪 Testing with Postman

Import the provided Postman collections:
1. **Notes API Test.postman_collection.json** - Complete API tests
2. **Notes API Test.postman_environment.json** - Environment variables

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Joi
- SQL injection prevention
- XSS protection
- Rate limiting ready

## 📈 Performance Optimizations

- Redis caching for frequently accessed data
- Database indexing for search queries
- Efficient pagination for large datasets
- Background job processing for exports

## 🐛 Troubleshooting

### Common Issues
1. **Database connection**: Ensure PostgreSQL is running and credentials are correct
2. **Redis connection**: Check Redis server is running on default port
3. **RabbitMQ connection**: Verify RabbitMQ is accessible
4. **Port conflicts**: Default port is 3000, change in .env if needed

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📄 License

This project is open source and available under the [ISC License](LICENSE).

## 🙏 Acknowledgments

- [Dicoding](https://www.dicoding.com/) for the comprehensive backend learning path
- [Hapi.js](https://hapi.dev/) community for excellent documentation
- All contributors and testers who helped improve this project

---

**Note**: This project is for educational purposes and learning backend development concepts. For production use, additional security measures and optimizations should be implemented.
