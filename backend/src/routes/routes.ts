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
import { PingController } from "./../controllers/ping.controller";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Places } from "./../controllers/places.controller";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from "./../controllers/user.controller";
import { koaAuthentication } from "./../sessions/main";

const koaAuthenticationRecasted = koaAuthentication as (req: KRequest, securityName: string, scopes?: string[], res?: KResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
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
            "time": { "dataType": "string" },
            "subway": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Category": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"double"},
            "name": {"dataType":"string","required":true},
            "svg": {"dataType":"string","required":true},
            "places": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Place" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Place": {
        "dataType": "refObject",
        "properties": {
            "_id": { "dataType": "string" },
            "name": { "dataType": "string", "required": true },
            "type": { "dataType": "double", "required": true },
            "email": { "dataType": "string" },
            "website": { "dataType": "string" },
            "phone": { "dataType": "string" },
            "schedule": { "dataType": "string" },
            "isPaid": { "dataType": "boolean" },
            "price": { "dataType": "string" },
            "address": { "dataType": "string" },
            "data": { "ref": "PlaceDataInterface" },
            "categories": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Category" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EventPlace": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "longitude": {"dataType":"double","required":true},
            "latitude": {"dataType":"double","required":true},
            "start_time": {"dataType":"string","required":true},
            "finish_time": {"dataType":"string","required":true},
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
        place_id: { "in": "path", "name": "place_id", "required": true, "dataType": "double" },
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
        category_id: { "in": "path", "name": "category_id", "required": true, "dataType": "double" },
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
