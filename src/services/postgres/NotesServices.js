const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError.js');
const NotFoundError = require('../../exceptions/NotFoundError.js');
const { mapDBToModel } = require("../../utils/index.js");

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
            text: 'SELECT * FROM notes WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Catatan tidak ditemukan!');
        }

        return result.rows.map(mapDBToModel)[0];
    }

    async editNoteById(id, {title, body, tags}){
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
            values: [title, body, tags, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Gagal memperbarui Catatan. Id tidak ditemukan!');
        }

        return result.rows[0];
    }

    async deleteNoteById(id) {
        const query = {
            text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
            values: [id],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('Catatan gagal dihapus, Id Tidak ditemukan');
        }

    }
}

module.exports = NoteServices;
