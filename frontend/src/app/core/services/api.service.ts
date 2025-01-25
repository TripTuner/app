import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";
import { BackendApiService, Configuration, Place } from "../../../generated";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	public api: BackendApiService;
	public places = signal<Array<Place>>([]);

	constructor(
		private http: HttpClient,
	) {
		this.api = new BackendApiService(this.http, environment.apiBaseUrl, new Configuration());
		this.getAllPlaces().then(places => this.places.set(places));
	}

	async getAllPlaces(): Promise<Array<Place>> {
		let result: Place[] = [];

		try {
			result = await firstValueFrom(this.api.placesGetAll());
		} catch (error) {
			console.log(error);
			throw ( error );
		}

		return result;
	}
}
