export interface PromptElement {
	type: "fixed" | "embedding" | "category" | "event" | "route";
	coords?: number[];
	time?: number; // number of hours will be spent in this place
	start_time?: string; // time in format HH:MM
	end_time?: string; // time in format HH:MM
	categories?: Record<string, number>; // percentage of each category
	name?: string;
}