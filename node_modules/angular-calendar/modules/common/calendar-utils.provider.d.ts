import { GetMonthViewArgs, MonthView, GetWeekViewHeaderArgs, WeekDay, GetWeekViewArgs, WeekView } from 'calendar-utils';
import { DateAdapter } from '../../date-adapters/date-adapter';
import * as ɵngcc0 from '@angular/core';
export declare class CalendarUtils {
    protected dateAdapter: DateAdapter;
    constructor(dateAdapter: DateAdapter);
    getMonthView(args: GetMonthViewArgs): MonthView;
    getWeekViewHeader(args: GetWeekViewHeaderArgs): WeekDay[];
    getWeekView(args: GetWeekViewArgs): WeekView;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarUtils, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<CalendarUtils>;
}

//# sourceMappingURL=calendar-utils.provider.d.ts.map