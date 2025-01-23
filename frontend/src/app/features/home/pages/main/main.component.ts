import { AfterViewInit, Component, effect, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { MapPointInformationComponent } from "../../../../core/components/map-point-information.component";
import { MapClickEntityModel } from "../../../../core/models/map-click-entity.model";
import { MapClickEventModel } from "../../../../core/models/map-click-event.model";
import { MapInteractionsService } from "../../../../core/services/map-interactions.service";

declare var ymaps3: any;

@Component({
    selector: 'home-main',
    standalone: true,
    imports: [
        MapPointInformationComponent
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export default class MainComponent implements AfterViewInit, OnDestroy {
    /** @param { YMap } map Yandex map container */
    map: any = null;
	/** @param { YMapMarker } userMarker user marker that is displayed on the map */
    userMarker: any = null;
	/** @param { YMapMarker } displayedPromptPoint point that was chosen during prompt typing */
	displayedPromptPoint: any = null;
    /** @param { ElementRef<HTMLDivElement> } map Yandex map HTML DOOM container */
    @ViewChild('yamaps') mapElement!: ElementRef<HTMLDivElement>;

    private readonly DEFAULT_LOCATION_SETTINGS = {
        duration: 500,
        easing: 'ease-in-out'
    };

    constructor(
        private mapInteractionService: MapInteractionsService
    ) {
		/** Adding Listener for MapScrolling changes */
        effect(() => {
            if (this.mapInteractionService.mapScrolled() === -1 && this.map !== null)
                this.stickPosition();
        });
		/** Adding Listener for user geolocation changes */
        effect(() => {
			if (this.mapInteractionService.userPosition() && this.map !== null)
                this.geolocationChange();
        });
		/** Adding Listener for prompt input point chosen state */
		effect(() => {
			console.log("selectedPointOnPromptInput changes: ", this.mapInteractionService.selectedPointOnPromptInput());
			if (this.map !== null)
				this.displaySelectedPromptInputPoint(this.mapInteractionService.selectedPointOnPromptInput());
		});
    }

    ngAfterViewInit() {
        /** when ymaps ready we create the map */
        this.initMap().then();
    }

    ngOnDestroy() {
        this.map.destroy();
    }

	/**
	 * Function that centers map according to `lastPosition`
	 */
    public stickPosition() {
        if (this.mapInteractionService.userPosition() === null) return;
        const location: number[] = [this.mapInteractionService.userPosition()?.longitude!, this.mapInteractionService.userPosition()?.latitude!];
        this.map.update({
            location: {
                center: location,
                zoom: 16,
                ...this.DEFAULT_LOCATION_SETTINGS
            }
        });
    }

    /**
	 * Function that creates Yandex map
     */
    private async initMap(): Promise<void> {
        await ymaps3.ready;
        const { YMap, YMapDefaultSchemeLayer, YMapListener, YMapDefaultFeaturesLayer } = ymaps3;

		let center: number[] = [this.mapInteractionService.userPosition()?.latitude!, this.mapInteractionService.userPosition()?.longitude!];

        this.map = new YMap(this.mapElement.nativeElement, {
            location: {
                center: center,
                zoom: 10,
            }
        });

        this.map.addChild(new YMapDefaultSchemeLayer());
        this.map.addChild(new YMapDefaultFeaturesLayer());
        this.map.addChild(new YMapListener({
            onTouchStart: () => this.handleMapMoveStart(),
            onMouseDown: () => this.handleMapMoveStart(),
            onTouchMove: () => this.handleMapMoveStart(),
            onMouseMove: () => this.handleMapMoveStart(),
            onClick: (e: MapClickEventModel | undefined) => this.handleMapClick(e),
        }));

		if (this.mapInteractionService.userPosition() !== null)
            this.geolocationChange();
    }

	/**
	 * Handler for map move event begin
     */
    private handleMapMoveStart() {
        this.mapInteractionService.mapScrolled.set(1);
        setTimeout(() => this.mapInteractionService.mapScrolled.set(0), 100);
    }

	private displaySelectedPromptInputPoint(point: MapClickEntityModel | null) {
		if (point === null) {
			this.displayedPromptPoint = null;
		} else {
			const { YMapMarker } = ymaps3;
			const coords = point.geometry.coordinates;
			this.map.update({
				location: {
					center: coords,
					zoom: 16,
					...this.DEFAULT_LOCATION_SETTINGS,
				},
			});

			if (this.displayedPromptPoint === null) {
				const markerElement = document.createElement("div");
				markerElement.className = "selected-prompt-place-map-marker";
				markerElement.innerText = "1";

				this.displayedPromptPoint = new YMapMarker({
					coordinates: coords,
				}, markerElement);
				this.map.addChild(this.displayedPromptPoint);
			} else {
				this.displayedPromptPoint.update({ coordinates: coords });
			}
		}
	}

	/**
	 * Handler for map click event
	 */
    private handleMapClick(e: MapClickEventModel | undefined) {
        console.log(e);
        if (e && e.entity.properties.name)
            this.mapInteractionService.chosenMapPoint.set({
                name: e.entity.properties.name!,
                description: 'Большой театр — это выдающееся культурное учреждение, олицетворяющее величие русской классической музыки и танца. Здесь проходят великолепные спектакли, которые захватывают дух и оставляют незабываемые эмоции.',
                categories: [this.mapInteractionService.categories[8], this.mapInteractionService.categories[9], this.mapInteractionService.categories[7], this.mapInteractionService.categories[7]],
                isLiked: false,
            });
    }

	/**
	 * Function that makes changes to map and userMarker after the user geolocation changes
     */
    private geolocationChange() {
		const updateUserMarker = (coords: number[]) => {
			if (this.userMarker === null) {
				const markerElement = document.createElement("div");
				const insideMarkerElement = document.createElement("div");
				insideMarkerElement.className = "inner-circle";
				insideMarkerElement.innerText = "Я";
				markerElement.className = "user-map-marker";
				markerElement.appendChild(insideMarkerElement);

				this.userMarker = new YMapMarker({
					coordinates: coords,
				}, markerElement);
				this.map.addChild(this.userMarker);
			} else
				this.userMarker.update({ coordinates: coords });
		};

        const { geolocation, YMapMarker } = ymaps3;
        // Changing map geolocation according to new positions
        geolocation.getPosition().then((result: any) => {
            if (this.mapInteractionService.mapScrolled() === -1)
                this.map.update({
                    location: {
                        center: result.coords,
                        zoom: 16,
                        ...this.DEFAULT_LOCATION_SETTINGS
                    }
                });
			console.log("geolocation change", result.coords);
			updateUserMarker(result.coords);
        });
    }
}
