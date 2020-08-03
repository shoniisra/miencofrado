import { Renderer2, ElementRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class ClickDirective implements OnInit, OnDestroy {
    private renderer;
    private elm;
    private document;
    clickListenerDisabled: boolean;
    click: EventEmitter<MouseEvent>;
    private destroy$;
    constructor(renderer: Renderer2, elm: ElementRef<HTMLElement>, document: any);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private listen;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ClickDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ClickDirective, "[mwlClick]", never, { "clickListenerDisabled": "clickListenerDisabled"; }, { "click": "mwlClick"; }, never>;
}

//# sourceMappingURL=click.directive.d.ts.map