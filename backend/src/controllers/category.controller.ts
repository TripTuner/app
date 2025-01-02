import { Controller } from "@tsoa/runtime";
import { Get, OperationId, Route, Tags } from "tsoa";
import { Category } from "../entities/category.entity";
import * as CategoryService from '../services/category.service';

@Route('categories')
export class CategoryController extends Controller {
    @Get('all')
    @Tags("BackendApi")
    @OperationId('categoriesGetAll')
    public async getAll(): Promise<Array<Category>> {
        return await CategoryService.findAll();
    }
}