const { pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
    constructor() {
        this._pool = pool;
    }

    async addRefreshToken(token) {
        const query = {
            text: 'INSERT INTO authentications (token) VALUES ($1) RETURNING id',
            values: [token],
        };

        await this._pool.query(query);
    }

    async verifyRefreshToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WEHE token = $1',
            values: [token],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new InvariantError('Refresh toke tidak valid');
        }
    }

    async deleteRefreshToken(token) {
        const query = {
            text: "DELETE FROM authentications WHERE token = $1",
            values: [token]
        };

        await this._pool.query(query);
    }
}

module.exports = AuthenticationsService;