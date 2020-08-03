import { PipeTransform } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { CalendarEventTitleFormatter } from './calendar-event-title-formatter.provider';
import * as ɵngcc0 from '@angular/core';
export declare class CalendarEventTitlePipe implements PipeTransform {
    private calendarEventTitle;
    constructor(calendarEventTitle: CalendarEventTitleFormatter);
    transform(title: string, titleType: string, event: CalendarEvent): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarEventTitlePipe, never>;
    static ɵpipe: ɵngcc0.ɵɵPipeDefWithMeta<CalendarEventTitlePipe, "calendarEventTitle">;
}

//# sourceMappingURL=calendar-event-title.pipe.d.ts.map