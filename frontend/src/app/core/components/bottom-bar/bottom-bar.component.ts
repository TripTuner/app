import {
	AfterViewInit,
	Component,
	effect,
	ElementRef,
	QueryList,
	signal,
	ViewChild,
	ViewChildren,
} from "@angular/core";
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { filter } from "rxjs";
import { Category, EventPlace, Place } from "../../../../generated";
import { MapClickEntityModel } from "../../models/map-click-entity.model";
import { PlaceSearchPipe } from "../../pipes/place-search.pipe";
import { MapInteractionsService } from "../../services/map-interactions.service";
import { NotificationsService } from "../../services/notifications.service";
import { isInstanceOfEventPlace, isInstanceOfPlace } from "../../services/utils.service";
import { SlideCategoriesComponent } from "../slide-categories.component";

/**
 * Function that splits string by last index of char in text
 *
 * @param {string} text text that should be split
 * @param {string} char char for splitting
 * @returns {string[]} string array with two strings
 */
function splitTextByLastOccurrence(text: string, char: string): string[] {
	const lastIndex = text.lastIndexOf(char);
	if (lastIndex === -1) {
		return [text, ""]; // Возвращает весь текст и пустую строку, если символ не найден
	}
	const part1 = text.slice(0, lastIndex);
	const part2 = text.slice(lastIndex + char.length);
	return [part1, part2];
}

/**
 * Function that checks that object is type of Category
 *
 * @param {any} obj object that should be checked
 * @returns {boolean} is objected type of Category
 */
function isInstanceOfCategory(obj: any): obj is Category {
	return (
		typeof obj === "object" &&
		obj !== null &&
		( typeof obj._id === "undefined" || typeof obj._id === "string" ) &&
		typeof obj.name === "string" &&
		typeof obj.svg === "string" &&
		Array.isArray(obj.places) &&
		obj.places.every((place: any) => typeof place === "string")
	);
}

/**
 * Function that places Caret to the end of the editor
 *
 * @param {HTMLDivElement} editor editor in which caret should be placed
 * @param {number} pos place where cater should be places
 */
function placeCaretAt(editor: HTMLDivElement, pos: number) {
	const range = document.createRange();
	const sel = window.getSelection()!;

	const children = editor.childNodes;
	let [index, position] = [0, pos];
	while (index < children.length) {
		//@ts-ignore
		const length = (children[index].nodeValue || children[index].innerText).length;
		if (position <= length) break;
		position -= length;
		index++;
	}
	if (children[index].nodeValue === null)
		range.setStart(children[index].childNodes[0], position)
	else
		range.setStart(children[index], position)
	range.collapse(true)

	sel.removeAllRanges()
	sel.addRange(range)
}

/** Returns caret position in editor */
function getCaretPosition(editor: HTMLDivElement) {
	let caretOffset = 0;
	const selection = window.getSelection()!;
	if (selection.rangeCount > 0) {
		const range = selection.getRangeAt(0);
		const preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(editor);
		preCaretRange.setEnd(range.endContainer, range.endOffset);
		caretOffset = preCaretRange.toString().length;
	}
	return caretOffset;
}

@Component({
	selector: "BottomBar",
	standalone: true,
	imports: [
		RouterLink,
		RouterLinkActive,
		SlideCategoriesComponent,
		PlaceSearchPipe,
	],
	styleUrl: "./bottom-bar.component.css",
	template: `
		<div class="container" #container>
			<div class="input-addon" #inputAddon>
				<div class="scroll-container">
					<div class="scroll-content">
						@for (item of searchArray() | placeSearch:this.searchText; track mapInteractionService.places) {
							<div class="card" (click)="handlePromptSearchBoxClick(item)">
								<p class="name">{{ item.name }}</p>
								@if (item.address !== null) {
									<p class="address">{{ item.address }}</p>
								}
							</div>
						} @empty {
							<p>Ничего не найдено</p>
						}
					</div>
				</div>
			</div>

			<div class="map-addon" #mapAddonContainer>
				<div class="fold-mark-container">
					<svg (touchstart)="foldMarkDragHandler($event)" class="fold-mark">
						<path d="" fill="#6F6F6F" #foldMark/>
					</svg>
				</div>

				<div class="content">
					<div class="prompt-input-container">
						<div class="prompt-input-scroll" #promptInputScroll>
							<div dir="auto" tabindex="0" class="input allow-selection"
								 (keydown)="handleKeyDownPromptInput($event)"
								 (keyup)="handleCaretPositionChanges($event)"
								 (input)="handlePromptInput()"
								 (click)="handleCaretPositionChanges($event)"
								 role="textbox" contenteditable="true" #promptInput></div>
							<!-- 							<span class="message-placeholder" #promptPlaceholder>Prompt...</span> -->
						</div>
					</div>

					<CategoriesSlider/>
				</div>
			</div>

			<div class="main" #mainContainer>
				<div class="roller" #rollerElement></div>
				<a routerLinkActive="active" name="home" routerLink="home" #routerLink>
					<div class="child">
						<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clip-path="url(#clip0_2_179)">
								<path d="M17.3833 7.475L11.6083 2.85833C10.7167 2.14167 9.275 2.14167 8.39166 2.85L2.61666 7.475C1.96666 7.99167 1.55 9.08333 1.69166 9.9L2.8 16.5333C3 17.7167 4.13333 18.675 5.33333 18.675H14.6667C15.8583 18.675 17 17.7083 17.2 16.5333L18.3083 9.9C18.4417 9.08333 18.025 7.99167 17.3833 7.475ZM10 13.4167C8.85 13.4167 7.91666 12.4833 7.91666 11.3333C7.91666 10.1833 8.85 9.25 10 9.25C11.15 9.25 12.0833 10.1833 12.0833 11.3333C12.0833 12.4833 11.15 13.4167 10 13.4167Z"/>
							</g>
							<defs>
								<clipPath id="clip0_2_179">
									<rect width="20" height="20" fill="white" transform="translate(0 0.5)"/>
								</clipPath>
							</defs>
						</svg>
						<p>Home</p>
					</div>
				</a>
				<a routerLinkActive="active" name="likes" routerLink="likes" #routerLink>
					<div class="child">
						<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8.5 14.0872L2.0539 7.64115C0.648699 6.23594 0.648699 3.95765 2.0539 2.55245C3.45911 1.14724 5.7374 1.14724 7.1426 2.55245L7.79289 3.20274C8.18342 3.59326 8.81658 3.59326 9.20711 3.20274L9.8574 2.55245C11.2626 1.14724 13.5409 1.14724 14.9461 2.55245C16.3513 3.95765 16.3513 6.23594 14.9461 7.64115L8.5 14.0872Z"
								  stroke-width="2" stroke-linejoin="round"/>
						</svg>
						<p>Likes</p>
					</div>
				</a>
				<a routerLinkActive="active" name="build" routerLink="build" #routerLink>
					<div class="main-child">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z"
								  fill="white"/>
							<path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V18C12.75 18.41 12.41 18.75 12 18.75Z"
								  fill="white"/>
						</svg>
					</div>
				</a>
				<a routerLinkActive="active" name="community" routerLink="community" #routerLink>
					<div class="child">
						<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M16.3333 8.95833H14.6667C12.65 8.95833 11.5417 7.85 11.5417 5.83333V4.16667C11.5417 2.15 12.65 1.04167 14.6667 1.04167H16.3333C18.35 1.04167 19.4583 2.15 19.4583 4.16667V5.83333C19.4583 7.85 18.35 8.95833 16.3333 8.95833ZM14.6667 2.29167C13.35 2.29167 12.7917 2.85 12.7917 4.16667V5.83333C12.7917 7.15 13.35 7.70833 14.6667 7.70833H16.3333C17.65 7.70833 18.2083 7.15 18.2083 5.83333V4.16667C18.2083 2.85 17.65 2.29167 16.3333 2.29167H14.6667Z"/>
							<path d="M6.33333 18.9583H4.66666C2.65 18.9583 1.54166 17.85 1.54166 15.8333V14.1667C1.54166 12.15 2.65 11.0417 4.66666 11.0417H6.33333C8.35 11.0417 9.45833 12.15 9.45833 14.1667V15.8333C9.45833 17.85 8.35 18.9583 6.33333 18.9583ZM4.66666 12.2917C3.35 12.2917 2.79166 12.85 2.79166 14.1667V15.8333C2.79166 17.15 3.35 17.7083 4.66666 17.7083H6.33333C7.65 17.7083 8.20833 17.15 8.20833 15.8333V14.1667C8.20833 12.85 7.65 12.2917 6.33333 12.2917H4.66666Z"/>
							<path d="M5.5 8.95833C3.31666 8.95833 1.54166 7.18333 1.54166 5C1.54166 2.81667 3.31666 1.04167 5.5 1.04167C7.68333 1.04167 9.45833 2.81667 9.45833 5C9.45833 7.18333 7.68333 8.95833 5.5 8.95833ZM5.5 2.29167C4.00833 2.29167 2.79166 3.50833 2.79166 5C2.79166 6.49167 4.00833 7.70833 5.5 7.70833C6.99166 7.70833 8.20833 6.49167 8.20833 5C8.20833 3.50833 6.99166 2.29167 5.5 2.29167Z"/>
							<path d="M15.5 18.9583C13.3167 18.9583 11.5417 17.1833 11.5417 15C11.5417 12.8167 13.3167 11.0417 15.5 11.0417C17.6833 11.0417 19.4583 12.8167 19.4583 15C19.4583 17.1833 17.6833 18.9583 15.5 18.9583ZM15.5 12.2917C14.0083 12.2917 12.7917 13.5083 12.7917 15C12.7917 16.4917 14.0083 17.7083 15.5 17.7083C16.9917 17.7083 18.2083 16.4917 18.2083 15C18.2083 13.5083 16.9917 12.2917 15.5 12.2917Z"/>
						</svg>
						<p>Community</p>
					</div>
				</a>
				<a routerLinkActive="active" name="profile" routerLink="profile" #routerLink>
					<div class="child">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M10.133 9.68333C10.108 9.68333 10.0913 9.68333 10.0663 9.68333C10.0247 9.675 9.96633 9.675 9.91633 9.68333C7.49967 9.60833 5.67467 7.70833 5.67467 5.36667C5.67467 2.98333 7.61633 1.04167 9.99967 1.04167C12.383 1.04167 14.3247 2.98333 14.3247 5.36667C14.3163 7.70833 12.483 9.60833 10.158 9.68333C10.1497 9.68333 10.1413 9.68333 10.133 9.68333ZM9.99967 2.29167C8.308 2.29167 6.92467 3.675 6.92467 5.36667C6.92467 7.03333 8.22467 8.375 9.883 8.43333C9.92467 8.425 10.0413 8.425 10.1497 8.43333C11.783 8.35833 13.0663 7.01667 13.0747 5.36667C13.0747 3.675 11.6913 2.29167 9.99967 2.29167Z"/>
							<path d="M10.1413 18.7917C8.50801 18.7917 6.86634 18.375 5.62467 17.5417C4.46634 16.775 3.83301 15.725 3.83301 14.5833C3.83301 13.4417 4.46634 12.3833 5.62467 11.6083C8.12467 9.95 12.1747 9.95 14.658 11.6083C15.808 12.375 16.4497 13.425 16.4497 14.5667C16.4497 15.7083 15.8163 16.7667 14.658 17.5417C13.408 18.375 11.7747 18.7917 10.1413 18.7917ZM6.31634 12.6583C5.51634 13.1917 5.08301 13.875 5.08301 14.5917C5.08301 15.3 5.52467 15.9833 6.31634 16.5083C8.39134 17.9 11.8913 17.9 13.9663 16.5083C14.7663 15.975 15.1997 15.2917 15.1997 14.575C15.1997 13.8667 14.758 13.1833 13.9663 12.6583C11.8913 11.275 8.39134 11.275 6.31634 12.6583Z"/>
						</svg>
						<p>Profile</p>
					</div>
				</a>
			</div>
		</div>

		<button (click)="this.mapInteractionService.mapScrolled.set(-1)"
				class="stick-position-marker"
				[style.background-color]="mapInteractionService.mapScrolled() === -1 ? 'var(--blue-60)' : 'var(--neutral-1)'"
				#stickPositionButton
		>
			<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
				<path d="M19.37 15.7965C19.2479 15.7479 19.1174 15.7239 18.9859 15.7257C18.8545 15.7276 18.7247 15.7553 18.604 15.8073C18.4833 15.8593 18.374 15.9345 18.2824 16.0288C18.1908 16.123 18.1186 16.2344 18.07 16.3565C18.0214 16.4786 17.9974 16.6091 17.9992 16.7406C18.001 16.872 18.0288 17.0018 18.0808 17.1225C18.1328 17.2432 18.208 17.3525 18.3023 17.4441C18.3965 17.5358 18.5079 17.6079 18.63 17.6565C20.09 18.2365 21 19.1365 21 20.0065C21 21.4265 18.54 23.0065 15 23.0065C11.46 23.0065 9 21.4265 9 20.0065C9 19.1365 9.91 18.2365 11.37 17.6565C11.6166 17.5584 11.8142 17.3663 11.9192 17.1225C12.0243 16.8787 12.0281 16.6032 11.93 16.3565C11.8319 16.1099 11.6398 15.9123 11.396 15.8073C11.1522 15.7023 10.8767 15.6984 10.63 15.7965C8.36 16.6965 7 18.2665 7 20.0065C7 22.8065 10.51 25.0065 15 25.0065C19.49 25.0065 23 22.8065 23 20.0065C23 18.2665 21.64 16.6965 19.37 15.7965ZM14 12.8665V20.0065C14 20.2717 14.1054 20.5261 14.2929 20.7136C14.4804 20.9012 14.7348 21.0065 15 21.0065C15.2652 21.0065 15.5196 20.9012 15.7071 20.7136C15.8946 20.5261 16 20.2717 16 20.0065V12.8665C16.9427 12.6231 17.7642 12.0443 18.3106 11.2385C18.857 10.4327 19.0908 9.45533 18.9681 8.48951C18.8454 7.5237 18.3747 6.63578 17.6442 5.99219C16.9137 5.3486 15.9736 4.99353 15 4.99353C14.0264 4.99353 13.0863 5.3486 12.3558 5.99219C11.6253 6.63578 11.1546 7.5237 11.0319 8.48951C10.9092 9.45533 11.143 10.4327 11.6894 11.2385C12.2358 12.0443 13.0573 12.6231 14 12.8665ZM15 7.00651C15.3956 7.00651 15.7822 7.12381 16.1111 7.34357C16.44 7.56334 16.6964 7.87569 16.8478 8.24115C16.9991 8.6066 17.0387 9.00873 16.9616 9.39669C16.8844 9.78466 16.6939 10.141 16.4142 10.4207C16.1345 10.7004 15.7781 10.8909 15.3902 10.9681C15.0022 11.0453 14.6001 11.0057 14.2346 10.8543C13.8692 10.7029 13.5568 10.4466 13.3371 10.1177C13.1173 9.78876 13 9.40208 13 9.00651C13 8.47608 13.2107 7.96737 13.5858 7.5923C13.9609 7.21723 14.4696 7.00651 15 7.00651Z"/>
			</svg>
		</button>
	`,
})
export class BottomBarComponent implements AfterViewInit {
	@ViewChildren("routerLink") routerLikes!: QueryList<ElementRef<HTMLAnchorElement>>; // All link elements in bottom bar
	@ViewChild("rollerElement") roller!: ElementRef<HTMLDivElement>; // Roller that travels under routes

	@ViewChild("container") container!: ElementRef<HTMLDivElement>; // Main container of all elements

	@ViewChild("mainContainer") mainContainer!: ElementRef<HTMLDivElement>; // container with routing parts
	@ViewChild("mapAddonContainer") mainAddonContainer!: ElementRef<HTMLDivElement>; // container with prompt input
	@ViewChild("foldMark") foldMark!: ElementRef<SVGPathElement>; // mark for folding the container when we are on the /home route

	@ViewChild("stickPositionButton") stickPositionButton!: ElementRef<HTMLButtonElement>; // button that sticks our position to geolocation

	@ViewChild("inputAddon") inputAddonContainer!: ElementRef<HTMLDivElement>; // container with prompt input
	@ViewChild("promptInput") promptInput!: ElementRef<HTMLDivElement>; // prompt input element
	@ViewChild("promptPlaceholder") promptPlaceholder!: ElementRef<HTMLSpanElement>; // prompt input placeholder
	@ViewChild("promptInputScroll") promptInputScroll!: ElementRef<HTMLDivElement>; // prompt input scroll container

	/** Array with search values */
	searchArray = signal<Array<any>>([]);
	/** Search text for searching pipe */
	searchText: string = "";
	/** Bool param if last typed button to prompt input is valid */
	typedKey: string = '';
	/** Prompt text */
	promptText: string = "123#abacaba 4567";

	leftIndex: number[] = [];
	rightIndex: number[] = [];
	chosenElements: Array<EventPlace | Place | null> = [];

	searchBoxIndex: number = -1;

	/** Current menu size */
	menuSize: number = 228;

	constructor(
		private router: Router,
		private readonly notificationsService: NotificationsService,
		public readonly mapInteractionService: MapInteractionsService,
	) {
		// effect for mapInteractionService.mainContainerState
		effect(() => {
			if (this.mapInteractionService.mainContainerState() === -1) this.hideMainContainer();
			else if (this.mapInteractionService.mainContainerState() === 1) this.showMainContainer();
		});
		// effect for mapInteractionService.mapScrolled
		effect(() => {
			if (this.mapInteractionService.mapScrolled() !== 0)
				this.mapInteractionService.mainContainerState.set(-1 * this.mapInteractionService.mapScrolled());
		});
		// Listener for path information container opening
		this.mapInteractionService.pathInformationState.subscribe(state => {
			if (state === 1) {
				this.closeMainContainer();
			} else if (state === -2 && this.mapInteractionService.chosenMapPoint.value === null) {
				this.openMainContainer();
			}
		});
	}

	ngAfterViewInit() {
		/** setting up router listener */
		this.router.events.pipe(
			filter((event: any) => event instanceof NavigationEnd),
		).subscribe(() => this.routeChangeHandler());
	}

	closeMainContainer() {
		this.container.nativeElement.style.transitionDuration = ".3s";
		setTimeout(() => {
			this.container.nativeElement.style.transform = "translateY(100%)";
		}, 100);
		setTimeout(() => {
			this.container.nativeElement.style.display = "none";
			this.container.nativeElement.style.transitionDuration = "0s";
		}, 400);
	}

	openMainContainer() {
		this.container.nativeElement.style.transitionDuration = ".3s";
		this.container.nativeElement.style.display = "flex";
		setTimeout(() => {
			this.container.nativeElement.style.transform = "translateY(0%)";
		}, 100);
		setTimeout(() => {
			this.container.nativeElement.style.transitionDuration = "0s";
			this.stickPositionButton.nativeElement.style.top = `${ window.innerHeight - this.menuSize - 43 }px`;
		}, 400);
	}

	/** Function that listens to route change */
	routeChangeHandler() {
		this.mainContainer.nativeElement.style.maxHeight = "100vh";

		/** If we are in intro page we hide bottom bar */
		if (this.router.url === "" || this.router.url === "/")
			this.container.nativeElement.style.display = "none";
		else
			this.container.nativeElement.style.display = "flex";

		/** Moving */
		this.routerLikes.forEach(link => {
			if (link.nativeElement.name === this.router.url.split("/")[1]) {
				this.roller.nativeElement.style.left = `${ link.nativeElement.offsetLeft + ( link.nativeElement.offsetWidth - 5 ) / 2 }px`;
				if (this.roller.nativeElement.style.display === "") {
					setTimeout(() => {
						this.roller.nativeElement.style.display = "block";
					}, 300);
				}
			}
			return link;
		});

		/* Showing map addon if we are in the home page */
		if (this.router.url.split("/")[1] === "home") {
			this.mainAddonContainer.nativeElement.style.display = "flex";
			setTimeout(() => this.mainAddonContainer.nativeElement.style.maxHeight = "100vh");
			setTimeout(() => this.stickPositionButton.nativeElement.style.opacity = "1", 300);
		} else {
			this.mainAddonContainer.nativeElement.style.maxHeight = "0";
			this.stickPositionButton.nativeElement.style.opacity = "0";
			setTimeout(() => this.mainAddonContainer.nativeElement.style.display = "none", 300);
		}
	}

	/** Function that tracks `foldMark` dragging */
	foldMarkDragHandler(event: TouchEvent) {
		// setting mainContainerState to 0
		this.mapInteractionService.mainContainerState.set(0);

		// getting start positions and setting main variables
		const maxHeight = 78;
		let lastY: number = event.touches[0].clientY, currentHeight = 20;

		// handler for touch move events
		const touchMoveHandler = (e: TouchEvent) => {
			currentHeight += lastY - e.touches[0].clientY;
			currentHeight = Math.min(maxHeight, Math.max(20, currentHeight));
			lastY = e.touches[0].clientY;
			this.mainContainer.nativeElement.style.maxHeight = `${ currentHeight }px`;
			this.stickPositionButton.nativeElement.style.top = `${ window.innerHeight - this.container.nativeElement.getBoundingClientRect().height - 43 }px`;
		};
		// handler for touch end events
		const touchEndHandler = (e: TouchEvent) => {
			if (currentHeight > maxHeight * 2 / 3) this.mapInteractionService.mainContainerState.set(1);
			else this.mapInteractionService.mainContainerState.set(-1);

			// removing event handlers after their work was done
			removeEventListener("touchmove", touchMoveHandler);
			removeEventListener("touchend", touchEndHandler);
		};

		// adding event handlers
		addEventListener("touchmove", touchMoveHandler);
		addEventListener("touchend", touchEndHandler);
	}

	/** Function that hides `mainContainer` */
	hideMainContainer() {
		if (this.mainContainer === undefined) return;
		this.stickPositionButton.nativeElement.style.transition = "opacity .3s, background-color .3s, bottom .3s";
		setTimeout(() => {
			this.mainContainer.nativeElement.style.maxHeight = "20px";
			this.foldMark.nativeElement.style.d = "path('M0 6.02566C0 6.99695 0.951572 7.68281 1.87302 7.37566L15 3L28.127 7.37566C29.0484 7.68281 30 6.99695 30 6.02566C30 5.41315 29.6081 4.86935 29.027 4.67566L15 0L0.973024 4.67566C0.391943 4.86935 0 5.41315 0 6.02566Z')";
		});
		setTimeout(() => {
			this.stickPositionButton.nativeElement.style.transition = "opacity .3s, background-color .3s";
			this.updateStickPositionButton();
		}, 300);
	}

	/** Function that shows `mainContainer` */
	showMainContainer() {
		if (this.mainContainer === undefined) return;
		this.stickPositionButton.nativeElement.style.transition = "opacity .3s, background-color .3s, bottom .3s";
		setTimeout(() => {
			this.foldMark.nativeElement.style.d = "path('M0 1.5C0 0.671573 0.671573 0 1.5 0H28.5C29.3284 0 30 0.671573 30 1.5V1.5C30 2.32843 29.3284 3 28.5 3H1.5C0.671573 3 0 2.32843 0 1.5V1.5Z')";
			this.mainContainer.nativeElement.style.maxHeight = "100vh";
		});
		setTimeout(() => {
			this.stickPositionButton.nativeElement.style.transition = "opacity .3s, background-color .3s";
			this.updateStickPositionButton();
		}, 300);
	}

	/** Function that updates position of the stick position button during to new menuSize */
	updateStickPositionButton() {
		this.menuSize = this.container.nativeElement.getBoundingClientRect().height!;
		this.stickPositionButton.nativeElement.style.top = `${ window.innerHeight - this.menuSize - 43 }px`;
	}

	/** Function that shows the search box */
	showSearchBox() {
		this.inputAddonContainer.nativeElement.style.display = "flex";
		setTimeout(() => this.inputAddonContainer.nativeElement.style.maxHeight = "200px");
	}

	/** Function that hides the search box */
	hideSearchBox() {
		this.inputAddonContainer.nativeElement.style.maxHeight = "0px";
		setTimeout(() => this.inputAddonContainer.nativeElement.style.display = "none", 300);
	}

	/** Function that shows the prompt placeholder */
	showPromptPlaceholder() {
		this.promptPlaceholder.nativeElement.style.opacity = "1";
		this.promptPlaceholder.nativeElement.style.transform = "translateX(0)";
	}

	/** Function that hides the prompt placeholder */
	hidePromptPlaceholder() {
		this.promptPlaceholder.nativeElement.style.opacity = "0";
		this.promptPlaceholder.nativeElement.style.transform = "translateX(50px)";
	}

	/** Handler for prompt search box click event */
	handlePromptSearchBoxClick(target: Place | EventPlace) {
		const editor = this.promptInput.nativeElement;
		let editorText = editor.innerText;
		let index = this.searchBoxIndex;
		let newCaretPosition = 0;

		this.chosenElements[index] = target;
		const length = target.name?.length!;
		this.rightIndex[index] = this.leftIndex[index] + length;
		newCaretPosition = this.rightIndex[index] + 2;

		const currentValue = editorText;
		editorText = currentValue.slice(0, this.leftIndex[index] + 1);
		editorText += target.name;
		if (currentValue.slice(this.rightIndex[index] + 1).length === 0 || currentValue.slice(this.rightIndex[index] + 1)[0] !== ' ')
			editorText += ' ';
		editorText += currentValue.slice(this.rightIndex[index] + 1)

		console.log(editorText);
		console.log(this.leftIndex);
		console.log(this.rightIndex);

		// highlighting the segments in the line with spans
		const highlightedString = this.highlightEditorText(editorText);

		this.promptText = editorText;
		editor.innerHTML = highlightedString;
		placeCaretAt(editor, newCaretPosition);
	}

	/** Handler for prompt input key button down event */
	handleKeyDownPromptInput(event: any) {
		this.typedKey = event.key;
	}

	handleCaretPositionChanges(event: any) {
		if (event.key === undefined || ( event.key.slice(0, 5) === 'Arrow' )) {
			const editor = this.promptInput.nativeElement;
			const editorText = editor.innerText;
			const caretPosition = getCaretPosition(editor);
			let index = -1;
			for (let i = 0; i < this.leftIndex.length; i++)
				if (this.leftIndex[i] + 1 <= caretPosition && caretPosition <= this.rightIndex[i] + 1)
					index = i;

			if (index !== -1 && this.chosenElements[index]===null) {
				if (editorText.charAt(this.leftIndex[index]) === '#')
					this.searchArray = this.mapInteractionService.places;
				else
					this.searchArray = this.mapInteractionService.places; // change to event places
				this.searchText = editorText.slice(this.leftIndex[index] + 1, this.rightIndex[index] + 1);
				this.searchBoxIndex = index;
				this.showSearchBox();
			} else
				this.hideSearchBox();
		}
	}

	/** Handler for prompt input event */
	handlePromptInput() {
		const editor = this.promptInput.nativeElement;
		const caretPosition = getCaretPosition(editor);
		let newCaretPosition = caretPosition;
		let editorText = editor.innerText;

		if (this.typedKey === 'Backspace' || this.typedKey === 'Delete') {
			// we are looking for a segment that will be affected by the current change
			let index = -1;
			for (let i = 0; i < this.leftIndex.length; i++)
				if (this.leftIndex[i] + (this.typedKey === 'Backspace' ? 1 : 0) <= caretPosition && caretPosition <= this.rightIndex[i])
					index = i;

			// removing this segment
			if (index !== -1) {
				const currentValue = editorText;
				editorText = currentValue.slice(0,this.leftIndex[index]);
				editorText += currentValue.slice(this.rightIndex[index]);
				this.hideSearchBox();
				newCaretPosition = this.leftIndex[index];
				this.leftIndex.splice(index, 1);
				this.rightIndex.splice(index, 1);
				this.chosenElements.splice(index, 1);
			}
		}
		else if (this.typedKey === 'Enter') {
			// TODO make calls to API with this prompt
			editorText = this.promptText;
		}
		else if (this.typedKey === "#" || this.typedKey === "@") {
			this.leftIndex.push(caretPosition - 1);
			this.rightIndex.push(caretPosition - 1);
			this.chosenElements.push(null);

			if (editorText.charAt(caretPosition - 1) === '#')
				this.searchArray = this.mapInteractionService.places;
			else
				this.searchArray = this.mapInteractionService.places; // change to event places
			this.searchText = '';
			this.searchBoxIndex = this.leftIndex.length - 1;
			this.showSearchBox();
		}
		else {
			// we are looking for a segment that will be affected by the current change
			let index = -1;
			for (let i = 0; i < this.leftIndex.length; i++)
				if (this.leftIndex[i] < caretPosition && caretPosition <= this.rightIndex[i] + 2)
					index = i;

			// updating this segment
			if (index !== -1) {
				this.rightIndex[index]++;
				this.searchText = editorText.slice(this.leftIndex[index], this.rightIndex[index] + 1);
			}
		}

		// updating position of left and right indexes
		let lastIndex = 0;
		for (let index = 0; index < editorText.length; index++) {
			if (editorText.charAt(index) === '#' || editorText.charAt(index) === '@') {
				const delta = index - this.leftIndex[lastIndex];
				this.leftIndex[lastIndex] += delta;
				this.rightIndex[lastIndex] += delta;
				lastIndex++;
			}
		}

		// highlighting the segments in the line with spans
		const highlightedString = this.highlightEditorText(editorText);

		this.promptText = editorText;
		editor.innerHTML = highlightedString;
		placeCaretAt(editor, newCaretPosition);
	}

	highlightEditorText(editorText: string) {
		let highlightedString: string = '';
		let lastIndex = 0;
		// highlighting segments
		for (let index = 0; index < this.leftIndex.length; index++) {
			// adding normal string segment
			highlightedString += editorText.slice(lastIndex, this.leftIndex[index]);

			// adding highlighted string
			const styles = 'border-radius: var(--br-100); background: rgba(67, 70, 218, 0.3); color: var(--text-primary); padding: 0 10px;'
			highlightedString += `<span style="${styles}">${editorText.slice(this.leftIndex[index], this.rightIndex[index] + 1)}</span>`;

			// updating last placed index
			lastIndex = this.rightIndex[index] + 1;
		}
		highlightedString += editorText.slice(lastIndex);
		// returns highlighted result
		return highlightedString;
	}
}
