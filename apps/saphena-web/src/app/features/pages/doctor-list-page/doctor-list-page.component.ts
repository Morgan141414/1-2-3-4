import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {DoctorService} from '../../../core/services/doctor.service';
import {AuthService} from '../../../core/services/auth.service';
import {UserRoleType} from '../../../core/model/user.model';
import {DoctorTableComponent} from '../../doctors/doctor-table/doctor-table.component';
import {PaginationComponent} from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-doctor-list-page',
  imports: [
    DoctorTableComponent,
    PaginationComponent
  ],
  templateUrl: './doctor-list-page.component.html',
  styleUrl: './doctor-list-page.component.scss',
  standalone: true
})
export class DoctorListPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly doctorService = inject(DoctorService);
  private readonly authService = inject(AuthService);
  private readonly role = this.authService.getRole();

  doctorsPage = this.doctorService.doctorsPage;

  ngOnInit() {
    this.getDoctors();
  }

  ngOnDestroy() {
    this.doctorService.clearState();
  }

  getDoctors(page?: number) {
    this.doctorService.getDoctors({ page })
      .subscribe();
  }

  openAddDoctorPanel() {
    if (this.role === UserRoleType.ROLE_SUPERADMIN) {
      this.router.navigate([{ outlets: { panel: ['panels', 'doctors', 'new'] } }]);
    } else {
      this.router.navigate([{ outlets: { panel: ['panels', 'doctors', 'add-to-organization'] } }]);
    }
  }
}
