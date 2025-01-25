import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import CategoryModel from "../models/category.model";
import GeolocationModel from "../models/geolocation.model";
import { LocationModel } from "../models/location.model";
import { MapClickEntityModel } from "../models/map-click-entity.model";
import MapPointModel from "../models/map-point.model";

@Injectable({
    providedIn: 'root'
})
export class MapInteractionsService {
    /** @param {CategoryModel[]} categories all categories for the project */
    public readonly categories: CategoryModel[] = [
        { name: 'Ресторан', src: 'restaurants' },
        { name: 'Бар', src: 'bar' },
        { name: 'Фаст-фуд', src: 'fast-food' },
        { name: 'Кафе', src: 'cafe' },
        { name: 'Парки', src: 'parks' },
        { name: 'Природная зона', src: 'nature-zone' },
        { name: 'Развлечения', src: 'entertainment' },
        { name: 'Достопримечательность', src: 'sights' },
        { name: 'Театр', src: 'theatre' },
        { name: 'Музей', src: 'museum' },
        { name: 'Пляж', src: 'beach' },
        { name: 'Магазин', src: 'shop' },
    ];

	/** @param {signal<MapClickEntityModel>} selectedPointOnPromptInput is a point that was selected during typing
	 * prompt, point should be displayed on the map */
	selectedPointOnPromptInput = signal<MapClickEntityModel | null>(null);

    /** @param {signal<number>} mapScrolled parameter that responsible for map scrolling action <br>
     * **-1** - map never been scrolled  <br> **0** - map was scrolled <br> **1** - map is being scrolled
	 */
    mapScrolled = signal<number>(-1);

	/** @param {signal<number>} mainContainerState parameter that responsible for mainContainer state <br>
     * **-1** - hidden <br> **0** - custom height <br> **1** - shown
     */
    mainContainerState = signal<number>(-1);

	/** @param {CategoryModel[]} chosenCategories all chosen categories that should be represented on the card*/
    chosenCategories = signal<CategoryModel[]>([]);

	/** @param {MapPointModel | null} chosenMapPoint chosen point on the map or **null** if user hadn't chosen anything */
    chosenMapPoint = signal<MapPointModel | null>(null);

	/** @param {signal<GeolocationModel>} userPosition parameter that responsible for the last position of the user marker <br> **null** - map was not loaded yet and last position doesn't exist <br> **GeolocationModel** - prev position of the user marker */
    userPosition = signal<GeolocationModel>({ longitude: 55, latitude: 37 });

	public userLocation = signal<LocationModel | null>(null);

	constructor(
        private readonly http: HttpClient
    ) {
        navigator.geolocation.watchPosition((pos: any) => {
            this.userPosition.set({ longitude: pos.coords.longitude, latitude: pos.coords.latitude });
            this.updateCity().then();
        })
    }

	/** @function
     * @param {CategoryModel} category category that should be checked for being chosen
     * @description function that checks `category` for being in chosen list */
    checkCategoryChosen(category: CategoryModel) {
        return this.chosenCategories().indexOf(category) !== -1;
    }

	async updateCity() {
        let bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client";
        bdcApi = bdcApi
            + "?latitude=" + this.userPosition()?.latitude
            + "&longitude=" + this.userPosition()?.longitude
            + "&localityLanguage=ru";

		const resp = await firstValueFrom(this.http.get(bdcApi));
        this.userLocation.set(resp as LocationModel);
    }
}
