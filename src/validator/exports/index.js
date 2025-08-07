const ExportNotesPayloadSchema = require('./schema..js');
const InvariantError = require('../../exceptions/InvariantError');

const ExportValidator = {
    validateExportNotesPayload: (payload) => {
        const validateResult = ExportNotesPayloadSchema.validate(payload);
        if (validateResult.error) {
            throw new InvariantError(validateResult.error.message);
        }
    }
};

module.exports = ExportValidator;