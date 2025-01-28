import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";
import { BackendApiService, Category, Configuration, Place } from "../../../generated";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	public api: BackendApiService;

	constructor(
		private http: HttpClient,
	) {
		this.api = new BackendApiService(this.http, environment.apiBaseUrl, new Configuration());
	}

	/**
	 * Function that gets all places from backend
	 * @returns {Promise<Place[]>} list of places
	 */
	async getAllPlaces(): Promise<Place[]> {
		try {
			return await firstValueFrom(this.api.placesGetAll());
		} catch (error) {
			throw ( error );
		}
	}

	/**
	 * Function that gets all categories from backend
	 * @returns {Promise<Category[]>} list of categories
	 */
	async getAllCategories(): Promise<Category[]> {
		try {
			return await firstValueFrom(this.api.categoriesGetAll());
		} catch (error) {
			console.log(error);
			throw ( error );
		}
	}
}
