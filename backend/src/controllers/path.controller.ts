import { Controller } from "@tsoa/runtime";
import {Get, Post, OperationId, Path, Route, Tags, Request} from "tsoa";
import * as PathEntity from "../entities/path.entity";
import { PathSegment } from "../entities/path-segment.entity";
import * as PathService from "../services/path.service";
import * as koa from "koa";

@Route("path")
export class Places extends Controller {
    @Get("all")
    @Tags("BackendApi")
    @OperationId("placesGetAll")
    public async getAll(): Promise<Array<PathEntity.Path>> {
        return await PathService.findAll()
    }

    @Get(`{path_id}`)
    @Tags("BackendApi")
    @OperationId("pathGetById")
    public async getById(
        @Path() path_id: string,
    ): Promise<PathEntity.Path> {
        return await PathService.findPath({ where: { _id: path_id } })
    }

    @Get(`{path_id}/segments`)
    @Tags("BackendApi")
    @OperationId("pathSegmentsGetById")
    public async getSegmentsById(
        @Path() path_id: string,
    ): Promise<PathSegment[]> {
        let path = await PathService.findPath({ where: { _id: path_id }});
        return await PathService.getSegments(path);
    }

    @Post(`create`)
    @Tags("BackendApi")
    @OperationId("pathCreate")
    public async createPath(
        @Request() request: koa.Request,
    ): Promise<PathEntity.Path> {
        const data = request.body!;
        // TODO Отжиг и создание маршрута
        return {segments: []}
    }
}