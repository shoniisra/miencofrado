import { EventEmitter, TemplateRef } from '@angular/core';
import { CalendarEvent, WeekDay } from 'calendar-utils';
import * as ɵngcc0 from '@angular/core';
export declare class CalendarWeekViewHeaderComponent {
    days: WeekDay[];
    locale: string;
    customTemplate: TemplateRef<any>;
    dayHeaderClicked: EventEmitter<{
        day: WeekDay;
        sourceEvent: MouseEvent;
    }>;
    eventDropped: EventEmitter<{
        event: CalendarEvent<any>;
        newStart: Date;
    }>;
    dragEnter: EventEmitter<{
        date: Date;
    }>;
    trackByWeekDayHeaderDate: (index: number, day: WeekDay) => string;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarWeekViewHeaderComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CalendarWeekViewHeaderComponent, "mwl-calendar-week-view-header", never, { "days": "days"; "locale": "locale"; "customTemplate": "customTemplate"; }, { "dayHeaderClicked": "dayHeaderClicked"; "eventDropped": "eventDropped"; "dragEnter": "dragEnter"; }, never, never>;
}

//# sourceMappingURL=calendar-week-view-header.component.d.ts.map