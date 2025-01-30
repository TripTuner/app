import { config } from "../config";
import * as errors from "./errors";

export const getDistanceBetweenTwoPoint = async (pointA: number[], pointB: number[]): Promise<{
	distance: number,
	duration: number
}> => {
	// coordinates of the segment start and end
	const coordinates: number[][] = [pointA, pointB];
	// fetches info from OSM
	try {
		console.log(coordinates);
		const response = await fetch("https://api.openrouteservice.org/v2/directions/foot-walking/geojson", {
			method: "POST",
			headers: {
				"Authorization": config.RouterKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ "coordinates": coordinates }),
		});
		const data = await response.json();
		console.log(data);
		let segments = data.features[0].properties.segments;
		let segment;
		if (segments.length > 0)
			segment = segments[0];
		else
			console.log(segments);
		return {
			distance: segment.distance,
			duration: segment.duration,
		};
	} catch (error) {
		console.log(error);
		throw ( new errors.InternalServerError() );
	}
};