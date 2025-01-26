import { Category } from "../../../generated";

export default interface MapPointModel {
    name: string;
	categories: Category[];
    description: string;
	latitude: number;
	longitude: number;
    isLiked: boolean;
}
