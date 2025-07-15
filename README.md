# Notes App Backend - Dicoding Backend Practice

This is a simple backend project for managing notes, created as part of the Dicoding Backend Developer learning path. The project is built using the Hapi framework and stores notes in a PostgreSQL database.

## Features

- Create, read, update, and delete notes
- Notes have title, body, tags, and timestamps
- RESTful API endpoints
- PostgreSQL database storage

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

## API Endpoints

| Method | Endpoint         | Description                  |
|--------|------------------|------------------------------|
| POST   | /notes           | Create a new note             |
| GET    | /notes           | Get all notes                 |
| GET    | /notes/{id}      | Get a note by its ID          |
| PUT    | /notes/{id}      | Update a note by its ID       |
| DELETE | /notes/{id}      | Delete a note by its ID       |

### Notes

- When creating a note, the `title` field is optional and defaults to "untitled" if not provided.
- The API responses include status and message fields in Indonesian language.

## Technologies Used

- [Hapi](https://hapi.dev/) - Node.js framework for building APIs
- [nanoid](https://github.com/ai/nanoid) - For generating unique IDs
- [pg](https://node-postgres.com/) - PostgreSQL client for Node.js
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate) - Database migration tool

## Limitations

- Requires a running PostgreSQL database.
- This project is intended for learning and practice purposes only.

## License

This project is open source and free to use.
