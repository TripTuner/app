import { ValidationSchemaModel } from "../interfaces/validation-schema.interfaces";
import * as errors from '../utils/errors'

interface ValidatePropertiesResponse {
    name: string;
    error: string;
}


/**
 * Validates an object based on schema
 *
 * @param {any} request any model to be validated
 * @param {ValidationSchemaModel} schema The validation schema to be used
 * @param {string[]} required An array of required object key props e.g. ['id', 'name']
 * @return {Promise<void>} otherwise throws an array of errors
 */
export const validateRequest = async function (
    request: Record<string, any>,
    schema: ValidationSchemaModel,
    required: string[],
): Promise<void> {
    if (required.length > 0) {
        const validation_errors = validateProperties(request, schema, required);
        if (Object.keys(validation_errors).length > 0)
            throw (new errors.ValidationError(validation_errors))
    }
    
    if (required.includes('password'))
        await validatePassword(request.password);
    
    return;
}

/**
 * Validating password
 *
 * @param {string} pwd password to validate
 * @returns {void} if everything valid nothing, otherwise throws an error
 */
export const validatePassword = async function (pwd: string): Promise<void> {
    if (pwd.length < 6)
        throw (new errors.InvalidUserPassword('password is shorter than 6 characters'));
    
    if (pwd.length > 50)
        throw (new errors.InvalidUserPassword('password is longer than 50 characters'));
    
    if (!pwd.match(/\d+/g))
        throw (new errors.InvalidUserPassword('password must contain at least one number'));
    
    if (!pwd.match(/[A-Za-z]/g))
        throw (new errors.InvalidUserPassword('password must contain at least one letter'));
    
    return;
}

/**
 * Validates properties
 *
 * @param {any} model any model to be validated
 * @param {ValidationSchemaModel} schema validation schema
 * @param {string[]} required An array of required object key props e.g. ['id', 'name']
 * @returns {Array<ValidatePropertiesResponse>} an array of strings of the keys to
 */
export const validateProperties = function (
    model: Record<string, any>,
    schema: ValidationSchemaModel,
    required: string[]
): Record<string, string> {
    let validation_errors: Record<string, string> = {};
    
    for (const param of required) {
        if (model[param] === undefined || !model.hasOwnProperty(param))
            validation_errors[param] = 'missing variable';
        else if (typeof model[param] !== schema[param].type)
            validation_errors[param] = 'invalid variable type';
        else if (schema[param].schema !== undefined && !model[param].match(schema[param].schema))
            validation_errors[param] = 'invalid variable schema';
    }
    
    return validation_errors;
}