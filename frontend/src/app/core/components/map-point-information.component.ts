import { Component, computed, effect, ElementRef, Signal, ViewChild } from "@angular/core";
import MapPointModel from "../models/map-point.model";
import { MapInteractionsService } from "../services/map-interactions.service";

@Component({
	selector: "MapPointInformation",
	standalone: true,
	imports: [],
	styleUrls: ["../styles/open-menu.style.css"],
	template: `
		<div (touchstart)="foldMarkDragHandler($event)" class="container" #container>
			<div class="fold-mark-container">
				<svg class="fold-mark">
					<path d="" fill="#6F6F6F" #foldMark/>
				</svg>
			</div>

			<div class="flex flex-col" style="gap: 0px;">
				<p class="name">{{ point()?.name }}</p>

				<div class="slide-categories">
					<div class="content">
						@for (category of point()?.categories; track point) {
							<div class="card">
								<div [innerHTML]="category.svg"></div>
								<p>{{ category.name }}</p>
							</div>
						}
					</div>
				</div>
			</div>

			<div class="info">
				<div class="text-container">
					<p class="title">Коротко о месте</p>
					<p class="text">{{ point()?.description }}</p>
				</div>
				<div class="images-container">
					<div class="image">
						<img src="TEST/bg1.png">
						<svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd"
								  d="M2.286 0.222423C2.05875 0.0826142 1.79833 0.00594912 1.53158 0.000332479C1.26483 -0.00528417 1.0014 0.0603507 0.768473 0.19047C0.535543 0.320589 0.341534 0.510483 0.206452 0.74057C0.0713696 0.970658 0.000102691 1.23261 0 1.49942V16.1314C0.000102691 16.3982 0.0713696 16.6602 0.206452 16.8903C0.341534 17.1204 0.535543 17.3103 0.768473 17.4404C1.0014 17.5705 1.26483 17.6361 1.53158 17.6305C1.79833 17.6249 2.05875 17.5482 2.286 17.4084L14.174 10.0924C14.3922 9.95817 14.5723 9.77027 14.6973 9.54664C14.8223 9.32301 14.8879 9.0711 14.8879 8.81492C14.8879 8.55875 14.8223 8.30684 14.6973 8.08321C14.5723 7.85958 14.3922 7.67168 14.174 7.53742L2.286 0.222423Z"
								  fill="white"/>
						</svg>
					</div>

					<div class="image back-image">
						<img src="TEST/bg1.png">
						<svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd"
								  d="M2.286 0.222423C2.05875 0.0826142 1.79833 0.00594912 1.53158 0.000332479C1.26483 -0.00528417 1.0014 0.0603507 0.768473 0.19047C0.535543 0.320589 0.341534 0.510483 0.206452 0.74057C0.0713696 0.970658 0.000102691 1.23261 0 1.49942V16.1314C0.000102691 16.3982 0.0713696 16.6602 0.206452 16.8903C0.341534 17.1204 0.535543 17.3103 0.768473 17.4404C1.0014 17.5705 1.26483 17.6361 1.53158 17.6305C1.79833 17.6249 2.05875 17.5482 2.286 17.4084L14.174 10.0924C14.3922 9.95817 14.5723 9.77027 14.6973 9.54664C14.8223 9.32301 14.8879 9.0711 14.8879 8.81492C14.8879 8.55875 14.8223 8.30684 14.6973 8.08321C14.5723 7.85958 14.3922 7.67168 14.174 7.53742L2.286 0.222423Z"
								  fill="white"/>
						</svg>
					</div>
				</div>
			</div>

			<div class="buttons">
				<button (click)="AddPointToPath()" class="add-btn">
					<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
						<path d="M1 6L6 6M6 6L11 6M6 6V1M6 6L6 11" stroke-width="2" stroke-linecap="round"
							  stroke-linejoin="round"/>
					</svg>
					<p>добавить</p>
				</button>
				<button class="btn">
					<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 14.5285L2.13313 7.6616C0.622291 6.15076 0.622291 3.70122 2.13313 2.19038C3.64396 0.679542 6.09351 0.679542 7.60435 2.19038L8.29289 2.87892C8.48043 3.06646 8.73479 3.17181 9 3.17181C9.26522 3.17181 9.51957 3.06646 9.70711 2.87892L10.3956 2.19038C11.9065 0.679542 14.356 0.679542 15.8669 2.19038C17.3777 3.70122 17.3777 6.15076 15.8669 7.6616L9 14.5285Z"
							  stroke="#0F62FE" stroke-width="2" stroke-linejoin="round"/>
					</svg>
				</button>
				<button class="btn">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6.14286 3H3C1.89543 3 1 3.89543 1 5V13C1 14.1046 1.89543 15 3 15H11C12.1046 15 13 14.1046 13 13V9.21429M15 1H11M15 1V5M15 1L5 11"
							  stroke="#0F62FE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>
	`,
})
export class MapPointInformationComponent {
	/** Point that information if shown */
	point: Signal<MapPointModel | null> = computed<MapPointModel | null>(() => this.mapInteractionsService.chosenMapPoint());

	/** Container */
	@ViewChild("container") container!: ElementRef<HTMLDivElement>;

	/** maxHeight of the container */
	private maxContentHeight: number = 0;

	constructor(
		private mapInteractionsService: MapInteractionsService,
	) {
		/** Adding listener for point changes */
		effect(() => {
			if (this.point() === null) {
				this.Hide();
			} else {
				this.Show();
				setTimeout(() => this.maxContentHeight = this.container.nativeElement.getBoundingClientRect().height, 300);
			}
		});
	}

	/** Function that handler folder Math move events */
	foldMarkDragHandler(event: TouchEvent) {
		// getting start positions and setting main variables
		let lastY: number = event.touches[0].clientY,
			currentHeight = this.container.nativeElement.getBoundingClientRect().height;

		// handler for touch move events
		const touchMoveHandler = (e: TouchEvent) => {
			currentHeight += lastY - e.touches[0].clientY;
			currentHeight = Math.min(this.maxContentHeight, Math.max(20, currentHeight));
			lastY = e.touches[0].clientY;
			this.container.nativeElement.style.maxHeight = `${ currentHeight }px`;
		};
		// handler for touch end events
		const touchEndHandler = (e: TouchEvent) => {
			if (currentHeight > this.maxContentHeight * 2 / 3) this.Show();
			else this.mapInteractionsService.chosenMapPoint.set(null);

			// removing event handlers after their work was done
			removeEventListener("touchmove", touchMoveHandler);
			removeEventListener("touchend", touchEndHandler);
		};

		// adding event handlers
		addEventListener("touchmove", touchMoveHandler);
		addEventListener("touchend", touchEndHandler);
	}

	/** Adds this.point to current path */
	async AddPointToPath() {
		let path = this.mapInteractionsService.pathPoints.value;
		if (path === null) path = [];
		path.push(this.point()!);
		this.mapInteractionsService.setNewPath(path);
		this.Hide();
	}

	/** Shows content of the MapPointInformation */
	private Show() {
		let timeOut = 0;
		if (this.mapInteractionsService.pathInformationState.value == 2) {
			timeOut = 300;
			this.mapInteractionsService.pathInformationState.next(-1);
		}
		setTimeout(() => {
			this.container.nativeElement.style.display = "flex";
			setTimeout(() => {
				this.container.nativeElement.style.maxHeight = "50vh";
			});
		}, timeOut);
	}

	/** Hides MapPointInformation content */
	private Hide() {
		if (this.container === undefined) return;
		this.container.nativeElement.style.maxHeight = "0vh";
		setTimeout(() => {
			this.container.nativeElement.style.display = "none";

			if (this.mapInteractionsService.pathPoints !== null)
				this.mapInteractionsService.pathInformationState.next(1);
		}, 300);
	}
}
