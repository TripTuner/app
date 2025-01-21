import { Controller } from "@tsoa/runtime";
import { Get, OperationId, Path, Route, Tags } from "tsoa";
import { Category } from "../entities/category.entity";
import * as CategoryService from "../services/category.service";
import * as PlaceService from "../services/place.service";

@Route('categories')
export class CategoryController extends Controller {
    @Get('all')
    @Tags("BackendApi")
    @OperationId('categoriesGetAll')
    public async getAll(): Promise<Array<Category>> {
        return await CategoryService.findAll();
    }

    @Get(`id/place/{place_id}`)
    @Tags("BackendApi")
    @OperationId("categoriesGetByPlaceId")
    public async getByPlaceId(
        @Path() place_id: string,
    ): Promise<Array<Category>> {
        const place = await PlaceService.findPlace({ where: { _id: place_id } });
        const categories: Category[] = [];
        for (const categoryId of place.categories || [])
            categories.push(await CategoryService.findCategory({ where: { _id: categoryId } }));
        return categories;
    }
}