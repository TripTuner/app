import { AfterViewInit, Component } from '@angular/core';
import { MapInteractionsService } from "../../../../core/services/map-interactions.service";

@Component({
    selector: 'community-main',
    standalone: true,
    imports: [],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export default class MainComponent {
    
    constructor(
        private mapInteractionsService: MapInteractionsService
    ) {}
    
    getUserLocation() {
        if (this.mapInteractionsService.userLocation() === null) return 'Москва, Россия'
        return `${this.mapInteractionsService.userLocation()?.city}, ${this.mapInteractionsService.userLocation()?.countryName}`
    }
}
