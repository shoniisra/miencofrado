import { Renderer2, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { ResizableDirective } from './resizable.directive';
import { Edges } from './interfaces/edges.interface';
/**
 * An element placed inside a `mwlResizable` directive to be used as a drag and resize handle
 *
 * For example
 *
 * ```html
 * <div mwlResizable>
 *   <div mwlResizeHandle [resizeEdges]="{bottom: true, right: true}"></div>
 * </div>
 * ```
 */
import * as ɵngcc0 from '@angular/core';
export declare class ResizeHandleDirective implements OnDestroy {
    private renderer;
    private element;
    private zone;
    private resizable;
    /**
     * The `Edges` object that contains the edges of the parent element that dragging the handle will trigger a resize on
     */
    resizeEdges: Edges;
    private eventListeners;
    constructor(renderer: Renderer2, element: ElementRef, zone: NgZone, resizable: ResizableDirective);
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    onMousedown(event: MouseEvent | TouchEvent, clientX: number, clientY: number): void;
    /**
     * @hidden
     */
    onMouseup(clientX: number, clientY: number): void;
    private onMousemove;
    private unsubscribeEventListeners;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ResizeHandleDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ResizeHandleDirective, "[mwlResizeHandle]", never, { "resizeEdges": "resizeEdges"; }, {}, never>;
}

//# sourceMappingURL=resize-handle.directive.d.ts.map