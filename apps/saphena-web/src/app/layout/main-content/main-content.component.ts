import {Component, inject} from '@angular/core';
import { RouterOutlet} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {HeaderComponent} from '../header/header.component';
import {NavComponent} from '../nav/nav.component';
import {MainNavFlyingComponent} from '../main-nav-flying/main-nav-flying.component';
import {AuthService} from '../../core/services/auth.service';
import {PanelService} from '../../core/services/panel.service';

@Component({
  selector: 'app-main-content',
  imports: [
    HeaderComponent,
    NavComponent,
    RouterOutlet,
    MainNavFlyingComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  standalone: true,
  animations: [
    trigger('contentResize', [
      state('panelClosed', style({ width: '100%' })),
      state('panelOpened', style({ width: '66%' })),
      transition('panelClosed <=> panelOpened', animate('300ms ease')),
    ]),
    trigger('slideInOut', [
      state('opened', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(110%)' })),
      transition('opened <=> closed', animate('300ms ease')),
    ]),
  ]
})
export class MainContentComponent {
  private readonly authService = inject(AuthService);
  private readonly panelService = inject(PanelService);

  panel = this.panelService.panelRoute;
  isAuthenticated = this.authService.isAuthenticated;

}
