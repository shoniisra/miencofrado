import { PipeTransform } from '@angular/core';
import { CalendarDateFormatter } from './calendar-date-formatter.provider';
/**
 * This pipe is primarily for rendering the current view title. Example usage:
 * ```typescript
 * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
 * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
 * ```
 */
import * as ɵngcc0 from '@angular/core';
export declare class CalendarDatePipe implements PipeTransform {
    private dateFormatter;
    private locale;
    constructor(dateFormatter: CalendarDateFormatter, locale: string);
    transform(date: Date, method: string, locale?: string, weekStartsOn?: number, excludeDays?: number[], daysInWeek?: number): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarDatePipe, never>;
    static ɵpipe: ɵngcc0.ɵɵPipeDefWithMeta<CalendarDatePipe, "calendarDate">;
}

//# sourceMappingURL=calendar-date.pipe.d.ts.map