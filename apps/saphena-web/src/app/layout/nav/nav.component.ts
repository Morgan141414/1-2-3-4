import {Component, inject} from '@angular/core';

import {AuthService} from '../../core/services/auth.service';
import {UserRoleType} from '../../core/model/user.model';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  standalone: true
})
export class NavComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  superadminRoutes = [
    {
      path: 'organizations',
      name: 'Больницы',
      icon: 'fa-regular fa-hospital'
    },
    {
      path: 'doctors',
      name: 'Доктора',
      icon: 'fa-solid fa-user-doctor'
    },
    {
      path: 'mkb10',
      name: 'МКБ-10',
      icon: 'fa-solid fa-book'
    },
    {
      path: 'specializations',
      name: 'Специализации',
      icon: 'fa-solid fa-graduation-cap'
    },
    {
      path: 'patients',
      name: 'Пациенты',
      icon: 'fa-solid fa-hospital-user'
    },
  ];

  ceoRoutes = [
    {
      path: 'calendar',
      name: 'Календарь',
      icon: 'fa-regular fa-calendar-days'
    },
    {
      path: 'appointments',
      name: 'Журнал записей',
      icon: 'fa-regular fa-calendar-check'
    },
    {
      path: 'doctors',
      name: 'Доктора',
      icon: 'fa-solid fa-user-doctor'
    },
    {
      path: 'assistants',
      name: 'Ассистенты',
      icon: 'fa-solid fa-user-nurse'
    },
    {
      path: 'operators',
      name: 'Операторы',
      icon: 'fa-solid fa-headphones'
    },
    {
      path: 'documents',
      name: 'Документы',
      icon: 'fa-solid fa-file-contract'
    },
    {
      path: 'specialization-catalog',
      name: 'Специализации',
      icon: 'fa-solid fa-graduation-cap'
    },
    {
      path: 'analytics',
      name: 'Аналитика',
      icon: 'fa-solid fa-chart-simple'
    },
    {
      path: 'notifications',
      name: 'WhatsApp',
      icon: 'fa-brands fa-whatsapp'
    },
    {
      path: 'accounting',
      name: 'Бухгалтерский учет',
      icon: 'fa-solid fa-calculator'
    },
    {
      path: 'expense-types',
      name: 'Типы расходов',
      icon: 'fa-solid fa-list'
    },
    {
      path: 'vendors',
      name: 'Поставщики',
      icon: 'fa-solid fa-truck-field'
    },
    {
      path: 'kpi',
      name: 'KPI',
      icon: 'fa-solid fa-chart-simple'
    },
  ];

  organizationAdminRoutes = [
    {
      path: 'calendar',
      name: 'Календарь',
      icon: 'fa-regular fa-calendar-days'
    },
    {
      path: 'appointments',
      name: 'Журнал записей',
      icon: 'fa-regular fa-calendar-check'
    },
    {
      path: 'doctors',
      name: 'Доктора',
      icon: 'fa-solid fa-user-doctor'
    },
    {
      path: 'assistants',
      name: 'Ассистенты',
      icon: 'fa-solid fa-user-nurse'
    },
    {
      path: 'operators',
      name: 'Операторы',
      icon: 'fa-solid fa-headphones'
    },
    {
      path: 'documents',
      name: 'Документы',
      icon: 'fa-solid fa-file-contract'
    },
    {
      path: 'specialization-catalog',
      name: 'Специализации',
      icon: 'fa-solid fa-graduation-cap'
    },
    {
      path: 'rooms',
      name: 'Кабинеты',
      icon: 'fa-solid fa-door-open'
    },
    {
      path: 'notifications',
      name: 'WhatsApp',
      icon: 'fa-brands fa-whatsapp'
    },
    {
      path: 'settings',
      name: 'Настройки',
      icon: 'fa-solid fa-gear'
    },
  ];

  doctorRoutes = [
    {
      path: 'appointments',
      name: 'Журнал записей',
      icon: 'fa-regular fa-calendar-check'
    },
    {
      path: 'calendar',
      name: 'Календарь',
      icon: 'fa-regular fa-calendar-days'
    },
    {
      path: 'my-kpi',
      name: 'KPI',
      icon: 'fa-solid fa-chart-simple'
    },
  ];

  operatorRoutes = [
    {
      path: 'calendar',
      name: 'Календарь',
      icon: 'fa-regular fa-calendar-days'
    },
  ];

  receptionistRoutes = [
    {
      path: 'calendar',
      name: 'Календарь',
      icon: 'fa-regular fa-calendar-days'
    },
    {
      path: 'appointments',
      name: 'Журнал записей',
      icon: 'fa-regular fa-calendar-check'
    },
  ];

  accountantRoutes = [
    {
      path: 'accounting',
      name: 'Бухгалтерский учет',
      icon: 'fa-solid fa-calculator'
    },
    {
      path: 'expense-types',
      name: 'Типы расходов',
      icon: 'fa-solid fa-list'
    },
    {
      path: 'vendors',
      name: 'Поставщики',
      icon: 'fa-solid fa-truck-field'
    },
    {
      path: 'kpi',
      name: 'KPI',
      icon: 'fa-solid fa-chart-simple'
    },
  ];

  patientRoutes = [
    {
      path: 'appointments',
      name: 'Журнал записей',
      icon: 'fa-regular fa-calendar-check'
    },
    {
      path: 'change-password',
      name: 'Изменить пароль',
      icon: 'fa-solid fa-key'
    },
  ];

  getRoutes() {
    switch (this.authService.getRole()) {
      case UserRoleType.ROLE_SUPERADMIN: return this.superadminRoutes;
      case UserRoleType.ROLE_CEO: return this.ceoRoutes;
      case UserRoleType.ROLE_ORGANIZATION_ADMIN: return this.organizationAdminRoutes;
      case UserRoleType.ROLE_OPERATOR: return this.operatorRoutes;
      case UserRoleType.ROLE_RECEPTIONIST: return this.receptionistRoutes;
      case UserRoleType.ROLE_DOCTOR: return this.doctorRoutes;
      case UserRoleType.ROLE_ACCOUNTANT: return this.accountantRoutes;
      case UserRoleType.ROLE_PATIENT: return this.patientRoutes;
      default: return []
    }
  }

  isActive(route: string) {
    return this.router.url.includes(route);
  }

  signOut() {
    this.authService.signOut();
  }
}
