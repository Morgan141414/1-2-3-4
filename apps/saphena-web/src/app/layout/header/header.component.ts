import {Component, computed, inject, OnInit, signal} from '@angular/core';

import {AuthService} from '../../core/services/auth.service';
import {PanelService} from '../../core/services/panel.service';
import {getRoleName} from '../../shared/utils/name.util';
import {OrganizationService} from '../../core/services/organization.service';
import {Organization} from '../../core/model/organization.model';
import {FormsModule} from '@angular/forms';
import {AppointmentService} from '../../core/services/appointment.service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly panelService = inject(PanelService);
  private readonly organizationService = inject(OrganizationService);
  private readonly appointmentService = inject(AppointmentService);

  pageTitle = computed(() =>
    this.panelService.primaryRoute()?.routeConfig?.title?.toString()
  );
  username = computed(() =>
    this.authService.getUsername()
  );
  role = computed(() =>
    getRoleName(this.authService.getRole())
  );
  organizations = signal<Organization[]>([]);
  activeOrgId = signal(this.authService.getActiveOrganizationId());

  ngOnInit() {
    const orgIds = this.authService.getOrganizationIds();
    if (orgIds && orgIds.length > 0) {
      this.organizationService.getOrganizationsByIds(orgIds)
        .subscribe(resp => this.organizations.set(resp));
    }
  }

  changeActiveOrganization() {
    this.authService.changeActiveOrganizationId(this.activeOrgId());
    this.appointmentService.getAppointments()
      .pipe(
        finalize(() => this.router.navigate(['']))
      )
      .subscribe();
  }
}
