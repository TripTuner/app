import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { MapInteractionsService } from "../../../../core/services/map-interactions.service";

@Component({
    selector: 'community-main',
    standalone: true,
    imports: [],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export default class MainComponent {

	ignoreScroll = false;

	@ViewChildren('stickScrollContainer') stickScrollContainers!: QueryList<ElementRef<HTMLDivElement>>;

    constructor(
        private mapInteractionsService: MapInteractionsService
    ) {}

    getUserLocation() {
        if (this.mapInteractionsService.userLocation() === null) return 'Москва, Россия'
        return `${this.mapInteractionsService.userLocation()?.city}, ${this.mapInteractionsService.userLocation()?.countryName}`
    }

	openNotification(notification: string) {

	}

	stickScroll(containerIndex: number) {
		const container = this.stickScrollContainers.get(containerIndex)!.nativeElement!;
		const children = container.children.item(0)!.children;
		const scrollX = container.scrollLeft;
		const containerWidth = container.getBoundingClientRect().width;

		if (!this.ignoreScroll) {
			let left = 0;
			if (scrollX >= container.scrollWidth - container.offsetWidth - 30) {
				left = container.scrollWidth - container.offsetWidth;
			} else {
				for (let i = 0; i < children.length; i++) {
					const child = children.item(i)!;
					const childX = child.getBoundingClientRect().left;
					const childWidth = child.getBoundingClientRect().width;

					//@ts-ignore
					if (scrollX < child.offsetLeft + 30) {
						if (i == 0) left = 0;
						else {
							//@ts-ignore
							left = child.offsetLeft - 40 - ( window.innerWidth / 2 - 40 ) + ( child.offsetWidth / 2 )
						}
						break;
					}
				}
			}

			if (scrollX !== left) this.ignoreScroll = true;
			container.scrollTo({
				left: left,
				behavior: 'smooth',
			});
		} else
			this.ignoreScroll = false;

		return 1;
	}
}
