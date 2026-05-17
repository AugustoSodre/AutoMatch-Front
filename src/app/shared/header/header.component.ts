import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public isOpen = false;

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  public closeMenu(): void {
    this.isOpen = false;
  }
}
