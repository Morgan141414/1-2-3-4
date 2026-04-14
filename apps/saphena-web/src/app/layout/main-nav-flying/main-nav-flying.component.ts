import {Component, computed, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {PanelService} from '../../core/services/panel.service';

@Component({
  selector: 'app-main-nav-flying',
  imports: [
    RouterOutlet
  ],
  templateUrl: './main-nav-flying.component.html',
  styleUrl: './main-nav-flying.component.scss',
  standalone: true
})
export class MainNavFlyingComponent {
  private readonly panelService = inject(PanelService);

  pageTitle = computed(() =>
    this.panelService.panelRoute()?.routeConfig?.title?.toString()
  );

  closePanel() {
    this.panelService.closePanel();
  }
}
