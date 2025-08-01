const ClientError = require("../../exceptions/ClientError");

class NotesHandler {
 constructor(service, validator) {
   this._service = service;
   this._validator = validator;
 
   this.postNoteHandler = this.postNoteHandler.bind(this);
   this.getNotesHandler = this.getNotesHandler.bind(this);
   this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
   this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
   this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
 }
 
  async postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { title = 'untitled', body, tags } = request.payload;
      const {id: credentialId} = request.auth.credentials;

      const noteId = await this._service.addNote({ 
        title, body, tags, owner: credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
  
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

 async getNotesHandler(request, h) {
   try {
     const { id: credentialId } = request.auth.credentials;
     console.log(`Fetching notes for user ID: ${credentialId}`);
     
     const notes = await this._service.getNotes(credentialId);
     console.log(notes);
     return {
       status: 'success',
       data: {
         notes,
       },
     };
   } catch (error) {
     const response = h.response({
       status: 'error',
       message: 'Terjadi kegagalan pada server kami',
     });
     response.code(500);
     console.error(error);
     return response;
   }
 }
 
 async getNoteByIdHandler(request, h) {
  try {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    console.log(`Fetching note with ID: ${id} for user ID: ${credentialId}`);

    await this._service.verifyNoteAccess(id, credentialId);
    const note = await this._service.getNoteById(id);
    
    console.log(note);
    return {
      status: 'success',
      data: {
        note,
      },
    };
  } catch (error) {
    if(error instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }
    // Server Error Handling
    const response = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami',
    });
    response.code(500);
    console.error(error);
    return response;
  }
 }
 
 async putNoteByIdHandler(request, h) {
  try {
    this._validator.validateNotePayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyNoteAccess(id, credentialId);
    await this._service.editNoteById(id, request.payload);

      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
  } catch (error) {
    if (error instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }
    // Server Error Handling
    const response = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami',
    });
    response.code(500);
    console.error(error);
    return response;
  }


 }
 
 async deleteNoteByIdHandler(request, h) {
  try {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyNoteOwner(id, credentialId);
    await this._service.deleteNoteById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
    
  } catch (error) {
    if (error instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }
    // Server Error Handling
    const response = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami',
    });
    response.code(500);
    console.error(error);
    return response;
  }

 }
}
 
module.exports = NotesHandler;

// const ClientError = require("../../exceptions/ClientError");

// class NotesHandler {
//     constructor(service, validator) {
//         this._service = service;
//         this._validator = validator;

//         this.postNoteHandler = this.postNoteHandler.bind(this);
//         this.getNotesHandler = this.getNotesHandler.bind(this);
//         this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
//         this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
//         this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
//     }

//     postNoteHandler(request, h) {
//         try {
//             this._validator.validateNotePayload(request.payload);
//             const {title = 'untitled', body, tags} = request.payload;
//             const noteId = this._service.addNote({title, body, tags});

//             const response = h.response({
//                 status: 'success',
//                 message: 'Catatan berhasil ditambahkan',
//                 data: {
//                     noteId
//                 }
//             });
//             response.code(201);
//             return response;
//         } catch (error) {
//             if (error instanceof ClientError){
//                 const response = h.response({
//                     status: 'fail',
//                     message: error.message
//                 });
//                 response.code(error.statusCode);
//                 return response;
//             }

//             // Server error handling
//             const response = h.response({
//                 status: 'error',
//                 message: 'Maaf terjadi kegagalan pada server kami',
//             });
//             response.code(500);
//             console.error(error);
//             return response;
//         }
        
//     }

//     getNotesHandler() {
//         const notes = this._service.getAllNotes();
//         return {
//             status: 'success',
//             data: {
//                 notes
//             }
//         };
//     }

//     getNoteByIdHandler(request, h) {
//         try {
//             const { id } = request.params;
//             const note = this._service.getNoteById(id);
//             const response = h.response({
//                 status: 'success',
//                 data: {
//                     note
//                 }
//             });
//             response.code(200);
//             return response;
//         } catch (error) {
//             if (error instanceof ClientError) {
//                 const response = h.response({
//                     status: 'fail',
//                     message: error.message
//                 });
//                 response.code(error.statusCode);
//                 return response;
//             }

//             // Server error handling
//             const response = h.response({
//                 status: 'error',
//                 message: "Maaf, terjadi kesalahan pada server kami"
//             });
//             response.code(500);
//             return response;
//         }
//     }

//     putNoteByIdHandler(request, h) {
//         try {
//             this._validator.validateNotePayload(request.payload);
//             // Menggunakan destructuring untuk mengambil id dari request.params
//             const { id } = request.params;
//             this._service.editNoteById(id, request.payload);

//             return {
//                 status: 'success',
//                 message: 'Catatan berhasil diperbarui'
//             };
//         } catch (error) {
//             if (error instanceof ClientError) {
//                 const response = h.response({
//                     status: 'fail',
//                     message: error.message
//                 });
//                 response.code(error.statusCode);
//                 return response;
//             }

//             // Server error handling
//             const response = h.response({
//                 status: 'fail',
//                 message: "Maaf, terjadi kesalahan pada server kami"
//             });
//             response.code(500);
//             console.error(error);
//             return response;
//         }
//     }

//     deleteNoteByIdHandler(request, h) {
//         try {
//             const { id } = request.params;
//             this._service.deleteNoteById(id);
//             const response = h.response({
//                 status: 'success',
//                 message: 'Catatan berhasil dihapus'
//             });
//             response.code(200);
//             return response;
//         } catch (error) {
//             if (error instanceof ClientError) {
//                 const response = h.response({
//                     status: 'fail',
//                     message: error.message
//                 });
//                 response.code(error.statusCode);
//                 return response;
//             }

//             const response = h.response({
//                 status: 'fail',
//                 message: "Maaf, terjadi kesalahan pada server kami"
//             });
//             response.code(500);
//             console.error(error);
//             return response;
//         }
//     }
// }

// module.exports = NotesHandler;