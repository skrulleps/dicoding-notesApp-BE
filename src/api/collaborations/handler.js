const { user } = require("pg/lib/defaults");

class CollaborationsHandler {
    constructor(collaborationsService, notesService, validator) {
        this._collaborationsService = collaborationsService;
        this._notesService = notesService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
        
    }

    async postCollaborationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload);
        console.log(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { noteId, userId } = request.payload;
        console.log(credentialId, noteId, userId);
    
        await this._notesService.verifyNoteOwner(noteId, credentialId);
        const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId);
    
        const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
            collaborationId,
        },
        });
        response.code(201);
        return response;
    }

    async deleteCollaborationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { noteId, userId } = request.payload;
        // console.log(`Fetching collaboration for user ID: ${credentialId}, note ID: ${noteId}, user ID: ${userId}`);


        await this._notesService.verifyNoteOwner(noteId, credentialId);
        await this._collaborationsService.deleteCollaboration(noteId, userId);

        return {
            status: 'success',
            message: 'Kolaborasi berhasil dihapus',
        };
    }
}

module.exports = CollaborationsHandler;