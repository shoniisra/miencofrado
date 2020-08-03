import { TemplateRef, EventEmitter } from '@angular/core';
import { WeekDay } from 'calendar-utils';
import * as ɵngcc0 from '@angular/core';
export declare class CalendarMonthViewHeaderComponent {
    days: WeekDay[];
    locale: string;
    customTemplate: TemplateRef<any>;
    columnHeaderClicked: EventEmitter<{
        isoDayNumber: number;
        sourceEvent: MouseEvent;
    }>;
    trackByWeekDayHeaderDate: (index: number, day: WeekDay) => string;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarMonthViewHeaderComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CalendarMonthViewHeaderComponent, "mwl-calendar-month-view-header", never, { "days": "days"; "locale": "locale"; "customTemplate": "customTemplate"; }, { "columnHeaderClicked": "columnHeaderClicked"; }, never, never>;
}

//# sourceMappingURL=calendar-month-view-header.component.d.ts.map