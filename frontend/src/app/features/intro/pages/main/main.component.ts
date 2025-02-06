import { Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "intro-main",
	standalone: true,
	imports: [],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export default class MainComponent {
	@ViewChildren("card") cards!: QueryList<ElementRef<HTMLDivElement>>;

	constructor(
		private router: Router,
	) {}

	next(index: number) {
		if (index === this.cards.length - 1)
			this.Login();
		else {
			const prev = this.cards.get(index)!.nativeElement;
			const next = this.cards.get(index + 1)!.nativeElement;

			prev.style.left = '-100vw';
			next.style.left = '0vw';
		}
	}

	prev(index: number) {

	}

	Login() {
		// TODO make route to login page
		this.router.navigate(["/home"]).then();
	}
}
