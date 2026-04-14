import {Component, inject, input, OnInit, signal} from '@angular/core';

import {DoctorService} from '../../../core/services/doctor.service';
import {OrganizationProcedureService} from '../../../core/services/organization-procedure.service';
import {AuthService} from '../../../core/services/auth.service';
import {Doctor} from '../../../core/model/doctor.model';
import {Specialization} from '../../../core/model/specialization.model';
import {UserRoleType} from '../../../core/model/user.model';
import {ITab, TabsComponent} from '../../../shared/components/tabs/tabs.component';
import {DoctorInfoComponent} from '../../doctors/doctor-info/doctor-info.component';
import {DoctorAssistantsComponent} from '../../doctors/doctor-assistants/doctor-assistants.component';
import {DoctorSpecializationsComponent} from '../../doctors/doctor-specializations/doctor-specializations.component';
import {DoctorScheduleComponent} from '../../doctors/doctor-schedule/doctor-schedule.component';
import {DoctorVacationListComponent} from '../../doctors/doctor-vacation-list/doctor-vacation-list.component';
import {DoctorSettingsComponent} from '../../doctors/doctor-settings/doctor-settings.component';

@Component({
  selector: 'app-doctor-details-page',
  imports: [
    TabsComponent,
    DoctorAssistantsComponent,
    DoctorSpecializationsComponent,
    DoctorInfoComponent,
    DoctorScheduleComponent,
    DoctorVacationListComponent,
    DoctorSettingsComponent
  ],
  templateUrl: './doctor-details-page.component.html',
  styleUrl: './doctor-details-page.component.scss',
  standalone: true
})
export class DoctorDetailsPageComponent implements OnInit {
  private readonly doctorService = inject(DoctorService);
  private readonly organizationProcedureService = inject(OrganizationProcedureService);
  private readonly authService = inject(AuthService);
  private readonly role = this.authService.getRole();
  id = input.required<string>();

  tabs: ITab[] = [
    { id: 'info', title: 'Личная информация' },
  ];
  activeTab = signal(this.tabs[0].id);
  doctor = signal<Doctor | null>(null);
  specializations = signal<Specialization[]>([]);

  ngOnInit() {
    if (this.role !== UserRoleType.ROLE_SUPERADMIN) {
      this.tabs.push(
        { id: 'specializations', title: 'Специализации' },
        { id: 'schedule', title: 'Рабочие графики' },
        { id: 'vacations', title: 'Отпуски' },
        { id: 'assistants', title: 'Ассистенты' },
        { id: 'settings', title: 'Настройки' },
      );
    }
    this.getDoctorInfo();
    this.getSpecializations();
  }

  getDoctorInfo() {
    this.doctorService.getDoctor(this.id())
      .subscribe(resp => this.doctor.set(resp));
  }

  private getSpecializations() {
    this.organizationProcedureService.getSpecializations()
      .subscribe(resp => this.specializations.set(resp));
  }
}
