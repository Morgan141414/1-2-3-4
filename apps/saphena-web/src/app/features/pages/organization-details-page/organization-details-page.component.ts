import {Component, inject, input, signal} from '@angular/core';

import {PanelService} from '../../../core/services/panel.service'
import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';
import {OrganizationAdminsComponent} from '../../organizations/organization-admins/organization-admins.component';
import {OrganizationInfoComponent} from '../../organizations/organization-info/organization-info.component';
import {
  OrganizationAccountantsComponent
} from '../../organizations/organization-accountants/organization-accountants.component';
import {OrganizationCeoComponent} from '../../organizations/organization-ceo/organization-ceo.component';

@Component({
  selector: 'app-organization-details-page',
  imports: [
    OrganizationAdminsComponent,
    OrganizationInfoComponent,
    TabsComponent,
    OrganizationAccountantsComponent,
    OrganizationCeoComponent,
  ],
  templateUrl: './organization-details-page.component.html',
  styleUrl: './organization-details-page.component.scss',
  standalone: true
})
export class OrganizationDetailsPageComponent {
  private readonly panelService = inject(PanelService);
  id = input.required<string>();

  tabs: ITab[] = [
    { id: 'info', title: 'Информация' },
    { id: 'ceo', title: 'CEO' },
    { id: 'admins', title: 'Администраторы' },
    { id: 'accountants', title: 'Бухгалтеры' },
  ];
  activeTab = signal(this.tabs[0].id);

  onTabChanged(tabId: string) {
    this.activeTab.set(tabId);
    this.panelService.closePanel();
  }

}
