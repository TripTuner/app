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
		const response = await fetch("https://api.openrouteservice.org/v2/directions/foot-walking/geojson", {
			method: "POST",
			headers: {
				"Authorization": config.RouterKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ "coordinates": coordinates }),
		});
		const data = await response.json();
		const segment = data.features[0].properties.segments[0];
		return {
			distance: segment.distance,
			duration: segment.duration,
		};
	} catch (error) {
		throw ( new errors.InternalServerError() );
	}
};