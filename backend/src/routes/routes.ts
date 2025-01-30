/* tslint:disable */
import type * as KoaRouter from "@koa/router";
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from "@tsoa/runtime";
import { fetchMiddlewares, KoaTemplateService } from "@tsoa/runtime";
// @ts-ignore - no great way to install types from subpackage
import type { Context, Middleware, Next, Request as KRequest, Response as KResponse } from "koa";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CategoryController } from "./../controllers/category.controller";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EventPlaces } from "./../controllers/event-places.controller";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Pathes } from "./../controllers/path.controller";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PingController } from "./../controllers/ping.controller";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Places } from "./../controllers/places.controller";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from "./../controllers/user.controller";
import { koaAuthentication } from "./../sessions/main";

const koaAuthenticationRecasted = koaAuthentication as (req: KRequest, securityName: string, scopes?: string[], res?: KResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ObjectId": {
        "dataType": "refAlias",
        "type": { "dataType": "string", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Category": {
        "dataType": "refObject",
        "properties": {
            "_id": { "ref": "ObjectId" },
            "name": { "dataType": "string", "required": true },
            "svg": { "dataType": "string", "required": true },
            "places": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "ObjectId" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EventPlace": {
        "dataType": "refObject",
        "properties": {
            "_id": { "ref": "ObjectId" },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "longitude": { "dataType": "double", "required": true },
            "latitude": { "dataType": "double", "required": true },
            "start_time": { "dataType": "string", "required": true },
            "finish_time": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlaceDataInterface": {
        "dataType": "refObject",
        "properties": {
            "hasFoodPoint": { "dataType": "boolean" },
            "hasChangeRoom": { "dataType": "boolean" },
            "hasToilet": { "dataType": "boolean" },
            "hasWIFI": { "dataType": "boolean" },
            "hasWater": { "dataType": "boolean" },
            "hasChild": { "dataType": "boolean" },
            "hasSport": { "dataType": "boolean" },
            "info": { "dataType": "string" },
            "priceInfo": { "dataType": "string" },
            "conditions": { "dataType": "string" },
            "time": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "array", "array": { "dataType": "any" } }, { "dataType": "string" }],
            },
            "subway": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Place": {
        "dataType": "refObject",
        "properties": {
            "_id": { "ref": "ObjectId" },
            "name": { "dataType": "string" },
            "type": { "dataType": "double", "required": true },
            "longitude": {"dataType":"double","required":true},
            "latitude": {"dataType":"double","required":true},
            "email": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }],
            },
            "website": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }],
            },
            "phone": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }],
            },
            "schedule": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "any" }, { "dataType": "enum", "enums": [null] }],
            },
            "isPaid": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "boolean" }, { "dataType": "enum", "enums": [null] }],
            },
            "price": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }],
            },
            "address": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }],
            },
            "data": {
                "dataType": "union",
                "subSchemas": [{ "ref": "PlaceDataInterface" }, { "dataType": "enum", "enums": [null] }],
            },
            "categories": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "ObjectId" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Path": {
        "dataType": "refObject",
        "properties": {
            "_id": { "ref": "ObjectId" },
            "user": { "ref": "ObjectId" },
            "segments": {
                "dataType": "array",
                "array": { "dataType": "refAlias", "ref": "ObjectId" },
                "required": true,
            },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PathSegment": {
        "dataType": "refObject",
        "properties": {
            "_id": { "ref": "ObjectId" },
            "path": { "ref": "ObjectId", "required": true },
            "place": { "ref": "ObjectId", "required": true },
            "type": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "enum", "enums": ["fixed"] }, {
                    "dataType": "enum",
                    "enums": ["embedding"],
                }, { "dataType": "enum", "enums": ["category"] }, {
                    "dataType": "enum",
                    "enums": ["event"],
                }, { "dataType": "enum", "enums": ["route"] }],
                "required": true,
            },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LocationItem": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "ref": "Place" }, { "ref": "EventPlace" }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.number_": {
        "dataType": "refAlias",
        "type": {
            "dataType": "nestedObjectLiteral",
            "nestedProperties": {},
            "additionalProperties": { "dataType": "double" },
            "validators": {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PromptElement": {
        "dataType": "refObject",
        "properties": {
            "type": {
                "dataType": "union",
                "subSchemas": [{ "dataType": "enum", "enums": ["fixed"] }, {
                    "dataType": "enum",
                    "enums": ["embedding"],
                }, { "dataType": "enum", "enums": ["category"] }, {
                    "dataType": "enum",
                    "enums": ["event"],
                }, { "dataType": "enum", "enums": ["route"] }],
                "required": true,
            },
            "coords": { "dataType": "array", "array": { "dataType": "double" } },
            "time": { "dataType": "double" },
            "start_time": { "dataType": "string" },
            "end_time": { "dataType": "string" },
            "categories": { "ref": "Record_string.number_" },
            "name": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreatePathModel": {
        "dataType": "refObject",
        "properties": {
            "prompt": {
                "dataType": "array",
                "array": { "dataType": "refObject", "ref": "PromptElement" },
                "required": true,
            },
            "startPosition": { "dataType": "array", "array": { "dataType": "double" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserRegister": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string"},
            "name": {"dataType":"string"},
            "password": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserLogin": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserPublic": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "email": {"dataType":"string"},
            "name": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new KoaTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


export function RegisterRoutes(router: KoaRouter) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    const argsCategoryController_getAll: Record<string, TsoaRoute.ParameterSchema> = {};
    router.get("/categories/all",
        ...( fetchMiddlewares<Middleware>(CategoryController) ),
        ...( fetchMiddlewares<Middleware>(CategoryController.prototype.getAll) ),

        async function CategoryController_getAll(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsCategoryController_getAll,
                    context,
                    next,
                });
            } catch (err) {
                const error = err as any;
                error.message ||= JSON.stringify({ fields: error.fields });
                context.status = error.status;
                context.throw(context.status, error.message, error);
            }

            const controller = new CategoryController();

            return templateService.apiHandler({
                methodName: "getAll",
                controller,
                context,
                validatedArgs,
                successStatus: undefined,
            });
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCategoryController_getByPlaceId: Record<string, TsoaRoute.ParameterSchema> = {
        place_id: { "in": "path", "name": "place_id", "required": true, "dataType": "string" },
    };
    router.get("/categories/id/place/:place_id",
        ...( fetchMiddlewares<Middleware>(CategoryController) ),
        ...( fetchMiddlewares<Middleware>(CategoryController.prototype.getByPlaceId) ),

        async function CategoryController_getByPlaceId(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsCategoryController_getByPlaceId,
                    context,
                    next,
                });
            } catch (err) {
                const error = err as any;
                error.message ||= JSON.stringify({ fields: error.fields });
                context.status = error.status;
                context.throw(context.status, error.message, error);
            }

            const controller = new CategoryController();

            return templateService.apiHandler({
                methodName: "getByPlaceId",
                controller,
                context,
                validatedArgs,
                successStatus: undefined,
            });
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEventPlaces_getAll: Record<string, TsoaRoute.ParameterSchema> = {};
    router.get("/event-places/all",
        ...( fetchMiddlewares<Middleware>(EventPlaces) ),
        ...( fetchMiddlewares<Middleware>(EventPlaces.prototype.getAll) ),

        async function EventPlaces_getAll(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventPlaces_getAll, context, next });
            } catch (err) {
                const error = err as any;
                error.message ||= JSON.stringify({ fields: error.fields });
                context.status = error.status;
                context.throw(context.status, error.message, error);
            }

            const controller = new EventPlaces();

            return templateService.apiHandler({
                methodName: "getAll",
                controller,
                context,
                validatedArgs,
                successStatus: undefined,
            });
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEventPlaces_getById: Record<string, TsoaRoute.ParameterSchema> = {
        event_id: { "in": "path", "name": "event_id", "required": true, "dataType": "double" },
    };
    router.get("/event-places/id/:event_id",
        ...( fetchMiddlewares<Middleware>(EventPlaces) ),
        ...( fetchMiddlewares<Middleware>(EventPlaces.prototype.getById) ),

        async function EventPlaces_getById(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventPlaces_getById, context, next });
            } catch (err) {
                const error = err as any;
                error.message ||= JSON.stringify({ fields: error.fields });
                context.status = error.status;
                context.throw(context.status, error.message, error);
            }

            const controller = new EventPlaces();

            return templateService.apiHandler({
                methodName: "getById",
                controller,
                context,
                validatedArgs,
                successStatus: undefined,
            });
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPingController_ping: Record<string, TsoaRoute.ParameterSchema> = {};
        router.get('/ping/ping',
            ...(fetchMiddlewares<Middleware>(PingController)),
            ...(fetchMiddlewares<Middleware>(PingController.prototype.ping)),

            async function PingController_ping(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPingController_ping, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new PingController();

            return templateService.apiHandler({
              methodName: 'ping',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlaces_getAll: Record<string, TsoaRoute.ParameterSchema> = {};
    router.get("/places/all",
        ...( fetchMiddlewares<Middleware>(Places) ),
        ...( fetchMiddlewares<Middleware>(Places.prototype.getAll) ),

        async function Places_getAll(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlaces_getAll, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new Places();

            return templateService.apiHandler({
              methodName: 'getAll',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlaces_getById: Record<string, TsoaRoute.ParameterSchema> = {
        place_id: { "in": "path", "name": "place_id", "required": true, "dataType": "string" },
    };
    router.get("/places/id/:place_id",
        ...( fetchMiddlewares<Middleware>(Places) ),
        ...( fetchMiddlewares<Middleware>(Places.prototype.getById) ),

        async function Places_getById(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlaces_getById, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new Places();

            return templateService.apiHandler({
                methodName: "getById",
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlaces_getByCategory: Record<string, TsoaRoute.ParameterSchema> = {
        category_id: { "in": "path", "name": "category_id", "required": true, "dataType": "string" },
    };
    router.get("/places/id/category/:category_id",
        ...( fetchMiddlewares<Middleware>(Places) ),
        ...( fetchMiddlewares<Middleware>(Places.prototype.getByCategory) ),

        async function Places_getByCategory(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlaces_getByCategory, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new Places();

            return templateService.apiHandler({
                methodName: "getByCategory",
                controller,
                context,
                validatedArgs,
                successStatus: undefined,
            });
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPathes_getAll: Record<string, TsoaRoute.ParameterSchema> = {};
    router.get("/path/all",
        ...( fetchMiddlewares<Middleware>(Pathes) ),
        ...( fetchMiddlewares<Middleware>(Pathes.prototype.getAll) ),

        async function Pathes_getAll(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPathes_getAll, context, next });
            } catch (err) {
                const error = err as any;
                error.message ||= JSON.stringify({ fields: error.fields });
                context.status = error.status;
                context.throw(context.status, error.message, error);
            }

            const controller = new Pathes();

            return templateService.apiHandler({
                methodName: "getAll",
                controller,
                context,
                validatedArgs,
                successStatus: undefined,
            });
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPathes_getById: Record<string, TsoaRoute.ParameterSchema> = {
        path_id: { "in": "path", "name": "path_id", "required": true, "dataType": "string" },
    };
    router.get("/path/:path_id",
        ...( fetchMiddlewares<Middleware>(Pathes) ),
        ...( fetchMiddlewares<Middleware>(Pathes.prototype.getById) ),

        async function Pathes_getById(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPathes_getById, context, next });
            } catch (err) {
                const error = err as any;
                error.message ||= JSON.stringify({ fields: error.fields });
                context.status = error.status;
                context.throw(context.status, error.message, error);
            }

            const controller = new Pathes();

            return templateService.apiHandler({
                methodName: "getById",
                controller,
                context,
                validatedArgs,
                successStatus: undefined,
            });
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPathes_getSegmentsById: Record<string, TsoaRoute.ParameterSchema> = {
        path_id: { "in": "path", "name": "path_id", "required": true, "dataType": "string" },
    };
    router.get("/path/:path_id/segments",
        ...( fetchMiddlewares<Middleware>(Pathes) ),
        ...( fetchMiddlewares<Middleware>(Pathes.prototype.getSegmentsById) ),

        async function Pathes_getSegmentsById(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPathes_getSegmentsById, context, next });
            } catch (err) {
                const error = err as any;
                error.message ||= JSON.stringify({ fields: error.fields });
                context.status = error.status;
                context.throw(context.status, error.message, error);
            }

            const controller = new Pathes();

            return templateService.apiHandler({
                methodName: "getSegmentsById",
                controller,
                context,
                validatedArgs,
                successStatus: undefined,
            });
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPathes_createPath: Record<string, TsoaRoute.ParameterSchema> = {
        dto: { "in": "body", "name": "dto", "required": true, "ref": "CreatePathModel" },
    };
    router.post("/path/create",
        ...( fetchMiddlewares<Middleware>(Pathes) ),
        ...( fetchMiddlewares<Middleware>(Pathes.prototype.createPath) ),

        async function Pathes_createPath(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPathes_createPath, context, next });
            } catch (err) {
                const error = err as any;
                error.message ||= JSON.stringify({ fields: error.fields });
                context.status = error.status;
                context.throw(context.status, error.message, error);
            }

            const controller = new Pathes();

            return templateService.apiHandler({
                methodName: "createPath",
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_register: Record<string, TsoaRoute.ParameterSchema> = {
        dto: { "in": "body", "name": "dto", "required": true, "ref": "UserRegister" },
    };
        router.post('/auth/register',
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.register)),

            async function UserController_register(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_register, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new UserController();

            return templateService.apiHandler({
              methodName: 'register',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_login: Record<string, TsoaRoute.ParameterSchema> = {
        dto: { "in": "body", "name": "dto", "required": true, "ref": "UserLogin" },
    };
        router.post('/auth/login',
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.login)),

            async function UserController_login(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_login, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new UserController();

            return templateService.apiHandler({
              methodName: 'login',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_profile: Record<string, TsoaRoute.ParameterSchema> = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
        router.get('/auth/profile',
            authenticateMiddleware([{"auth":[]}]),
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.profile)),

            async function UserController_profile(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_profile, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new UserController();

            return templateService.apiHandler({
              methodName: 'profile',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(context: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            koaAuthenticationRecasted(context.request, name, secMethod[name], context.response)
                                .catch(pushAndRethrow)
                        );
                    }

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            koaAuthenticationRecasted(context.request, name, secMethod[name], context.response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let success;
            try {
                const user = await Promise.any(secMethodOrPromises);
                success = true;
                context.request['user'] = user;
            }
            catch(err) {
                // Response was sent in middleware, abort
                if(context.response.body) {
                    return;
                }

                // Show most recent error as response
                const error = failedAttempts.pop();
                context.status = error.status || 401;
                context.throw(context.status, error.message, error);
            }

            // Response was sent in middleware, abort
            if(context.response.body) {
                return;
            }

            if (success) {
                await next();
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
