import { Component } from '@angular/core';

import { navItems } from './_nav';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  public navItems: any[]= [];

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    private authService: AuthService
  ) {
    this.authService.menu.subscribe(resp => {
      this.navItems = resp;
    })
  }

}
