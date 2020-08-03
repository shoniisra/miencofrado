import { PipeTransform } from '@angular/core';
import { CalendarA11y } from './calendar-a11y.provider';
import { A11yParams } from './calendar-a11y.interface';
/**
 * This pipe is primarily for rendering aria labels. Example usage:
 * ```typescript
 * // where `myEvent` is a `CalendarEvent` and myLocale is a locale identifier
 * {{ { event: myEvent, locale: myLocale } | calendarA11y: 'eventDescription' }}
 * ```
 */
import * as ɵngcc0 from '@angular/core';
export declare class CalendarA11yPipe implements PipeTransform {
    private calendarA11y;
    private locale;
    constructor(calendarA11y: CalendarA11y, locale: string);
    transform(a11yParams: A11yParams, method: string): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarA11yPipe, never>;
    static ɵpipe: ɵngcc0.ɵɵPipeDefWithMeta<CalendarA11yPipe, "calendarA11y">;
}

//# sourceMappingURL=calendar-a11y.pipe.d.ts.map