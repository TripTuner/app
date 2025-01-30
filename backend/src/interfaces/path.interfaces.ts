import { PromptElement } from "./prompt-item.interfaces";

export interface CreatePathModel {
	prompt: PromptElement[]; // TODO change to string
	startPosition: number[];
}