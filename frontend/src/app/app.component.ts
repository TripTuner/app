import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { BottomBarComponent } from "./core/components/bottom-bar/bottom-bar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        BottomBarComponent,
        RouterOutlet
    ],
    styles: `
        .container {
            width: 100vw;
            min-height: 100vh;
            position: relative;
        }
    `,
    template: `
        <div class="container">
            <router-outlet/>
            <BottomBar/>
        </div>
    `
})
export class AppComponent {
    title = 'TripTuner';
}
