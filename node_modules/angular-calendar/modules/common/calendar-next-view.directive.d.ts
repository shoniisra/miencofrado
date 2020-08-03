import { EventEmitter } from '@angular/core';
import { DateAdapter } from '../../date-adapters/date-adapter';
import { CalendarView } from './calendar-view.enum';
/**
 * Change the view date to the next view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarNextView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Next
 * </button>
 * ```
 */
import * as ɵngcc0 from '@angular/core';
export declare class CalendarNextViewDirective {
    private dateAdapter;
    /**
     * The current view
     */
    view: CalendarView | 'month' | 'week' | 'day';
    /**
     * The current view date
     */
    viewDate: Date;
    /**
     * Days to skip when going forward by 1 day
     */
    excludeDays: number[];
    /**
     * The number of days in a week. If set will add this amount of days instead of 1 week
     */
    daysInWeek: number;
    /**
     * Called when the view date is changed
     */
    viewDateChange: EventEmitter<Date>;
    constructor(dateAdapter: DateAdapter);
    /**
     * @hidden
     */
    onClick(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarNextViewDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<CalendarNextViewDirective, "[mwlCalendarNextView]", never, { "excludeDays": "excludeDays"; "view": "view"; "viewDate": "viewDate"; "daysInWeek": "daysInWeek"; }, { "viewDateChange": "viewDateChange"; }, never>;
}

//# sourceMappingURL=calendar-next-view.directive.d.ts.map