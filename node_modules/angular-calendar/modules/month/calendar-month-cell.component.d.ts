import { EventEmitter, TemplateRef } from '@angular/core';
import { MonthViewDay, CalendarEvent } from 'calendar-utils';
import { isWithinThreshold } from '../common/util';
import { PlacementArray } from 'positioning';
import * as ɵngcc0 from '@angular/core';
export declare class CalendarMonthCellComponent {
    day: MonthViewDay;
    openDay: MonthViewDay;
    locale: string;
    tooltipPlacement: PlacementArray;
    tooltipAppendToBody: boolean;
    customTemplate: TemplateRef<any>;
    tooltipTemplate: TemplateRef<any>;
    tooltipDelay: number | null;
    highlightDay: EventEmitter<any>;
    unhighlightDay: EventEmitter<any>;
    eventClicked: EventEmitter<{
        event: CalendarEvent<any>;
        sourceEvent: MouseEvent;
    }>;
    trackByEventId: (index: number, event: CalendarEvent<any>) => string | number | CalendarEvent<any>;
    validateDrag: typeof isWithinThreshold;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarMonthCellComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CalendarMonthCellComponent, "mwl-calendar-month-cell", never, { "day": "day"; "openDay": "openDay"; "locale": "locale"; "tooltipPlacement": "tooltipPlacement"; "tooltipAppendToBody": "tooltipAppendToBody"; "customTemplate": "customTemplate"; "tooltipTemplate": "tooltipTemplate"; "tooltipDelay": "tooltipDelay"; }, { "highlightDay": "highlightDay"; "unhighlightDay": "unhighlightDay"; "eventClicked": "eventClicked"; }, never, never>;
}

//# sourceMappingURL=calendar-month-cell.component.d.ts.map