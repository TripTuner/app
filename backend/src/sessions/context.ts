import 'koa';


export class ServerSideSessionContext {
    sessionId!: string;
    email!: string;
}

declare module 'koa' {
    interface ExtendableContext {
        myContext: ServerSideSessionContext;
    }
}