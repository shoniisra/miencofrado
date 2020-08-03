import { ModuleWithProviders, Provider } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from './calendar-event-actions.component';
import * as ɵngcc2 from './calendar-event-title.component';
import * as ɵngcc3 from './calendar-tooltip.directive';
import * as ɵngcc4 from './calendar-previous-view.directive';
import * as ɵngcc5 from './calendar-next-view.directive';
import * as ɵngcc6 from './calendar-today.directive';
import * as ɵngcc7 from './calendar-date.pipe';
import * as ɵngcc8 from './calendar-event-title.pipe';
import * as ɵngcc9 from './calendar-a11y.pipe';
import * as ɵngcc10 from './click.directive';
import * as ɵngcc11 from './keydown-enter.directive';
import * as ɵngcc12 from '@angular/common';
export interface CalendarModuleConfig {
    eventTitleFormatter?: Provider;
    dateFormatter?: Provider;
    utils?: Provider;
    a11y?: Provider;
}
export * from './calendar-event-title-formatter.provider';
export * from './calendar-moment-date-formatter.provider';
export * from './calendar-native-date-formatter.provider';
export * from './calendar-angular-date-formatter.provider';
export * from './calendar-date-formatter.provider';
export * from './calendar-utils.provider';
export * from './calendar-a11y.provider';
export * from './calendar-a11y.interface';
export * from './calendar-date-formatter.interface';
export * from './calendar-event-times-changed-event.interface';
export * from '../../date-adapters/date-adapter';
export * from './calendar-view.enum';
export { CalendarEvent, EventAction as CalendarEventAction, DAYS_OF_WEEK, ViewPeriod as CalendarViewPeriod, } from 'calendar-utils';
/**
 * Import this module to if you're just using a singular view and want to save on bundle size. Example usage:
 *
 * ```typescript
 * import { CalendarCommonModule, CalendarMonthModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalendarCommonModule.forRoot(),
 *     CalendarMonthModule
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
export declare class CalendarCommonModule {
    static forRoot(dateAdapter: Provider, config?: CalendarModuleConfig): ModuleWithProviders<CalendarCommonModule>;
    static ɵmod: ɵngcc0.ɵɵNgModuleDefWithMeta<CalendarCommonModule, [typeof ɵngcc1.CalendarEventActionsComponent, typeof ɵngcc2.CalendarEventTitleComponent, typeof ɵngcc3.CalendarTooltipWindowComponent, typeof ɵngcc3.CalendarTooltipDirective, typeof ɵngcc4.CalendarPreviousViewDirective, typeof ɵngcc5.CalendarNextViewDirective, typeof ɵngcc6.CalendarTodayDirective, typeof ɵngcc7.CalendarDatePipe, typeof ɵngcc8.CalendarEventTitlePipe, typeof ɵngcc9.CalendarA11yPipe, typeof ɵngcc10.ClickDirective, typeof ɵngcc11.KeydownEnterDirective], [typeof ɵngcc12.CommonModule], [typeof ɵngcc1.CalendarEventActionsComponent, typeof ɵngcc2.CalendarEventTitleComponent, typeof ɵngcc3.CalendarTooltipWindowComponent, typeof ɵngcc3.CalendarTooltipDirective, typeof ɵngcc4.CalendarPreviousViewDirective, typeof ɵngcc5.CalendarNextViewDirective, typeof ɵngcc6.CalendarTodayDirective, typeof ɵngcc7.CalendarDatePipe, typeof ɵngcc8.CalendarEventTitlePipe, typeof ɵngcc9.CalendarA11yPipe, typeof ɵngcc10.ClickDirective, typeof ɵngcc11.KeydownEnterDirective]>;
    static ɵinj: ɵngcc0.ɵɵInjectorDef<CalendarCommonModule>;
}

//# sourceMappingURL=calendar-common.module.d.ts.map