import { AfterViewInit, Component, effect, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MapInteractionsService } from "../../../../core/services/map-interactions.service";
import { MapPointInformationComponent } from "../../../../core/components/map-point-information.component";
import { MapClickEventModel } from "../../../../core/models/map-click-event.model";

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
    /** @param { YMapEntity } map Yandex Map user location marker */
    userMarker: any = null;
    /** @param { ElementRef<HTMLDivElement> } map Yandex map HTML DOOM container */
    @ViewChild('yamaps') mapElement!: ElementRef<HTMLDivElement>;
    
    private readonly DEFAULT_LOCATION_SETTINGS = {
        duration: 500,
        easing: 'ease-in-out'
    };
    
    constructor(
        private mapInteractionService: MapInteractionsService
    ) {
        effect(() => {
            if (this.mapInteractionService.mapScrolled() === -1 && this.map !== null)
                this.stickPosition();
        });
        effect(() => {
            if (this.mapInteractionService.userPosition())
                this.geolocationChange();
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
     * @function
     * @description Function that creates Yandex map
     */
    private async initMap(): Promise<void> {
        await ymaps3.ready;
        const { YMap, YMapDefaultSchemeLayer, YMapListener, YMapDefaultFeaturesLayer } = ymaps3;
        
        let center: number[] = [this.mapInteractionService.userPosition()?.longitude!, this.mapInteractionService.userPosition()?.latitude!];
        
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
        
        if (this.mapInteractionService.userPosition()!==null)
            this.geolocationChange();
    }
    
    /**
     * @function
     * @description Handler for map move event begin
     */
    private handleMapMoveStart() {
        this.mapInteractionService.mapScrolled.set(1);
        setTimeout(() => this.mapInteractionService.mapScrolled.set(0), 100);
    }
    
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
     * @function
     * @description Function that makes changes due to geolocation change to pos
     */
    private geolocationChange() {
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
            
            if (this.userMarker === null) {
                const markerElement = document.createElement('div');
                markerElement.className = 'marker-class';
                markerElement.innerText = 'Я';
                
                this.userMarker = new YMapMarker({
                    coordinates: result.coords,
                }, markerElement);
                this.map.addChild(this.userMarker);
            } else
                this.userMarker.update({ coordinates: result.coords })
        });
    }
    
    /** @function
     * @description function that centers map according to `lastPosition` */
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
}
