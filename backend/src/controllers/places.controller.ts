import { Controller } from "@tsoa/runtime"
import { Get, OperationId, Path, Route, Tags } from "tsoa"
import { Place } from "../entities/place.entity"
import * as CategoryService from "../services/category.service"
import * as PlaceService from "../services/place.service"

@Route("places")
export class Places extends Controller {
    @Get("all")
    @Tags("BackendApi")
    @OperationId("placesGetAll")
    public async getAll(): Promise<Array<Place>> {
        return await PlaceService.findAll()
    }

    @Get(`id/{place_id}`)
    @Tags("BackendApi")
    @OperationId("placesGetById")
    public async getById(
        @Path() place_id: number,
    ): Promise<Place> {
        return await PlaceService.findPlace({ where: { _id: place_id } })
    }

    @Get(`id/{category_id}`)
    @Tags("BackendApi")
    @OperationId("placesGetByCategoryId")
    public async getByCategory(
        @Path() category_id: number,
    ): Promise<Array<Place>> {
        const category = await CategoryService.findCategory({ where: { _id: category_id } })
        return category.places
    }
}