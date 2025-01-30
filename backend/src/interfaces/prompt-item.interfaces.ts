export interface PromptElement {
	type: "fixed" | "embedding" | "category" | "event" | "route";
	raw_prompt?: string;
	coords?: number[];

	name?: string;
	categories?: Record<string, number>; // percentage of each category
	isPivotPoint?: boolean;

	generated_prompt?: string;
	parsed_elements?: PromptElement[];
}