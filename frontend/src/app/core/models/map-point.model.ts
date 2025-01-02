import CategoryModel from "./category.model";

export default interface MapPointModel {
    name: string;
    categories: CategoryModel[];
    description: string;
    isLiked: boolean;
}