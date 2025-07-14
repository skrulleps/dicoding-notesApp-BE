import { nanoid } from "nanoid";
import { Pool } from "pg";
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToModel } = require("../../utils");

class NoteServices {
    constructor(){
        this._pool = new Pool();
    }

    async addNote({title, body, tags}) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: "INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
            values: [id, title, body, tags, createdAt, updatedAt],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw new InvariantError("Note gagal ditambahkan");
        }

        return result.rows[0].id;
    }
    
    async getNotes() {
        const query = {
            text: "SELECT * FROM notes",
        };
        const result =  await this._pool.query(query);
        return result.rows.map(mapDBToModel);
    }

    async getNoteById(id) {
        const query = {
            text: 'SELECT * FROm WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Catatan tidak ditemukan!');
        }

        return result.rows.map(mapDBToModel)[0];
    }
}