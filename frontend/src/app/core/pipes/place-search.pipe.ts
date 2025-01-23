import { Pipe, PipeTransform } from "@angular/core";
import { Place } from "../../../generated";

@Pipe({
	name: "placeSearch",
})
export class PlaceSearchPipe implements PipeTransform {

	transform(places: Place[], search: string): Place[] {
		function splitByNonLetters(str: string) {
			return str.split(/[^a-zA-Zа-яА-ЯёЁ0-9]+/).filter(Boolean); // Filter removes empty strings
		}

		function checkString(value: string, find: string) {
			let differs: number = 0;
			for (let i = 0; i < Math.min(value.length, find.length); i++)
				if (value[i] !== find[i])
					differs++;
			differs += Math.max(0, find.length - value.length);
			if (value.length < 3) return differs === 0;
			if (value.length < 5) return differs <= 1;
			return differs <= 2;
		}

		function checkArrays(value: string, search: string) {
			const value_arr = splitByNonLetters(value);
			const search_arr = splitByNonLetters(search);

			let right = 0;
			for (const item of value_arr) {
				if (right === search_arr.length)
					return true;
				if (checkString(item, search_arr[right]))
					right++;
			}

			return right === search_arr.length;
		}

		let result: Place[] = [];

		search = search.toLowerCase();
		for (const place of places) {
			if (checkArrays(( place.name || "" ).toLowerCase(), search))
				result.push(place);

			if (result.length >= 10) break;
		}

		return result;
	}

}
