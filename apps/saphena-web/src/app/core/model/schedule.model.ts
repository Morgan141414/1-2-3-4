import {CalendarEvent} from 'angular-calendar';
import {addDays, startOfWeek, format, setHours, setMinutes} from 'date-fns';
import {EVENT_COLORS} from './calendar.model';

export interface WorkSchedule {
  id: string,
  orgUserId: string,
  name: string,
  startDate: string,
  endDate: string,
  patterns: WorkPattern[]
}

export interface WorkPattern {
  weekday: string,
  startTime: string,
  endTime: string
}

export interface CreateWorkScheduleRequest {
  orgUserId: string,
  name: string,
  startDate: string,
  endDate: string | null,
  patterns: WorkPattern[]
}

export interface UpdateWorkScheduleRequest {
  id: string,
  name: string,
  startDate: string,
  endDate: string | null,
  patterns: WorkPattern[]
}

export interface WorkScheduleException {
  startDate: string,
  endDate: string,
  note?: string
}

export interface CreateWorkScheduleExceptionRequest {
  orgUserId: string,
  startDate: string,
  endDate: string,
  note?: string
}

export interface WorkScheduleSlot {
  weekday: string,
  start: string,
  end: string
}

const weekdayMap: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0
};

export function mapEventsToWorkPatterns(events: CalendarEvent[]): WorkPattern[] {
  return events.map(e => ({
    weekday: e.title,
    startTime: format(e.start, 'HH:mm:ss'),
    endTime: format(e.end!, 'HH:mm:ss')
  }))
}

export function mapWorkPatternsToEvents(workPatterns: WorkPattern[], date: Date): CalendarEvent[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });

  return workPatterns.map(wp => {
    const dayIndex = weekdayMap[wp.weekday];
    const baseDate = dayIndex !== 0 ? addDays(weekStart, dayIndex - 1) : addDays(weekStart, 6);

    const [sh, sm, ss] = wp.startTime.split(':').map(Number);
    const [eh, em, es] = wp.endTime.split(':').map(Number);

    const start = new Date(baseDate);
    start.setHours(sh, sm, ss, 0);

    const end = new Date(baseDate);
    end.setHours(eh, em, es, 0);

    return {
      start,
      end,
      title: wp.weekday,
      color: EVENT_COLORS['blue']
    }
  })
}

export function generateWeekBlockedEvents(
  slots: WorkScheduleSlot[],
  viewDate: Date
): CalendarEvent[] {
  const blocked: CalendarEvent[] = [];

  const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 }); // Пн недели

  // группируем слоты по weekday
  const slotsByDay = slots.reduce<Record<string, WorkScheduleSlot[]>>((acc, slot) => {
    acc[slot.weekday] = acc[slot.weekday] || [];
    acc[slot.weekday].push(slot);
    return acc;
  }, {});

  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(weekStart, i);

    const weekdayName = Object.entries(weekdayMap).find(
      ([, num]) => num === currentDay.getDay()
    )?.[0] as WorkScheduleSlot['weekday'];

    const daySlots = (slotsByDay[weekdayName] || []).sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    // рабочее время дня
    const dayStart = setMinutes(setHours(currentDay, 8), 0);
    const dayEnd = setMinutes(setHours(currentDay, 21), 0);

    // если вообще нет рабочих слотов → весь день нерабочий
    if (daySlots.length === 0) {
      blocked.push({
        start: new Date(dayStart),
        end: new Date(dayEnd),
        title: 'Нерабочее время',
        color: EVENT_COLORS['disabled'],
        meta: { disabled: true },
      });
      continue;
    }

    let lastEnd = dayStart;

    daySlots.forEach((slot) => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      // берём только время и накладываем на текущий день
      const realSlotStart = setMinutes(
        setHours(currentDay, slotStart.getHours()),
        slotStart.getMinutes()
      );
      const realSlotEnd = setMinutes(
        setHours(currentDay, slotEnd.getHours()),
        slotEnd.getMinutes()
      );

      // если есть "дырка" до слота → нерабочее время
      if (lastEnd < realSlotStart) {
        blocked.push({
          start: new Date(lastEnd),
          end: new Date(realSlotStart),
          title: 'Нерабочее время',
          color: EVENT_COLORS['disabled'],
          meta: { disabled: true },
        });
      }

      lastEnd = realSlotEnd;
    });

    // после последнего рабочего слота → до конца дня
    if (lastEnd < dayEnd) {
      blocked.push({
        start: new Date(lastEnd),
        end: new Date(dayEnd),
        title: 'Нерабочее время',
        color: EVENT_COLORS['disabled'],
        meta: { disabled: true },
      });
    }
  }

  return blocked;
}
