import {CalendarEvent} from 'angular-calendar';
import {EventColor} from 'calendar-utils'

import {AppointmentStatusType} from './appointment.model';
import {ProcedureType} from './procedure.model';
import {PatientDocumentVerificationStatus} from './patient.model';

export interface CalendarEventMetaData {
  status: AppointmentStatusType,
  procedureType: ProcedureType,
  patientId: string,
  patientFullname: string,
  verificationStatus?: PatientDocumentVerificationStatus,
  disabled?: boolean,
}

export function mapToCalendarEvents(events: CalendarEvent[]): CalendarEvent<CalendarEventMetaData>[] {
  return events.map(mapToCalendarEvent);
}

function mapToCalendarEvent(event: CalendarEvent): CalendarEvent<CalendarEventMetaData> {
  return {
    id: event.id,
    start: new Date(event.start),
    end: new Date(event.end!),
    title: `${event.title}`,
    meta: event.meta,
    color: setEventColor(event.meta.procedureType)
  };
}

function setEventColor(status: ProcedureType): EventColor {
  switch (status) {
    case ProcedureType.GREEN: return EVENT_COLORS['green'];
    case ProcedureType.BLUE: return EVENT_COLORS['blue'];
    case ProcedureType.YELLOW: return EVENT_COLORS['yellow'];
    default: return EVENT_COLORS['default'];
  }
}

export const EVENT_COLORS: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#5cb85c',
    secondary: '#DFF0D8',
  },
  default: {
    primary: '#6c6c6c',
    secondary: '#cccccc',
  },
  disabled: {
    primary: '#ccc',
    secondary: '#eee',
  }
};
