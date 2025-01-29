import { EventPlace } from "../entities/event-place.entity";
import { Place } from "../entities/place.entity";
import { PromptElement } from "../interfaces/prompt-item.interfaces";
import * as Router from "../utils/router";
import * as CategoryService from "./category.service";
import * as EventService from "./event-place.service";
import * as PlaceService from "./place.service";

type LocationItem = Place | EventPlace;

export class AlgorithmService {
	/** raw prompt */
	prompt: string = "";
	/** startPosition */
	startPosition: number[] = [];

	/** array with parsed prompt element */
	keys: PromptElement[] = [];

	items: Array<Array<LocationItem>> = [];

	/** Maximum iterations of annealing algorithm */
	private readonly ITERATIONS = 1e5;
	/** Annealing temperature multiplier */
	private readonly TEMPERATURE_MULTIPLIER = 0.099;
	/** max elements count in items[i] */
	private readonly MAX_ITEMS_COUNT = 100;
	/**  */
	private readonly ITEM_SIMILARITY_MULTIPLIER = 1e4;
	/**  */
	private readonly CHANGES_COUNT = 1;

	constructor(prompt: string, startPosition: number[]) {
		this.prompt = prompt;
		this.startPosition = startPosition;
	}

	/** Function that generates path */
	async generate(): Promise<LocationItem[]> {
		await this.parsePrompt();
		await this.findPointsForPrompt();
		return await this.annealing();
	}

	/** Function that generates random number between 0 and 1 */
	private generateRandomNumber() {
		return Math.random();
	}

	/** Function that generates random int number on [l, r] */
	private generateRandomIntNumber(l: number, r: number) {
		return Math.floor(Math.random() * ( r - l + 1 )) + l;
	}

	/** Function that generates start placement */
	private generateStartPlacement(): Array<LocationItem> {
		let result: Array<LocationItem> = [];

		for (let i = 0; i < this.items.length; i++) {
			const index = this.generateRandomIntNumber(0, this.items[i].length - 1);
			result.push(this.items[i][index]);
		}

		return result;
	}

	/** Function that calculates error of current placement of elements */
	private async errorFunction(items: Array<LocationItem>): Promise<number> {
		let error = 0;
		let is_time_frames_valid = 1; // if path time frames are valid

		// checking time frames
		let current_time = new Date(); // duration where we will stay in point this.keys[index].time
		let faster_time = new Date(); // duration without staying in points
		for (let index = 0; index < items.length; index++) {
			let duration = 0;
			if (index != 0)
				duration = ( await Router.getDistanceBetweenTwoPoint([items[index - 1].latitude, items[index - 1].longitude], [items[index].latitude, items[index].longitude]) ).duration;
			faster_time.setMinutes(faster_time.getMinutes() + duration);
			current_time.setMinutes(current_time.getMinutes() + duration);

			if ("start time" in items[index]) { // it is event with certain time frames
				//@ts-ignore there will always be start time as we checked it in the statement
				const start: Date = items[index]["start time"];
				//@ts-ignore with the start time there is always end time
				const end: Date = items[index]["end time"];

				if (start < faster_time) {
					is_time_frames_valid = -1;
					break;
				}

				if (start < current_time) {
					is_time_frames_valid = 0;
					break;
				}

				current_time = faster_time = end;
			} else { // it is not a point with certain time frames so we only set
				current_time.setMinutes(current_time.getMinutes() + ( this.keys[index].time || 0 ));
			}
		}

		// calculating price indicator
		let price_indicator = 1; // TODO

		// calculating duration indicator
		let duration_indicator = 1; // TODO

		// calculating beauty of the path
		let beauty = 0;
		for (let index = 0; index < items.length; index++) {
			if (this.keys[index].type === "category") {
				// adding percentage of categories in 'category'
				//@ts-ignore
				const itemCategories = await CategoryService.getAllByIds(items[index].categories!);
				for (const key of Object.keys(this.keys[index].categories!)) {
					// checking if item has same category as 'category'
					let found = false;
					for (const itemCategory of itemCategories)
						if (itemCategory.name === key)
							found = true;

					// if found we should add this category percentage
					if (found)
						beauty += this.keys[index].categories![key];
				}
			} else if (this.keys[index].type === "fixed" || this.keys[index].type === "event") {
				beauty += 1;
			}
		}

		// calculating error from existing parts
		error = beauty * price_indicator * duration_indicator;

		// returns result depending on is_time_frames_valid
		if (is_time_frames_valid === 1)
			return 1e6 * error;
		if (is_time_frames_valid === 0)
			return 1e6 / error;
		if (is_time_frames_valid === -1)
			return 1e4 / error;
		return 1;
	}

	/** Function that makes random changes to path */
	private randomChangePlacement(placement: Array<LocationItem>): Array<LocationItem> {
		let result: Array<LocationItem> = [];

		for (let i = 1; i <= Math.min(result.length, this.CHANGES_COUNT); i++) {
			// generating random index of item in result to change
			let index = this.generateRandomIntNumber(0, result.length - 1);
			while (this.items[index].length === 1)
				index = this.generateRandomIntNumber(0, result.length - 1);

			// changing result[index] on other random value
			const item_index = this.generateRandomIntNumber(0, this.items[index].length - 1);
			result[index] = this.items[index][item_index];
		}

		return result;
	}

	/** Main function of annealing */
	private async annealing(): Promise<Array<LocationItem>> {
		// generating start positions
		let placement = this.generateStartPlacement();
		let result_error = await this.errorFunction(placement);

		let temperature = 1;
		for (let i = 0; i < this.ITERATIONS; i++) {
			temperature *= this.TEMPERATURE_MULTIPLIER;

			let current_placement = this.randomChangePlacement(placement);
			let current_error = await this.errorFunction(current_placement);

			if (current_error > result_error || this.generateRandomNumber() < Math.exp(( current_error - result_error ) / temperature)) {
				result_error = current_error;
				placement = current_placement;
			}
		}

		return placement;
	}

	/** Function that parses prompt into Array<PromptItem> */
	private async parsePrompt() {
		// TODO
	}

	/** Function that calculates error for LocationItem */
	private async calculateSimilarity(item: Place, categoryIndex: number): Promise<number> {
		let similarity = 1;
		const category = this.keys[categoryIndex];

		// adding percentage of categories in 'category'
		const itemCategories = await CategoryService.getAllByIds(item.categories!);
		for (const key of Object.keys(category.categories!)) {
			// checking if item has same category as 'category'
			let found = false;
			for (const itemCategory of itemCategories)
				if (itemCategory.name === key)
					found = true;

			if (found) { // if found we should add this category percentage
				similarity += category.categories![key];
			}
		}

		// multiplying similarity by ITEM_SIMILARITY_MULTIPLIER to make it less float
		similarity *= this.ITEM_SIMILARITY_MULTIPLIER;

		// checking for being close to previous fixed point or start position
		let prev_position = this.startPosition;
		let prev_index = -1;
		for (let index = 0; index < categoryIndex; index++) {
			if (this.keys[index].type !== "fixed") continue;
			prev_position = this.keys[index].coords;
			prev_index = index;
		}

		let distance: number = ( await Router.getDistanceBetweenTwoPoint(prev_position, [item.latitude, item.longitude]) ).distance;
		//distance /= ( categoryIndex - prev_index );
		similarity /= distance;

		// checking for being close to next fixed point
		let next_position = [0, 0];
		let next_index = this.keys.length;
		for (let index = this.keys.length - 1; index > categoryIndex; index--) {
			if (this.keys[index].type !== "fixed") continue;
			prev_position = this.keys[index].coords;
			prev_index = index;
		}

		if (next_index !== this.keys.length) {
			let distance: number = ( await Router.getDistanceBetweenTwoPoint(next_position, [item.latitude, item.longitude]) ).distance;
			//distance /= ( categoryIndex - prev_index );
			similarity /= distance;
		}

		// returning the answer;
		return similarity;
	};

	/** Function that finds items for each key */
	private async findPointsForPrompt() {
		// setting empty arrays for items
		this.items = [];
		for (const key of this.keys)
			this.items.push([]);

		// setting items for 'events' and 'fixed' keys
		for (let index = 0; index < this.keys.length; index++) {
			if (this.keys[index].type === "event") {
				// we should get event from database with same name
				// then we check for similarity of lon, lat

				const events = await EventService.findAll({ where: { name: this.keys[index].name } });
				for (const event of events) // checking that event lat, lon are similar to key
					if (event.latitude === this.keys[index].coords[0] && event.longitude === this.keys[index].coords[1])
						this.items[index].push(event);
			}
			if (this.keys[index].type === "fixed") {
				// we should get all places from database with same name
				// then find first with same lat, lon we should break

				const places = await PlaceService.findAll({ where: { name: this.keys[index].name } });
				for (const place of places) // checking that event lat, lon are similar to key
					if (place.latitude === this.keys[index].coords[0] && place.longitude === this.keys[index].coords[1]) {
						this.items[index].push(place);
						break;
					}
			}
		}

		// setting items for 'category'
		for (let index = 0; index < this.keys.length; index++) {
			if (this.keys[index].type === "category") {
				const places = await PlaceService.findAll();
				const sort_places: { place: Place, similarity: number }[] = []; // array with places and their similarities
				// setting similarities to places
				for (const place of places) {
					const similarity = await this.calculateSimilarity(place, index);
					sort_places.push({ place: place, similarity: similarity });
				}
				// sorting places
				sort_places.sort((a, b) => a.similarity - a.similarity);
				// getting top places
				for (let i = 0; i < this.MAX_ITEMS_COUNT; i++)
					this.items[index].push(sort_places[i].place);
			}
		}
	}
}