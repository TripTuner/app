import { ServerSideSessionContext } from "./context";

import * as koa from "koa";
import * as errors from "../utils/errors"
import { redis } from "../server";


export async function koaAuthentication(request: koa.Request, securityName: string, scopes?: string[]): Promise<any> {
    const ctx = request.ctx;
    
    if (securityName === 'auth') {
        const Bearer: string = ctx.headers?.auth!.toString();
        const token = Bearer.split('Bearer: ')[1] || '';
        const session = await redis.get(token);
        
        if (session) {
            ctx.header.auth = '';
            ctx.myContext = JSON.parse(session) as ServerSideSessionContext;
            return;
        }
    }
    
    throw (new errors.Unauthorized());
}