import {UserRoleType} from '../../core/model/user.model';
import {AssistantType} from '../../core/model/assistant.model';
import {AppointmentStatusType, PaymentStatusType, PaymentType} from '../../core/model/appointment.model';
import {PatientDocumentType, PatientDocumentVerificationStatus} from '../../core/model/patient.model';
import {TrafficSourceType} from '../../core/model/analytics.model';

export function getFullname(firstName?: string,
                            lastName?: string,
                            middleName?: string): string {
  return `${lastName} ${firstName} ${middleName || ''}`.trim();
}

export function getShortFullName(firstName: string,
                                 lastName: string,
                                 middleName?: string): string {
  const f = firstName.trim();
  const l = lastName.trim();
  const m = middleName?.trim();

  const initials = [
    f && `${f[0].toUpperCase()}.`,
    m && `${m[0].toUpperCase()}.`,
  ]
    .filter(Boolean)
    .join('');

  return [l || null, initials || null]
    .filter(Boolean)
    .join(' ');
}

export function getRoleName(role?: UserRoleType) {
  switch (role) {
    case UserRoleType.ROLE_SUPERADMIN: return 'Суперадмин';
    case UserRoleType.ROLE_CEO: return 'CEO';
    case UserRoleType.ROLE_ORGANIZATION_ADMIN: return 'Администратор организации';
    case UserRoleType.ROLE_DOCTOR: return 'Доктор';
    case UserRoleType.ROLE_OPERATOR: return 'Оператор';
    case UserRoleType.ROLE_RECEPTIONIST: return 'Ресепшн';
    case UserRoleType.ROLE_ACCOUNTANT: return 'Бухгалтер';
    case UserRoleType.ROLE_PATIENT: return 'Пациент';
    default: return 'No role';
  }
}

export function getAssistantTypeName(type?: AssistantType | string) {
  switch (type) {
    case AssistantType.NURSE: return 'Медсестра';
    case AssistantType.ANESTHETIST: return 'Анестезиолог';
    case AssistantType.NURSE_ASSISTANT: return 'Ассистент медсестры';
    case AssistantType.OPERATING_NURSE: return 'Операционная медсестра';
    case AssistantType.OPERATING_NURSE_ASSISTANT: return 'Ассистент операционной медсестры';
    case AssistantType.SURGEON_ASSISTANT: return 'Ассистент хирурга';
    default: return 'Ассистент';
  }
}

export function getAppointmentStatusName(status: AppointmentStatusType | string) {
  switch (status) {
    case AppointmentStatusType.SCHEDULED: return 'Запланировано';
    case AppointmentStatusType.IN_PROGRESS: return 'В процессе';
    case AppointmentStatusType.COMPLETED: return 'Завершено';
    case AppointmentStatusType.CANCELLED: return 'Отменено';
    case AppointmentStatusType.PENDING_VERIFICATION: return 'На верификации';
    default: return 'Не указано';
  }
}

export function getPatientDocumentTypeName(type?: PatientDocumentType | string) {
  switch (type) {
    case PatientDocumentType.ID_CARD: return 'Уд. личности';
    case PatientDocumentType.PASSPORT: return 'Паспорт';
    case PatientDocumentType.BIRTH_CERTIFICATE: return 'Свидетельство о рождении';
    default: return 'Не указано';
  }
}

export function getTrafficSourceTypeName(type?: TrafficSourceType | string) {
  switch (type) {
    case TrafficSourceType.DOCTOR_REFERRAL: return 'Направление от другого врача';
    case TrafficSourceType.INSTAGRAM: return 'Instagram';
    case TrafficSourceType.TIKTOK: return 'TikTok';
    case TrafficSourceType.FACEBOOK: return 'Facebook';
    case TrafficSourceType.TWO_GIS: return '2GIS';
    case TrafficSourceType.WEBSITE: return 'Сайт';
    case TrafficSourceType.WORD_OF_MOUTH: return 'Сарафанное радио';
    case TrafficSourceType.OTHER: return 'Другое';
    default: return 'Не указано';
  }
}

export function getPatientDocumentVerificationStatusName(status?: PatientDocumentVerificationStatus | string) {
  switch (status) {
    case PatientDocumentVerificationStatus.PROVIDED: return 'Ожидает верификации';
    case PatientDocumentVerificationStatus.VERIFIED: return 'Верифицирован';
    case PatientDocumentVerificationStatus.REJECTED: return 'На корректировке';
    default: return 'Не указано';
  }
}

export function getPaymentTypeName(type?: PaymentType | string) {
  switch (type) {
    case PaymentType.CASH: return 'Наличка';
    case PaymentType.CARD: return 'Карта';
    case PaymentType.QR: return 'QR';
    case PaymentType.INSTALLMENT: return 'Рассрочка';
    default: return 'Не указано';
  }
}

export function getPaymentStatusName(status?: PaymentStatusType | string) {
  switch (status) {
    case PaymentStatusType.PAID: return 'Оплачено';
    case PaymentStatusType.UNPAID: return 'Не оплачено';
    case PaymentStatusType.PARTIALLY_PAID: return 'Частично оплачено';
    case PaymentStatusType.REFUNDED: return 'Возвращено';
    case PaymentStatusType.CANCELLED: return 'Отменено';
    default: return 'Неизвестно';
  }
}
