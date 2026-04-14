import {Component, signal} from '@angular/core';
import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';
import {OrganizationLogoComponent} from '../../settings/organization-logo/organization-logo.component';

@Component({
  selector: 'app-settings-page',
  imports: [
    TabsComponent,
    OrganizationLogoComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  standalone: true
})
export class SettingsPageComponent {
  tabs: ITab[] = [
    { id: 'logo', title: 'Логотип' },
  ];
  activeTab = signal(this.tabs[0].id);

}
