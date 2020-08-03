import { OnDestroy, Injector, ComponentFactoryResolver, ViewContainerRef, ElementRef, Renderer2, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { PlacementArray } from 'positioning';
import { CalendarEvent } from 'calendar-utils';
import * as ɵngcc0 from '@angular/core';
export declare class CalendarTooltipWindowComponent {
    contents: string;
    placement: string;
    event: CalendarEvent;
    customTemplate: TemplateRef<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarTooltipWindowComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CalendarTooltipWindowComponent, "mwl-calendar-tooltip-window", never, { "contents": "contents"; "placement": "placement"; "event": "event"; "customTemplate": "customTemplate"; }, {}, never, never>;
}
export declare class CalendarTooltipDirective implements OnDestroy, OnChanges {
    private elementRef;
    private injector;
    private renderer;
    private viewContainerRef;
    private document;
    contents: string;
    placement: PlacementArray;
    customTemplate: TemplateRef<any>;
    event: CalendarEvent;
    appendToBody: boolean;
    delay: number | null;
    private tooltipFactory;
    private tooltipRef;
    private cancelTooltipDelay$;
    constructor(elementRef: ElementRef, injector: Injector, renderer: Renderer2, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, document: any);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    onMouseOver(): void;
    onMouseOut(): void;
    private show;
    private hide;
    private positionTooltip;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CalendarTooltipDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<CalendarTooltipDirective, "[mwlCalendarTooltip]", never, { "placement": "tooltipPlacement"; "delay": "tooltipDelay"; "contents": "mwlCalendarTooltip"; "customTemplate": "tooltipTemplate"; "event": "tooltipEvent"; "appendToBody": "tooltipAppendToBody"; }, {}, never>;
}

//# sourceMappingURL=calendar-tooltip.directive.d.ts.map