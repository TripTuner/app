export class BadRequest extends Error {
    status = 400
    name = 'BadRequest'
    expose = false
}

export class Unauthorized extends Error {
    status = 401
    name = 'Unauthorized'
    expose = false
}

export class InternalServerError extends Error {
    status = 500
    name = 'InternalServerError'
    expose = false
}

export class Conflict extends Error {
    status = 409
    name = 'Conflict'
    expose = false
}

export class UserAlreadyExists extends Conflict {
    name = 'UserAlreadyExists'
    
    constructor() {
        super('User already exists')
    }
}

export class NotFound extends Conflict {
    name = 'NotFound'
    
    constructor(obj: string) {
        super(`${obj} not found`);
    }
}

export class UserNotFound extends Conflict {
    name = 'UserNotFound'
    
    constructor() {
        super('User not found');
    }
}

export class InvalidUserPassword extends Conflict {
    name = 'UserNotFound'
    
    constructor(mes: string) {
        super(`Invalid User Password: ${ mes }`);
    }
}

export class ValidationError extends Conflict {
    name = 'ValidationError';
    
    constructor(errors: Record<string, any>) {
        super(JSON.stringify(errors));
    }
}