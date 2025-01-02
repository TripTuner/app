import { Controller } from "@tsoa/runtime";
import { Body, Get, Header, OperationId, Post, Put, Route, Security, Tags } from "tsoa";

@Route('ping')
export class PingController extends Controller {
    @Get('ping')
    @Tags("BackendApi")
    @OperationId('ping')
    public async ping(): Promise<string> {
        return 'success';
    }
}