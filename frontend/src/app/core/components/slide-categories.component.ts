import { Component, Input } from '@angular/core';
import CategoryModel from "../models/category.model";
import { MapInteractionsService } from "../services/map-interactions.service";

@Component({
    selector: 'CategoriesSlider',
    standalone: true,
    imports: [],
    styles: `
        .container {
            width:      100%;
            overflow-x: scroll;
        }

        .content {
            display:        flex;
            flex-direction: row;
            align-items:    center;
            gap:            20px;
        }

        .card {
            width:          max-content;
            padding:        5px 10px;
            display:        flex;
            flex-direction: row;
            gap:            5px;
            align-items:    center;
            border-radius:  var(--br-100);
            border:         1px solid var(--text-primary);
            color:          var(--text-primary);
            filter:         brightness(.7);
            transition-duration: .3s;
        }
        
        .active {
            filter: brightness(1);
            background: var(--blue-60);
            border-color: var(--blue-60);
        }
    `,
    template: `
        <div class="container">
            <div class="content"
                 [style.width]="flexWrap ? '100%' : 'fit-content'"
                 [style.flex-wrap]="flexWrap ? 'wrap':'nowrap'"
            >
                @for (category of mapInteractions.categories; track null) {
                    <div (click)="categoryClickHandler(category)"
                         [class.active]="mapInteractions.checkCategoryChosen(category)"
                         class="card"
                    >
                        <img [src]="'categories/'+category.src+'.svg'" alt="">
                        <p>{{ category.name }}</p>
                    </div>
                }
            </div>
        </div>
    `
})
export class SlideCategoriesComponent {
    /** @param {boolean} flexWrap is parma that is responsible for content to be flex wrapped <br> - `true` - we wrap the content <br> - `false` - content is inline*/
    @Input({ alias: 'flexWrap' }) flexWrap: boolean = false;
    
    constructor(
        public mapInteractions: MapInteractionsService
    ) {}
    
    /** @function
     * @description function that changes chosenCategory in `map-integration service`*/
    categoryClickHandler(newCategory: CategoryModel) {
        let currentValue = this.mapInteractions.chosenCategories();
        if (this.mapInteractions.checkCategoryChosen(newCategory))
            currentValue.splice(currentValue.indexOf(newCategory), 1);
        else
            currentValue.push(newCategory);
        this.mapInteractions.chosenCategories.set(currentValue);
    }
}
