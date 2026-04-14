import { Routes } from '@angular/router';

import { AuthPageComponent} from './features/pages/auth-page/auth-page.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRoleType } from './core/model/user.model';

import {OrganizationListPageComponent} from './features/pages/organization-list-page/organization-list-page.component';
import {OrganizationDetailsPageComponent} from './features/pages/organization-details-page/organization-details-page.component';
import {SpecializationListPageComponent} from './features/pages/specialization-list-page/specialization-list-page.component';
import {SpecializationDetailsPageComponent} from './features/pages/specialization-details-page/specialization-details-page.component';
import {Mkb10PageComponent} from './features/pages/mkb10-page/mkb10-page.component';
import {DoctorDetailsPageComponent} from './features/pages/doctor-details-page/doctor-details-page.component';
import {AppointmentListPageComponent} from './features/pages/appointment-list-page/appointment-list-page.component';
import {AppointmentDetailsPageComponent} from './features/pages/appointment-details-page/appointment-details-page.component';
import {
  PatientAppointmentDetailsPageComponent
} from './features/pages/patient-appointment-details-page/patient-appointment-details-page.component';
import {DoctorListPageComponent} from './features/pages/doctor-list-page/doctor-list-page.component';
import {AssistantListPageComponent} from './features/pages/assistant-list-page/assistant-list-page.component';
import {PatientListPageComponent} from './features/pages/patient-list-page/patient-list-page.component';
import {PatientDocumentsPageComponent} from './features/pages/patient-documents-page/patient-documents-page.component';
import {AnalyticsPageComponent} from './features/pages/analytics-page/analytics-page.component';
import {CalendarPageComponent} from './features/pages/calendar-page/calendar-page.component';
import {OperatorListPageComponent} from './features/pages/operator-list-page/operator-list-page.component';
import {NotificationPageComponent} from './features/pages/notification-page/notification-page.component';
import {AccountingPageComponent} from './features/pages/accounting-page/accounting-page.component';
import {ExpenseTypeListPageComponent} from './features/pages/expense-type-list-page/expense-type-list-page.component';
import {VendorListPageComponent} from './features/pages/vendor-list-page/vendor-list-page.component';
import {RoomListPageComponent} from './features/pages/room-list-page/room-list-page.component';
import {SettingsPageComponent} from './features/pages/settings-page/settings-page.component';
import {SpecializationCatalogComponent} from './features/pages/specialization-catalog/specialization-catalog.component';
import {
  SpecializationCatalogDetailsPageComponent
} from './features/pages/specialization-catalog-details-page/specialization-catalog-details-page.component';

import {CreateOrganizationPanelComponent} from './features/panels/create-organization-panel/create-organization-panel.component';
import {CreateSpecializationPanelComponent} from './features/panels/create-specialization-panel/create-specialization-panel.component';
import {EditSpecializationPanelComponent} from './features/panels/edit-specialization-panel/edit-specialization-panel.component';
import {CreateProcedurePanelComponent} from './features/panels/create-procedure-panel/create-procedure-panel.component';
import {
  CreateOrganizationCeoPanelComponent
} from './features/panels/create-organization-ceo-panel/create-organization-ceo-panel.component';
import {CreateOrganizationAdminPanelComponent} from './features/panels/create-organization-admin-panel/create-organization-admin-panel.component';
import {
  CreateAccountantPanelComponent
} from './features/panels/create-accountant-panel/create-accountant-panel.component';
import {CreateAssistantPanelComponent} from './features/panels/create-assistant-panel/create-assistant-panel.component';
import {EditAssistantPanelComponent} from './features/panels/edit-assistant-panel/edit-assistant-panel.component';
import {EditUserPanelComponent} from './features/panels/edit-user-panel/edit-user-panel.component';
import {CreateDoctorPanelComponent} from './features/panels/create-doctor-panel/create-doctor-panel.component';
import {CreatePatientPanelComponent} from './features/panels/create-patient-panel/create-patient-panel.component';
import {EditPatientPanelComponent} from './features/panels/edit-patient-panel/edit-patient-panel.component';
import {EditAppointmentPanelComponent} from './features/panels/edit-appointment-panel/edit-appointment-panel.component';
import {AppointmentDocumentsPanelComponent} from './features/panels/appointment-documents-panel/appointment-documents-panel.component';
import {EditProcedurePanelComponent} from './features/panels/edit-procedure-panel/edit-procedure-panel.component';
import {
  OrganizationDocumentsPanelComponent
} from './features/panels/organization-documents-panel/organization-documents-panel.component';
import {
  OrganizationDocumentListPageComponent
} from './features/pages/organization-document-list-page/organization-document-list-page.component';
import {
  CreateOrganizationDocumentPanelComponent
} from './features/panels/create-organization-document-panel/create-organization-document-panel.component';
import {
  EditOrganizationDocumentPanelComponent
} from './features/panels/edit-organization-document-panel/edit-organization-document-panel.component';
import {
  CreateSpecializationDocumentPanelComponent
} from './features/panels/create-specialization-document-panel/create-specialization-document-panel.component';
import {
  EditSpecializationDocumentPanelComponent
} from './features/panels/edit-specialization-document-panel/edit-specialization-document-panel.component';
import {CreateOperatorPanelComponent} from './features/panels/create-operator-panel/create-operator-panel.component';
import {CreateCalendarEventPanelComponent} from './features/panels/create-calendar-event-panel/create-calendar-event-panel.component';
import {CreateExpensePanelComponent} from './features/panels/create-expense-panel/create-expense-panel.component';
import {EditExpensePanelComponent} from './features/panels/edit-expense-panel/edit-expense-panel.component';
import {
  CreateExpenseTypePanelComponent
} from './features/panels/create-expense-type-panel/create-expense-type-panel.component';
import {CreateVendorPanelComponent} from './features/panels/create-vendor-panel/create-vendor-panel.component';
import {EditVendorPanelComponent} from './features/panels/edit-vendor-panel/edit-vendor-panel.component';
import {CreateRoomPanelComponent} from './features/panels/create-room-panel/create-room-panel.component';
import {EditRoomPanelComponent} from './features/panels/edit-room-panel/edit-room-panel.component';
import {
  CreateReceptionistPanelComponent
} from './features/panels/create-receptionist-panel/create-receptionist-panel.component';
import {KpiPageComponent} from './features/pages/kpi-page/kpi-page.component';
import {MyKpiPageComponent} from './features/pages/my-kpi-page/my-kpi-page.component';
import {
  OrgProcedureSettingsPanelComponent
} from './features/panels/org-procedure-settings-panel/org-procedure-settings-panel.component';
import {
  DoctorAppointmentDetailsPanelComponent
} from './features/panels/doctor-appointment-details-panel/doctor-appointment-details-panel.component';
import {ChangePasswordComponent} from './features/pages/change-password/change-password.component';
import {AddDoctorPanelComponent} from './features/panels/add-doctor-panel/add-doctor-panel.component';
import {EditDoctorPanelComponent} from './features/panels/edit-doctor-panel/edit-doctor-panel.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'organizations',
    component: OrganizationListPageComponent,
    title: 'Больницы',
    data: {
      roles: [UserRoleType.ROLE_SUPERADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'organizations/:id',
    component: OrganizationDetailsPageComponent,
    title: `Больницы`,
    data: {
      roles: [UserRoleType.ROLE_SUPERADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'mkb10',
    component: Mkb10PageComponent,
    title: 'МКБ-10',
    data: {
      roles: [UserRoleType.ROLE_SUPERADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'specializations',
    component: SpecializationListPageComponent,
    title: 'Специализации',
    data: {
      roles: [UserRoleType.ROLE_SUPERADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'specializations/:id',
    component: SpecializationDetailsPageComponent,
    title: 'Специализации',
    data: {
      roles: [UserRoleType.ROLE_SUPERADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'specialization-catalog',
    component: SpecializationCatalogComponent,
    title: 'Каталог специализаций',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'specialization-catalog/:id',
    component: SpecializationCatalogDetailsPageComponent,
    title: 'Каталог специализаций',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'doctors',
    component: DoctorListPageComponent,
    title: 'Доктора',
    data: {
      roles: [UserRoleType.ROLE_SUPERADMIN, UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'doctors/:id',
    component: DoctorDetailsPageComponent,
    title: `Доктора`,
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'assistants',
    component: AssistantListPageComponent,
    title: 'Ассистенты',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'documents',
    component: OrganizationDocumentListPageComponent,
    title: 'Документы',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'appointments',
    component: AppointmentListPageComponent,
    title: 'Журнал записей',
    data: {
      roles: [
        UserRoleType.ROLE_CEO,
        UserRoleType.ROLE_ORGANIZATION_ADMIN,
        UserRoleType.ROLE_DOCTOR,
        UserRoleType.ROLE_RECEPTIONIST,
        UserRoleType.ROLE_PATIENT,
      ]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'appointments/:id',
    component: AppointmentDetailsPageComponent,
    title: 'Журнал записей',
    data: {
      roles: [UserRoleType.ROLE_DOCTOR, UserRoleType.ROLE_PATIENT]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'patient/appointments/:id',
    component: PatientAppointmentDetailsPageComponent,
    title: 'Журнал записей',
    data: {
      roles: [UserRoleType.ROLE_PATIENT]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'patients',
    component: PatientListPageComponent,
    title: 'Пациенты',
    data: {
      roles: [UserRoleType.ROLE_SUPERADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'patients/:id/docs',
    component: PatientDocumentsPageComponent,
    title: 'Пациенты',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN, UserRoleType.ROLE_OPERATOR, UserRoleType.ROLE_RECEPTIONIST]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'analytics',
    component: AnalyticsPageComponent,
    title: 'Аналитика',
    data: {
      roles: [UserRoleType.ROLE_CEO]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'calendar',
    component: CalendarPageComponent,
    title: 'Календарь',
    data: {
      roles: [
        UserRoleType.ROLE_CEO,
        UserRoleType.ROLE_ORGANIZATION_ADMIN,
        UserRoleType.ROLE_OPERATOR,
        UserRoleType.ROLE_RECEPTIONIST,
        UserRoleType.ROLE_ASSISTANT,
        UserRoleType.ROLE_DOCTOR,
      ]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'operators',
    component: OperatorListPageComponent,
    title: 'Операторы',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'notifications',
    component: NotificationPageComponent,
    title: 'WhatsApp',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'accounting',
    component: AccountingPageComponent,
    title: 'Бухгалтерский учет',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ACCOUNTANT]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'expense-types',
    component: ExpenseTypeListPageComponent,
    title: 'Типы расходов',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ACCOUNTANT]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'vendors',
    component: VendorListPageComponent,
    title: 'Поставщики',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ACCOUNTANT]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'rooms',
    component: RoomListPageComponent,
    title: 'Кабинеты',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'kpi',
    component: KpiPageComponent,
    title: 'KPI',
    data: {
      roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ACCOUNTANT]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'my-kpi',
    component: MyKpiPageComponent,
    title: 'KPI',
    data: {
      roles: [UserRoleType.ROLE_DOCTOR]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    title: 'Настройки',
    data: {
      roles: [UserRoleType.ROLE_ORGANIZATION_ADMIN]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    title: 'Настройки',
    data: {
      roles: [UserRoleType.ROLE_PATIENT]
    },
    canActivate: [authGuard, roleGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/auth'
  },
  {
    path: '**',
    redirectTo: '/auth'
  },

  {
    path: 'panels',
    outlet: 'panel',
    canActivate: [authGuard],
    children: [
      {
        path: 'organizations/new',
        component: CreateOrganizationPanelComponent,
        title: 'Новая больница',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'organizations/:id/add-ceo',
        component: CreateOrganizationCeoPanelComponent,
        title: 'Добавить CEO',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'organizations/:id/add-admin',
        component: CreateOrganizationAdminPanelComponent,
        title: 'Добавить администратора',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'organizations/:id/add-accountant',
        component: CreateAccountantPanelComponent,
        title: 'Добавить бухгалтера',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'specializations/new',
        component: CreateSpecializationPanelComponent,
        title: 'Новая специализация',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'specializations/:id/edit',
        component: EditSpecializationPanelComponent,
        title: 'Редактировать специализацию',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'specializations/:specId/procedures/new',
        component: CreateProcedurePanelComponent,
        title: 'Добавить услугу',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'specializations/:specId/procedures/:procedureId/edit',
        component: EditProcedurePanelComponent,
        title: 'Редактировать услугу',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'specializations/:specId/org-procedures/:orgProcId/edit',
        component: OrgProcedureSettingsPanelComponent,
        title: 'Настройки услуги',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'specializations/:id/spec-docs/new',
        component: CreateSpecializationDocumentPanelComponent,
        title: 'Добавить документ',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'specializations/:id/spec-docs/:specDocId/edit',
        component: EditSpecializationDocumentPanelComponent,
        title: 'Редактировать документ',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'users/:id/edit',
        component: EditUserPanelComponent,
        title: 'Редактировать пользователя',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_SUPERADMIN, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'doctors/new',
        component: CreateDoctorPanelComponent,
        title: 'Добавить доктора',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'doctors/add-to-organization',
        component: AddDoctorPanelComponent,
        title: 'Добавить доктора',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'doctors/:id/edit',
        component: EditDoctorPanelComponent,
        title: 'Редактировать доктора',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'assistants/new',
        component: CreateAssistantPanelComponent,
        title: 'Добавить ассистента',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'assistants/:id/edit',
        component: EditAssistantPanelComponent,
        title: 'Редактировать ассистента',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'documents/new',
        component: CreateOrganizationDocumentPanelComponent,
        title: 'Добавить документ',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'documents/:id/edit',
        component: EditOrganizationDocumentPanelComponent,
        title: 'Редактировать документ',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'appointments/:id',
        component: EditAppointmentPanelComponent,
        title: 'Информация о записи',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN, UserRoleType.ROLE_OPERATOR, UserRoleType.ROLE_RECEPTIONIST]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'attach-patient/:id',
        component: DoctorAppointmentDetailsPanelComponent,
        title: 'Информация о записи',
        data: {
          roles: [UserRoleType.ROLE_DOCTOR]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'calendar-event/new',
        component: CreateCalendarEventPanelComponent,
        title: 'Добавить запись',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN, UserRoleType.ROLE_OPERATOR, UserRoleType.ROLE_RECEPTIONIST]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'calendar-event/:id',
        component: EditAppointmentPanelComponent,
        title: 'Информация о записи',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN, UserRoleType.ROLE_OPERATOR, UserRoleType.ROLE_RECEPTIONIST]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'appointment-documents',
        component: AppointmentDocumentsPanelComponent,
        title: 'Документы',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_DOCTOR]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'patients/new',
        component: CreatePatientPanelComponent,
        title: 'Добавить пациента',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN, UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN, UserRoleType.ROLE_OPERATOR, UserRoleType.ROLE_RECEPTIONIST, UserRoleType.ROLE_DOCTOR]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'patients/:id/edit',
        component: EditPatientPanelComponent,
        title: 'Редактировать пациента',
        data: {
          roles: [UserRoleType.ROLE_SUPERADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'org-docs',
        component: OrganizationDocumentsPanelComponent,
        title: 'Документы',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN, UserRoleType.ROLE_OPERATOR, UserRoleType.ROLE_RECEPTIONIST]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'operators/new',
        component: CreateOperatorPanelComponent,
        title: 'Добавить оператора',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'receptionists/new',
        component: CreateReceptionistPanelComponent,
        title: 'Добавить ресепшен оператора',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'expenses/new',
        component: CreateExpensePanelComponent,
        title: 'Добавить расход',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ACCOUNTANT]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'expenses/:id',
        component: EditExpensePanelComponent,
        title: 'Детали расхода',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ACCOUNTANT]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'expense-types/new',
        component: CreateExpenseTypePanelComponent,
        title: 'Добавить тип расходов',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ACCOUNTANT]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'vendors/new',
        component: CreateVendorPanelComponent,
        title: 'Добавить поставщика',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ACCOUNTANT]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'vendors/:id/edit',
        component: EditVendorPanelComponent,
        title: 'Редактировать поставщика',
        data: {
          roles: [UserRoleType.ROLE_CEO]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'rooms/new',
        component: CreateRoomPanelComponent,
        title: 'Добавить кабинет',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      },
      {
        path: 'rooms/:id/edit',
        component: EditRoomPanelComponent,
        title: 'Редактировать кабинет',
        data: {
          roles: [UserRoleType.ROLE_CEO, UserRoleType.ROLE_ORGANIZATION_ADMIN]
        },
        canActivate: [roleGuard]
      }
    ]
  }
];
