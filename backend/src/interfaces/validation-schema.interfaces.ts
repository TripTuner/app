export interface ValidationSchemaModel {
    [key: string]: ValidationSchemaPropertyModel
}

export interface ValidationSchemaPropertyModel {
    type: string,
    required: boolean,
    schema?: RegExp,
}