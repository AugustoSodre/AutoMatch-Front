import { Component } from '@angular/core';
import { AuthService } from '../../systems-services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public isOpen = false;

  constructor(public readonly auth: AuthService) {}

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  public closeMenu(): void {
    this.isOpen = false;
  }

  public logout(): void {
    this.auth.logout();
    this.closeMenu();
  }
}
