import { EventEmitter } from '@angular/core';
import { DateAdapter } from '../../date-adapters/date-adapter';
/**
 * Change the view date to the current day. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarToday
 *  [(viewDate)]="viewDate">
 *  Today
 * </button>
 * ```
 */
import * as ɵngcc0 from '@angular/core';
export declare class CalendarTodayDirective {
    private dateAdapter;
    /**
     * The current view date
     */
    viewDate: Date;
    /**
     * Called when the view date is changed
     */
    viewDateChange: EventEmitter<Date>;
    constructor(dateAdapter: DateAdapter);
    /**
     * @hidden
     */
    onClick(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarTodayDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<CalendarTodayDirective, "[mwlCalendarToday]", never, { "viewDate": "viewDate"; }, { "viewDateChange": "viewDateChange"; }, never>;
}

//# sourceMappingURL=calendar-today.directive.d.ts.map