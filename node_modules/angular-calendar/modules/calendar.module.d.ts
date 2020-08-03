import { ModuleWithProviders, Provider } from '@angular/core';
import { CalendarModuleConfig } from './common/calendar-common.module';
import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from './common/calendar-common.module';
import * as ɵngcc2 from './month/calendar-month.module';
import * as ɵngcc3 from './week/calendar-week.module';
import * as ɵngcc4 from './day/calendar-day.module';
export * from './common/calendar-common.module';
export * from './month/calendar-month.module';
export * from './week/calendar-week.module';
export * from './day/calendar-day.module';
/**
 * The main module of this library. Example usage:
 *
 * ```typescript
 * import { CalenderModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalenderModule.forRoot()
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
export declare class CalendarModule {
    static forRoot(dateAdapter: Provider, config?: CalendarModuleConfig): ModuleWithProviders<CalendarModule>;
    static ɵmod: ɵngcc0.ɵɵNgModuleDefWithMeta<CalendarModule, never, [typeof ɵngcc1.CalendarCommonModule, typeof ɵngcc2.CalendarMonthModule, typeof ɵngcc3.CalendarWeekModule, typeof ɵngcc4.CalendarDayModule], [typeof ɵngcc1.CalendarCommonModule, typeof ɵngcc2.CalendarMonthModule, typeof ɵngcc3.CalendarWeekModule, typeof ɵngcc4.CalendarDayModule]>;
    static ɵinj: ɵngcc0.ɵɵInjectorDef<CalendarModule>;
}

//# sourceMappingURL=calendar.module.d.ts.map