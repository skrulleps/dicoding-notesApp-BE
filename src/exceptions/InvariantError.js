import ClientError from "./ClientError.js";

class InvariantError extends ClientError {
    constructor(messages) {
        super(messages);
        this.name = 'InvariantError';
    }
}

export default InvariantError;
