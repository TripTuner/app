import { Controller } from "@tsoa/runtime";
import { Body, Get, OperationId, Path, Post, Route, Tags } from "tsoa";
import { PathSegment } from "../entities/path-segment.entity";
import * as PathEntity from "../entities/path.entity";
import { CreatePathModel } from "../interfaces/path.interfaces";
import { AlgorithmService, LocationItem } from "../services/algorithm.service";
import * as PathService from "../services/path.service";

@Route("path")
export class Pathes extends Controller {
	@Get("all")
	@Tags("BackendApi")
	@OperationId("placesGetAll")
	public async getAll(): Promise<Array<PathEntity.Path>> {
		return await PathService.findAll();
	}

	@Get(`{path_id}`)
	@Tags("BackendApi")
	@OperationId("pathGetById")
	public async getById(
		@Path() path_id: string,
	): Promise<PathEntity.Path> {
		return await PathService.findPath({ where: { _id: path_id } });
	}

	@Get(`{path_id}/segments`)
	@Tags("BackendApi")
	@OperationId("pathSegmentsGetById")
	public async getSegmentsById(
		@Path() path_id: string,
	): Promise<PathSegment[]> {
		let path = await PathService.findPath({ where: { _id: path_id } });
		return await PathService.getSegments(path);
	}

	@Post(`create`)
	@Tags("BackendApi")
	@OperationId("pathCreate")
	public async createPath(
		@Body() dto: CreatePathModel,
	): Promise<LocationItem[]> {
		const algorithm = new AlgorithmService(dto.prompt, dto.startPosition);

		return await algorithm.generate();
	}
}