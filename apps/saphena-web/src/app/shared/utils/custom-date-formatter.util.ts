import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {

  public override dayViewHour({ date, locale = 'ru-KZ' }: DateFormatterParams): string {
    return formatDate(date, 'HH:mm', locale);
  }

  public override weekViewHour({ date, locale = 'ru-KZ' }: DateFormatterParams): string {
    return formatDate(date, 'HH:mm', locale);
  }

  public override dayViewTitle({date, locale = 'ru-KZ'}: DateFormatterParams): string {
    return formatDate(date, 'd MMMM y, EEEE', locale);
  }
}
