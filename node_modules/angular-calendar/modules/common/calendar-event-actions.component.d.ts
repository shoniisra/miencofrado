import { TemplateRef } from '@angular/core';
import { CalendarEvent, EventAction } from 'calendar-utils';
import * as ɵngcc0 from '@angular/core';
export declare class CalendarEventActionsComponent {
    event: CalendarEvent;
    customTemplate: TemplateRef<any>;
    trackByActionId: (index: number, action: EventAction) => string | number | EventAction;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarEventActionsComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CalendarEventActionsComponent, "mwl-calendar-event-actions", never, { "event": "event"; "customTemplate": "customTemplate"; }, {}, never, never>;
}

//# sourceMappingURL=calendar-event-actions.component.d.ts.map