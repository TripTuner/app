import { ValidationSchemaModel } from "../interfaces/validation-schema.interfaces";

export const createUserSchema: ValidationSchemaModel = {
    name: { type: 'string', required: true, schema: /[A-Za-z]{3,}/g},
    email: { type: 'string', required: true, schema: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
    password: { type: 'string', required: true },
}