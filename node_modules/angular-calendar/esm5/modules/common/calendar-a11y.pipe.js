import { __decorate, __param } from "tslib";
import { Pipe, LOCALE_ID, Inject } from '@angular/core';
import { CalendarA11y } from './calendar-a11y.provider';
/**
 * This pipe is primarily for rendering aria labels. Example usage:
 * ```typescript
 * // where `myEvent` is a `CalendarEvent` and myLocale is a locale identifier
 * {{ { event: myEvent, locale: myLocale } | calendarA11y: 'eventDescription' }}
 * ```
 */
var CalendarA11yPipe = /** @class */ (function () {
    function CalendarA11yPipe(calendarA11y, locale) {
        this.calendarA11y = calendarA11y;
        this.locale = locale;
    }
    CalendarA11yPipe.prototype.transform = function (a11yParams, method) {
        a11yParams.locale = a11yParams.locale || this.locale;
        if (typeof this.calendarA11y[method] === 'undefined') {
            var allowedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(CalendarA11y.prototype)).filter(function (iMethod) { return iMethod !== 'constructor'; });
            throw new Error(method + " is not a valid a11y method. Can only be one of " + allowedMethods.join(', '));
        }
        return this.calendarA11y[method](a11yParams);
    };
    CalendarA11yPipe.ctorParameters = function () { return [
        { type: CalendarA11y },
        { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
    ]; };
    CalendarA11yPipe = __decorate([
        Pipe({
            name: 'calendarA11y',
        }),
        __param(1, Inject(LOCALE_ID))
    ], CalendarA11yPipe);
    return CalendarA11yPipe;
}());
export { CalendarA11yPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYTExeS5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvY29tbW9uL2NhbGVuZGFyLWExMXkucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFHeEQ7Ozs7OztHQU1HO0FBSUg7SUFDRSwwQkFDVSxZQUEwQixFQUNQLE1BQWM7UUFEakMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDUCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ3hDLENBQUM7SUFFSixvQ0FBUyxHQUFULFVBQVUsVUFBc0IsRUFBRSxNQUFjO1FBQzlDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JELElBQUksT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUNwRCxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQy9DLE1BQU0sQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUM5QyxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU8sSUFBSyxPQUFBLE9BQU8sS0FBSyxhQUFhLEVBQXpCLENBQXlCLENBQUMsQ0FBQztZQUNqRCxNQUFNLElBQUksS0FBSyxDQUNWLE1BQU0sd0RBQW1ELGNBQWMsQ0FBQyxJQUFJLENBQzdFLElBQUksQ0FDSCxDQUNKLENBQUM7U0FDSDtRQUNELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDOztnQkFqQnVCLFlBQVk7NkNBQ2pDLE1BQU0sU0FBQyxTQUFTOztJQUhSLGdCQUFnQjtRQUg1QixJQUFJLENBQUM7WUFDSixJQUFJLEVBQUUsY0FBYztTQUNyQixDQUFDO1FBSUcsV0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7T0FIVCxnQkFBZ0IsQ0FvQjVCO0lBQUQsdUJBQUM7Q0FBQSxBQXBCRCxJQW9CQztTQXBCWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtLCBMT0NBTEVfSUQsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJBMTF5IH0gZnJvbSAnLi9jYWxlbmRhci1hMTF5LnByb3ZpZGVyJztcbmltcG9ydCB7IEExMXlQYXJhbXMgfSBmcm9tICcuL2NhbGVuZGFyLWExMXkuaW50ZXJmYWNlJztcblxuLyoqXG4gKiBUaGlzIHBpcGUgaXMgcHJpbWFyaWx5IGZvciByZW5kZXJpbmcgYXJpYSBsYWJlbHMuIEV4YW1wbGUgdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyB3aGVyZSBgbXlFdmVudGAgaXMgYSBgQ2FsZW5kYXJFdmVudGAgYW5kIG15TG9jYWxlIGlzIGEgbG9jYWxlIGlkZW50aWZpZXJcbiAqIHt7IHsgZXZlbnQ6IG15RXZlbnQsIGxvY2FsZTogbXlMb2NhbGUgfSB8IGNhbGVuZGFyQTExeTogJ2V2ZW50RGVzY3JpcHRpb24nIH19XG4gKiBgYGBcbiAqL1xuQFBpcGUoe1xuICBuYW1lOiAnY2FsZW5kYXJBMTF5Jyxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJBMTF5UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNhbGVuZGFyQTExeTogQ2FsZW5kYXJBMTF5LFxuICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIGxvY2FsZTogc3RyaW5nXG4gICkge31cblxuICB0cmFuc2Zvcm0oYTExeVBhcmFtczogQTExeVBhcmFtcywgbWV0aG9kOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGExMXlQYXJhbXMubG9jYWxlID0gYTExeVBhcmFtcy5sb2NhbGUgfHwgdGhpcy5sb2NhbGU7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNhbGVuZGFyQTExeVttZXRob2RdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgYWxsb3dlZE1ldGhvZHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhcbiAgICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKENhbGVuZGFyQTExeS5wcm90b3R5cGUpXG4gICAgICApLmZpbHRlcigoaU1ldGhvZCkgPT4gaU1ldGhvZCAhPT0gJ2NvbnN0cnVjdG9yJyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAke21ldGhvZH0gaXMgbm90IGEgdmFsaWQgYTExeSBtZXRob2QuIENhbiBvbmx5IGJlIG9uZSBvZiAke2FsbG93ZWRNZXRob2RzLmpvaW4oXG4gICAgICAgICAgJywgJ1xuICAgICAgICApfWBcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNhbGVuZGFyQTExeVttZXRob2RdKGExMXlQYXJhbXMpO1xuICB9XG59XG4iXX0=