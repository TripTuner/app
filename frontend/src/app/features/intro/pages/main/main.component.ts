import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'intro-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export default class MainComponent {
  constructor(
      private router: Router
  ) {}
  
  clickHandler() {
    // TODO make route to login page
    this.router.navigate(['/home']).then();
  }
}
