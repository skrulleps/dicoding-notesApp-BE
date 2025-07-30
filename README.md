# Notes App Backend - Dicoding Backend Practice

This is a simple backend project for managing notes, created as part of the Dicoding Backend Developer learning path. The project is built using the Hapi framework and stores notes in a PostgreSQL database. It supports user registration, authentication, and authorization to manage notes securely.

## Project Overview

This backend service allows users to register, authenticate, and manage their personal notes. Each note is owned by a user, and only the owner can access or modify their notes. The project implements token-based authentication with access and refresh tokens to secure API endpoints.

## Features

- User registration and retrieval
- User authentication with access and refresh tokens
- Token refresh and logout functionality
- Create, read, update, and delete notes
- Notes have title, body, tags, and timestamps
- Notes are owned by users with authorization enforced
- RESTful API endpoints with validation and error handling
- PostgreSQL database storage with migrations for users, notes, and authentications

## API Endpoints

| Method | Endpoint               | Description                          |
|--------|------------------------|------------------------------------|
| POST   | /users                 | Register a new user                 |
| GET    | /users/{id}            | Get user details by user ID         |
| POST   | /authentications       | Authenticate user and get tokens   |
| PUT    | /authentications       | Refresh access token                |
| DELETE | /authentications       | Logout and delete refresh token    |
| POST   | /notes                 | Create a new note                   |
| GET    | /notes                 | Get all notes for authenticated user|
| GET    | /notes/{id}            | Get a note by its ID (owner only)  |
| PUT    | /notes/{id}            | Update a note by its ID (owner only)|
| DELETE | /notes/{id}            | Delete a note by its ID (owner only)|

### Notes

- When creating a note, the `title` field is optional and defaults to "untitled" if not provided.
- API responses include status and message fields in Indonesian language.
- Authorization is enforced to ensure users can only access their own notes.

## Installation

1. Clone the repository or download the source code.
2. Install dependencies using npm:

```bash
npm install
```

3. Set up your PostgreSQL database and configure connection settings in environment variables (`.env` file or system environment).

4. Run the database migration to create the necessary tables:

```bash
npx node-pg-migrate up
```

## Usage

Start the server with the following command:

```bash
node src/server.js
```

The server will run on the port specified in your environment variables (default is 5000). You can access the API at:

```
http://localhost:5000
```

## Technologies Used

- [Hapi](https://hapi.dev/) - Node.js framework for building APIs
- [nanoid](https://github.com/ai/nanoid) - For generating unique IDs
- [pg](https://node-postgres.com/) - PostgreSQL client for Node.js
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate) - Database migration tool
- Token-based authentication with access and refresh tokens
- Input validation and error handling

## Limitations

- Requires a running PostgreSQL database.
- This project is intended for learning and practice purposes only.

## License

This project is open source and free to use.
