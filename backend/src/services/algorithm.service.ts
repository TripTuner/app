import OpenAI from 'openai';

import { config } from "../config";
import { Category } from "../entities/category.entity";
import { EventPlace } from "../entities/event-place.entity";
import { Place } from "../entities/place.entity";
import { PromptElement } from "../interfaces/prompt-item.interfaces";
import * as errors from "../utils/errors";
import * as CategoryService from "./category.service";
import * as EventService from "./event-place.service";
import * as PlaceService from "./place.service";

interface LocationItem {
	location: Place | EventPlace;
	index: number;
	categoriesSum?: number;
}

const openai = new OpenAI({apiKey: config.openaiAPIKey, baseURL: "https://api.deepseek.com/v1"});


const BASE_PROMPT = "### ИНСТРУКЦИЯ ДЛЯ НЕЙРОСЕТИ\n" +
	"\n" +
	"Анализируй пользовательский запрос и преобразуй его в JSON-структуру по правилам:\n" +
	"\n" +
	"1. **Распознавание тегов**:\n" +
	"   - `<#:fixed:[lon]:[lat]:[name]>` → тип `fixed` (статичная точка)\n" +
	"     - Поля: [`lon` , `lat`] (список чисел), `name` (строка), `isPivotPoint` (true/false)\n" +
	"   - `<#:embeding:[name]>` → тип `embeding` (группа точек)\n" +
	"     - Поле: `name` (строка)\n" +
	"   - `<@:[name]>` → тип `event` (событие)\n" +
	"     - Поле: `name` (строка)\n" +
	"\n" +
	"2. **Обработка текста без тегов**:\n" +
	"   → Если есть прямое упоминание категории → тип `category` (см. список ниже)  \n" +
	"   → Иначе → выполни операцию ImagineRoute\n" +
	"\n" +
	"3. Операция ImagineRoute:\n" +
	"   • Сгенерируй уточняющий подпромпт на основе изначального raw_prompt этого подпромпта, в котором придумай возможный вариант маршрута по местам из списка категорий и их сочетаний, подходящий под запрос (допустимо разбиение на несколько последовательных мест, последовательный маршрут). Сгенерированный промпт может быть написан как сценарий прогулки, где места идут по-порядку, или на выбр одно из нескольких, в зависимости от условий запроса пользователя\n" +
	"   • Рекурсивно примени эти же правила к сгенерированному тексту и добавь все места в изначальный промпт. Разные части подмаршрута помечай как отдельную локацию\n" +
	"\n" +
	"4. **Категории (ТОЛЬКО из списка)**:\n" +
	"Бассейн\n" +
	"Спорт площадка\n" +
	"Спорт зал\n" +
	"Катание на лошадях\n" +
	"Теннис\n" +
	"Каток\n" +
	"Тир\n" +
	"Пейнтбол\n" +
	"Футбол\n" +
	"Регби\n" +
	"Скалодром\n" +
	"Ресторан\n" +
	"Бар\n" +
	"Фаст-фуд\n" +
	"Кафе\n" +
	"Кафетерий\n" +
	"Закусочная\n" +
	"Магазин еды\n" +
	"Ночной клуб\n" +
	"Парк\n" +
	"Ботанический сад\n" +
	"Пикник\n" +
	"Кинотеатр\n" +
	"Клуб\n" +
	"Аквапарк\n" +
	"Игровая площадка\n" +
	"Детский технопарк\n" +
	"Досуг\n" +
	"Аттракционы\n" +
	"Библиотека\n" +
	"Выставка\n" +
	"Музей\n" +
	"Театр\n" +
	"Дом культуры\n" +
	"Концертный зал\n" +
	"Мечеть\n" +
	"Католический храм\n" +
	"Монастырь\n" +
	"Синагога\n" +
	"Православная церковь\n" +
	"Коворкинг\n" +
	"Гипермаркет\n" +
	"Дискаунтер\n" +
	"Промтовары\n" +
	"Магазин\n" +
	"Алкомаркет\n" +
	"Магазин цветов\n" +
	"Магазин одежды\n" +
	"Супермаркет\n" +
	"Автосалон\n" +
	"\n" +
	"5. **Формат ответа**:\n" +
	"   - Сохраняй исходный порядок элементов относительно текста запроса в итовых данных.\n" +
	"\n" +
	"---\n" +
	"\n" +
	"### ВХОДНЫЕ ДАННЫЕ (пример)\n" +
	"\"Вечерний маршрут: ужин в <#:embeding:TopRestaurants>, затем культурная программа\"\n" +
	"\n" +
	"---\n" +
	"\n" +
	"### ОЖИДАЕМЫЙ ОТВЕТ (шаблон)\n" +
	"```json\n" +
	"[\n" +
	"    {\n" +
	"      \"type\": \"embeding\",\n" +
	"      \"raw_prompt\": \"<#:embeding:TopRestaurants>\",\n" +
	"      \"name\": \"TopRestaurants\"\n" +
	"    },\n" +
	"    {\n" +
	"      \"type\": \"route\",\n" +
	"      \"raw_prompt\": \"культурная программа\",\n" +
	"      \"generated_prompt\": \"Посещение театра или музея вечером\",\n" +
	"      \"parsed_elements\": [\n" +
	"        {\n" +
	"          \"type\": \"category\",\n" +
	"          \"categories\": {\"Театр\": 60, \"Музей\": 40}\n" +
	"        }\n" +
	"      ]\n" +
	"    }\n" +
	"  ]\n" +
	"```\n" +
	"\n" +
	"---\n" +
	"\n" +
	"### ВХОДНЫЕ ДАННЫЕ (пример)\n" +
	"\"Прогулка может включать посещение парка с живописными видами, ужин в романтическом ресторане и завершиться посещением аквапарка для совместного отдыха\"\n" +
	"\n" +
	"---\n" +
	"\n" +
	"### ОЖИДАЕМЫЙ ОТВЕТ (шаблон)\n" +
	"\n" +
	"```json\n" +
	"[{\"type\":\"route\",\"raw_prompt\":\"Романтическая прогулка по москве\",\"generated_prompt\":\"Прогулка может включать посещение парка с живописными видами и завершится ужином в романтическом ресторане\",\"parsed_elements\":[{\"type\":\"category\",\"raw_prompt\":\"парк с живописными видами\",\"categories\":{\"Парк\":100}},{\"type\":\"category\",\"raw_prompt\":\"ужином в романтическом ресторане\",\"categories\":{\"Ресторан\":100}}]},{\"type\":\"category\",\"raw_prompt\":\"с посещением аквапарка\",\"categories\":{\"Аквапарк\":100}}]\n" +
	"```\n" +
	"\n" +
	"---\n" +
	"\n" +
	"### ВХОДНЫЕ ДАННЫЕ (пример)\n" +
	"\"Сходить в кино с другом, а потом посетить кафе с коворкингом\"\n" +
	"\n" +
	"---\n" +
	"\n" +
	"### ОЖИДАЕМЫЙ ОТВЕТ (шаблон)\n" +
	"\n" +
	"```json\n" +
	"[{\"type\":\"category\",\"raw_prompt\":\"Сходить в кино с другом\",\"categories\":{\"Кинотеатр\":100}},{\"type\":\"category\",\"raw_prompt\":\"посетить кафе с коворкингом\",\"categories\":{\"Кафе\":60, \"Коворкинг\": 70}}]\n" +
	"```\n" +
	"\n" +
	"### ВХОДНЫЕ ДАННЫЕ\n" +
	"\n" +
	"{USER_INPUT}\n" +
	"\n" +
	"### ОТВЕТ";


export class AlgorithmService {
	/** raw prompt */
	prompt: string = "";
	/** startPosition */
	startPosition: number[] = [];

	/** array with parsed prompt element */
	keys: PromptElement[] = [];

	items: Array<Array<LocationItem>> = [];

	categories: Array<Category> = [];

	distancesMatrix: number[][][] = [];
	durationsMatrix: number[][][] = [];

	/** Maximum iterations of annealing algorithm */
	private readonly ITERATIONS = 1e6;
	/** Annealing temperature multiplier */
	private readonly TEMPERATURE_MULTIPLIER = 0.9;
	/** max elements count in items[i] */
	private readonly MAX_ITEMS_COUNT = 50;
	/** maximum count of items after pre similarity calculation */
	private readonly MAX_ITEMS_PRE_COUNT = 50;
	/**  */
	private readonly ITEM_SIMILARITY_MULTIPLIER = 1e4;
	/**  */
	private readonly CHANGES_COUNT = 1;

	constructor(prompt: PromptElement[], startPosition: number[]) {
		this.keys = prompt; // TODO change after testing
		this.startPosition = startPosition;
	}

	/** Function that generates path */
	async generate(): Promise<Array<Place | EventPlace>> {
		// getting all existed categories
		this.categories = await CategoryService.findAll();

		let start = Date.now();
		console.log("\x1b[36m[algorithm]\x1b[0m generation has been started: ", ( Date.now() - start ), "ms");
		start = Date.now();

		await this.parsePrompt();
		console.log("\x1b[36m[algorithm]\x1b[0m prompt has been parsed: ", ( Date.now() - start ), "ms");
		start = Date.now();

		await this.findPointsForPrompt();
		console.log("\x1b[36m[algorithm]\x1b[0m points for prompt were found: ", ( Date.now() - start ), "ms");
		start = Date.now();

		await this.calculateDistances();
		console.log("\x1b[36m[algorithm]\x1b[0m distances for prompt were calculated: ", ( Date.now() - start ), "ms");
		start = Date.now();

		const result = await this.annealing();
		console.log("\x1b[36m[algorithm]\x1b[0m annealing finished: ", ( Date.now() - start ), "ms");

		const path: Array<EventPlace | Place> = [];
		for (const locationItem of result)
			path.push(locationItem.location);
		return path;
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

	/** Calculates similarities without distances */
	public async calculatePreSimilarity(
		item: {
			place: Place,
			index: number
		},
		categoryIndex: number,
	): Promise<number[]> {
		function getDistances(coords: number[][]): number[] {
			for (let coord of coords)
				for (let number of coord)
					number = Math.ceil(number * 1000);
			const pythagoreanDistance = Math.sqrt(( coords[0][0] - coords[1][0] ) * ( coords[0][0] - coords[1][0] ) + ( coords[0][1] - coords[1][1] ) * ( coords[0][1] - coords[1][1] ));
			const manhattanDistance = Math.abs(coords[0][0] - coords[1][0]) + Math.abs(coords[0][1] - coords[1][1]);
			return [pythagoreanDistance, manhattanDistance];
		}

		let similarity = 0, categoriesSum = 0;
		const promptElement = this.keys[categoryIndex];

		/** calculating categories similarity */
			// getting all user categories
		const itemCategories: string[] = [];
		for (const objectId of item.place.categories!) {
			const id = objectId.toString();
			for (const category of this.categories)
				if (category._id?.toString() === id) {
					itemCategories.push(category.name);
					break;
				}
		}

		// adding percentage to similarity
		for (const key of Object.keys(promptElement.categories!)) {
			// if found we should add this category percentage
			if (itemCategories.includes(key)) {
				similarity += promptElement.categories![key];
				categoriesSum += promptElement.categories![key];
			}
		}

		/** calculating the Pythagorean and Manhattan distances to the previous fixed point */
		let pythagoreanPrevDistance = 0;
		let manhattanPrevDistance = 0;
		let prev_index = -1;
		for (let index = 0; index < categoryIndex; index++) {
			if (this.keys[index].type !== "fixed") continue;
			prev_index = index;
		}
		// if we found previous fixed point
		if (prev_index !== -1) {
			const coords = [[item.place.latitude, item.place.longitude], [this.items[prev_index][0].location.latitude, this.items[prev_index][0].location.longitude]];
			[pythagoreanPrevDistance, manhattanPrevDistance] = getDistances(coords);
		}

		/** calculating the Pythagorean and Manhattan distances to the next fixed point */
		let next_index = -1;
		let pythagoreanNextDistance = 0;
		let manhattanNextDistance = 0;
		for (let index = this.keys.length - 1; index > categoryIndex; index--) {
			if (this.keys[index].type !== "fixed") continue;
			next_index = this.items[index][0].index;
		}
		// if next point exists
		if (next_index !== -1) {
			const coords = [[item.place.latitude, item.place.longitude], [this.items[next_index][0].location.latitude, this.items[next_index][0].location.longitude]];
			[pythagoreanNextDistance, manhattanNextDistance] = getDistances(coords);
		}

		/** adding Pythagorean and Manhattan distances to answer */
		const prevDistance = ( pythagoreanPrevDistance + manhattanPrevDistance ) / 2;
		const nextDistance = ( pythagoreanNextDistance + manhattanNextDistance ) / 2;
		similarity = similarity * ( 1e5 / ( prevDistance + nextDistance ) );

		// returning the answer;
		return [similarity, categoriesSum];
	}

	/** Function that makes random changes to path */
	private randomChangePlacement(placement: Array<LocationItem>): Array<LocationItem> {
		let result: Array<LocationItem> = placement;

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
	private async parsePrompt(): Promise<PromptElement[]> {
		const prompted = await openai.chat.completions.create({
			messages: [{ role: 'user', content: BASE_PROMPT.replace("{USER_INPUT}", this.prompt)}],
			model: 'deepseek-reasoner',
		});
		let content = JSON.parse(prompted.choices[0].message.content!);

		let parsed: PromptElement[] = [];
		content.forEach((el: PromptElement) => {
			if (el.type == "route") {
				el.parsed_elements!.forEach((par: PromptElement) => {
					parsed.push(par)
				})
			} else {
				parsed.push(el)
			}
		});

		return parsed;

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
			if (index != 0) {
				// getting duration between prev and this points in minutes
				duration = Math.floor(this.durationsMatrix[index - 1][items[index - 1].index][items[index].index] / 60);
			}
			faster_time.setMinutes(faster_time.getMinutes() + duration);
			current_time.setMinutes(current_time.getMinutes() + duration);

			if ("start time" in items[index].location && "end time" in items[index].location) { // it is event with certain time frames
				//@ts-ignore there will always be start time as we checked it in the statement
				const start: Date = items[index].location["start time"];
				//@ts-ignore
				const end: Date = items[index].location["end time"];

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

		// calculating distance indicator
		let average_distance = 0;
		let min_distance = 1e9;
		let max_distance = 0;
		for (let i = 1; i < items.length; i++) {
			const meters = this.distancesMatrix[i - 1][items[i - 1].index][this.items[i - 1].length + items[i].index];
			const kilometers = Math.max(Math.ceil(meters / 1000));
			average_distance += kilometers;
			min_distance = Math.min(min_distance, kilometers);
			max_distance = Math.max(max_distance, kilometers);
		}
		average_distance /= ( items.length - 1 );
		const distance_indicator = average_distance * Math.max(1, max_distance - min_distance);
		if (distance_indicator === 0)
			throw ( new errors.InternalServerError("distance indicator is 0") );

		// calculating price indicator
		let price_indicator = 1; // TODO

		// calculating duration indicator
		let duration_indicator = 1; // TODO

		// calculating beauty of the path
		let beauty = 0;
		for (let index = 0; index < items.length; index++) {
			if (this.keys[index].type === "category")
				beauty += items[index].categoriesSum!;
			else if (this.keys[index].type === "fixed" || this.keys[index].type === "event")
				beauty += 100;
		}

		if (isNaN(beauty))
			throw ( new errors.InternalServerError("beauty is NaN") );

		// calculating error from existing parts
		error = beauty * ( 1e4 / distance_indicator );

		// returns result depending on is_time_frames_valid
		if (is_time_frames_valid === 1)
			return 1e4 * error;
		if (is_time_frames_valid === 0)
			return 1e4 / error;
		if (is_time_frames_valid === -1)
			return 1e1 / error;
		return 1;
	}

	/** Function that calculates error for LocationItem */
	private async calculateSimilarity(
		item: {
			place: Place,
			index: number
		},
		categoryIndex: number,
		preSimilarity: number,
		distancesMatrix: number[][],
	): Promise<number> {
		let similarity = preSimilarity;

		// making for digits before comma for similarity
		similarity *= this.ITEM_SIMILARITY_MULTIPLIER;

		// checking for being close to previous fixed point
		let prev_index = 0;
		for (let index = 0; index < categoryIndex; index++) {
			if (this.keys[index].type !== "fixed") continue;
			prev_index = this.items[index][0].index;
		}

		if (distancesMatrix === undefined) {
			throw ( new errors.InternalServerError("distance matrix is undefined") );
		}

		let distance: number = distancesMatrix[item.index][prev_index];
		//distance /= ( categoryIndex - prev_index );
		similarity /= distance;

		// checking for being close to next fixed point
		let next_index = -1;
		for (let index = this.keys.length - 1; index > categoryIndex; index--) {
			if (this.keys[index].type !== "fixed") continue;
			next_index = this.items[index][0].index;
		}

		if (next_index !== -1) {
			let distance: number = distancesMatrix[item.index][next_index];
			//distance /= ( categoryIndex - prev_index );
			similarity /= distance;
		}

		// returning the answer;
		return similarity;
	};

	/** Finds all distances between each pair of points in this.items */
	private async calculateDistances() {
		this.distancesMatrix = [];
		this.durationsMatrix = [];

		for (let i = 1; i < this.items.length; i++) {
			// set up location Array<[latitude, longitude]>
			const locations: number[][] = [];
			for (const locationItem of this.items[i - 1])
				locations.push([locationItem.location.latitude, locationItem.location.longitude]);
			for (const locationItem of this.items[i])
				locations.push([locationItem.location.latitude, locationItem.location.longitude]);

			// getting duration ans distances matrix from ORS
			const response = await fetch(`${ config.RouterUrl }/v2/matrix/foot-walking`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": config.RouterKey,
				},
				body: JSON.stringify({
					locations: locations,
					"metrics": ["distance", "duration"],
				}),
			});
			const data = await response.json();
			this.durationsMatrix.push(data.durations);
			this.distancesMatrix.push(data.distances);
		}

		// validating matrices
		for (const distancesMatrix1 of this.distancesMatrix)
			if (distancesMatrix1 === undefined)
				throw ( new errors.InternalServerError("durations matrix is undefined") );
		for (const durationsMatrix1 of this.durationsMatrix)
			if (durationsMatrix1 === undefined)
				throw ( new errors.InternalServerError("distances matrix is undefined") );
	}

	/** Function that finds items for each key */
	private async findPointsForPrompt() {
		let start = Date.now(); // TODO remove after testing

		// setting empty arrays for items
		this.items = [];
		for (const key of this.keys)
			this.items.push([]);

		// setting arrays getting distances matrix with places
		let locations: number[][] = [this.startPosition],
			lastIndex = 1;

		// setting items for 'events' and 'fixed' keys
		for (let index = 0; index < this.keys.length; index++) {
			if (this.keys[index].type === "event") {
				// we should get event from database with same name
				// then we check for similarity of lon, lat

				const events = await EventService.findAll({ where: { name: this.keys[index].name } });
				for (const event of events) // checking that event lat, lon are similar to key
					if (event.latitude === this.keys[index].coords![0] && event.longitude === this.keys[index].coords![1])
						this.items[index].push({
							location: event,
							index: 0,
						});
			}
			if (this.keys[index].type === "fixed") {
				// we should get all places from database with same name
				// then find first with same lat, lon we should break

				const places = await PlaceService.findAll({ where: { name: this.keys[index].name } });
				for (const place of places) { // checking that event lat, lon are similar to key
					if (place.latitude === this.keys[index].coords![0] && place.longitude === this.keys[index].coords![1]) {
						this.items[index].push({
							location: place,
							index: lastIndex++,
						});
						locations.push([place.latitude, place.longitude]);
						break;
					}
				}
			}
		}

		// settings each place unique id and putting it into `locations`
		const places = await PlaceService.findAll();
		const points: { place: Place, index: number }[] = [];
		for (const place of places)
			points.push({ place: place, index: 0 });

		// setting items for 'category'
		for (let index = 0; index < this.keys.length; index++) {
			if (this.keys[index].type === "category") {
				console.log(`\x1b[36m[algorithm]\x1b[0m \x1b[35m[findPointsForPrompt]\x1b[0m \x1b[34m[${ index } iteration]\x1b[0m start: `, ( Date.now() - start ), "ms"); // TODO remove after testing
				start = Date.now(); // TODO remove after testing

				// calculating places pre-similarities
				let sort_places: { place: Place, index: number, similarity: number, categoriesSum: number }[] = []; // array with places and their similarities
				for (const point of points) {
					if (!isNaN(point.place.longitude) && !isNaN(point.place.latitude)) {
						const [pre_similarity, categoriesSum] = await this.calculatePreSimilarity(point, index);
						sort_places.push({
							place: point.place,
							index: point.index,
							similarity: pre_similarity,
							categoriesSum: categoriesSum,
						});
					}
				}

				console.log(`\x1b[36m[algorithm]\x1b[0m \x1b[35m[findPointsForPrompt]\x1b[0m \x1b[34m[${ index } iteration]\x1b[0m calculated pre similarities: `, ( Date.now() - start ), "ms"); // TODO remove after testing
				start = Date.now(); // TODO remove after testing

				// sorting places by their pre-similarity
				sort_places.sort((a, b) => b.similarity - a.similarity);
				sort_places = sort_places.slice(0, this.MAX_ITEMS_PRE_COUNT);

				// configurations matrix with locations
				let currentLastIndex = lastIndex;
				const matrix_locations = [...locations];
				for (let place of sort_places) {
					place.index = currentLastIndex++;
					matrix_locations.push([place.place.latitude, place.place.longitude]);
				}

				// getting distances matrix from OSM
				const response = await fetch(`${ config.RouterUrl }/v2/matrix/foot-walking`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": config.RouterKey,
					},
					body: JSON.stringify({
						locations: matrix_locations,
						"metrics": ["distance"],
					}),
				});
				const data = await response.json();
				const distancesMatrix = data.distances;

				console.log(`\x1b[36m[algorithm]\x1b[0m \x1b[35m[findPointsForPrompt]\x1b[0m \x1b[34m[${ index } iteration]\x1b[0m got distance matrixes: `, ( Date.now() - start ), "ms"); // TODO remove after testing
				start = Date.now(); // TODO remove after testing

				// calculating places similarities
				for (const place of sort_places) {
					place.similarity = await this.calculateSimilarity({
						place: place.place,
						index: place.index,
					}, index, place.categoriesSum, distancesMatrix);
				}

				// sorting places by their similarity
				sort_places.sort((a, b) => b.similarity - a.similarity);
				sort_places = sort_places.slice(0, this.MAX_ITEMS_COUNT);

				// getting top places
				for (const place of sort_places)
					this.items[index].push({
						location: place.place,
						index: 0,
						categoriesSum: place.categoriesSum,
					});

				console.log(`\x1b[36m[algorithm]\x1b[0m \x1b[35m[findPointsForPrompt]\x1b[0m \x1b[34m[${ index } iteration]\x1b[0m finished: `, ( Date.now() - start ), "ms"); // TODO remove after testing
				start = Date.now(); // TODO remove after testing
			}
		}

		// setting indexes for each item
		for (const item of this.items) {
			let index = 0;
			for (let locationItem of item)
				locationItem.index = index++;
		}
	}
}