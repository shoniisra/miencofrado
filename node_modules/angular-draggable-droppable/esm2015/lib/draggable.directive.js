/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, Output, EventEmitter, Input, NgZone, Inject, TemplateRef, ViewContainerRef, Optional, } from '@angular/core';
import { Subject, Observable, merge, ReplaySubject, combineLatest, animationFrameScheduler, fromEvent, } from 'rxjs';
import { map, mergeMap, takeUntil, take, takeLast, pairwise, share, filter, count, startWith, auditTime, } from 'rxjs/operators';
import { DraggableHelper } from './draggable-helper.provider';
import { DOCUMENT } from '@angular/common';
import autoScroll from '@mattlewis92/dom-autoscroller';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
import { addClass, removeClass } from './util';
/**
 * @record
 */
export function Coordinates() { }
if (false) {
    /** @type {?} */
    Coordinates.prototype.x;
    /** @type {?} */
    Coordinates.prototype.y;
}
/**
 * @record
 */
export function DragAxis() { }
if (false) {
    /** @type {?} */
    DragAxis.prototype.x;
    /** @type {?} */
    DragAxis.prototype.y;
}
/**
 * @record
 */
export function SnapGrid() { }
if (false) {
    /** @type {?|undefined} */
    SnapGrid.prototype.x;
    /** @type {?|undefined} */
    SnapGrid.prototype.y;
}
/**
 * @record
 */
export function DragPointerDownEvent() { }
/**
 * @record
 */
export function DragStartEvent() { }
if (false) {
    /** @type {?} */
    DragStartEvent.prototype.cancelDrag$;
}
/**
 * @record
 */
export function DragMoveEvent() { }
/**
 * @record
 */
export function DragEndEvent() { }
if (false) {
    /** @type {?} */
    DragEndEvent.prototype.dragCancelled;
}
/**
 * @record
 */
export function ValidateDragParams() { }
if (false) {
    /** @type {?} */
    ValidateDragParams.prototype.transform;
}
/**
 * @record
 */
export function PointerEvent() { }
if (false) {
    /** @type {?} */
    PointerEvent.prototype.clientX;
    /** @type {?} */
    PointerEvent.prototype.clientY;
    /** @type {?} */
    PointerEvent.prototype.event;
}
/**
 * @record
 */
export function TimeLongPress() { }
if (false) {
    /** @type {?} */
    TimeLongPress.prototype.timerBegin;
    /** @type {?} */
    TimeLongPress.prototype.timerEnd;
}
/**
 * @record
 */
export function GhostElementCreatedEvent() { }
if (false) {
    /** @type {?} */
    GhostElementCreatedEvent.prototype.clientX;
    /** @type {?} */
    GhostElementCreatedEvent.prototype.clientY;
    /** @type {?} */
    GhostElementCreatedEvent.prototype.element;
}
export class DraggableDirective {
    /**
     * @hidden
     * @param {?} element
     * @param {?} renderer
     * @param {?} draggableHelper
     * @param {?} zone
     * @param {?} vcr
     * @param {?} scrollContainer
     * @param {?} document
     */
    constructor(element, renderer, draggableHelper, zone, vcr, scrollContainer, document) {
        this.element = element;
        this.renderer = renderer;
        this.draggableHelper = draggableHelper;
        this.zone = zone;
        this.vcr = vcr;
        this.scrollContainer = scrollContainer;
        this.document = document;
        /**
         * The axis along which the element is draggable
         */
        this.dragAxis = { x: true, y: true };
        /**
         * Snap all drags to an x / y grid
         */
        this.dragSnapGrid = {};
        /**
         * Show a ghost element that shows the drag when dragging
         */
        this.ghostDragEnabled = true;
        /**
         * Show the original element when ghostDragEnabled is true
         */
        this.showOriginalElementWhileDragging = false;
        /**
         * The cursor to use when hovering over a draggable element
         */
        this.dragCursor = '';
        /*
           * Options used to control the behaviour of auto scrolling: https://www.npmjs.com/package/dom-autoscroller
           */
        this.autoScroll = {
            margin: 20,
        };
        /**
         * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
         */
        this.dragPointerDown = new EventEmitter();
        /**
         * Called when the element has started to be dragged.
         * Only called after at least one mouse or touch move event.
         * If you call $event.cancelDrag$.emit() it will cancel the current drag
         */
        this.dragStart = new EventEmitter();
        /**
         * Called after the ghost element has been created
         */
        this.ghostElementCreated = new EventEmitter();
        /**
         * Called when the element is being dragged
         */
        this.dragging = new EventEmitter();
        /**
         * Called after the element is dragged
         */
        this.dragEnd = new EventEmitter();
        /**
         * @hidden
         */
        this.pointerDown$ = new Subject();
        /**
         * @hidden
         */
        this.pointerMove$ = new Subject();
        /**
         * @hidden
         */
        this.pointerUp$ = new Subject();
        this.eventListenerSubscriptions = {};
        this.destroy$ = new Subject();
        this.timeLongPress = { timerBegin: 0, timerEnd: 0 };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.checkEventListeners();
        /** @type {?} */
        const pointerDragged$ = this.pointerDown$.pipe(filter((/**
         * @return {?}
         */
        () => this.canDrag())), mergeMap((/**
         * @param {?} pointerDownEvent
         * @return {?}
         */
        (pointerDownEvent) => {
            // fix for https://github.com/mattlewis92/angular-draggable-droppable/issues/61
            // stop mouse events propagating up the chain
            if (pointerDownEvent.event.stopPropagation && !this.scrollContainer) {
                pointerDownEvent.event.stopPropagation();
            }
            // hack to prevent text getting selected in safari while dragging
            /** @type {?} */
            const globalDragStyle = this.renderer.createElement('style');
            this.renderer.setAttribute(globalDragStyle, 'type', 'text/css');
            this.renderer.appendChild(globalDragStyle, this.renderer.createText(`
          body * {
           -moz-user-select: none;
           -ms-user-select: none;
           -webkit-user-select: none;
           user-select: none;
          }
        `));
            requestAnimationFrame((/**
             * @return {?}
             */
            () => {
                this.document.head.appendChild(globalDragStyle);
            }));
            /** @type {?} */
            const startScrollPosition = this.getScrollPosition();
            /** @type {?} */
            const scrollContainerScroll$ = new Observable((/**
             * @param {?} observer
             * @return {?}
             */
            (observer) => {
                /** @type {?} */
                const scrollContainer = this.scrollContainer
                    ? this.scrollContainer.elementRef.nativeElement
                    : 'window';
                return this.renderer.listen(scrollContainer, 'scroll', (/**
                 * @param {?} e
                 * @return {?}
                 */
                (e) => observer.next(e)));
            })).pipe(startWith(startScrollPosition), map((/**
             * @return {?}
             */
            () => this.getScrollPosition())));
            /** @type {?} */
            const currentDrag$ = new Subject();
            /** @type {?} */
            const cancelDrag$ = new ReplaySubject();
            this.zone.run((/**
             * @return {?}
             */
            () => {
                this.dragPointerDown.next({ x: 0, y: 0 });
            }));
            /** @type {?} */
            const dragComplete$ = merge(this.pointerUp$, this.pointerDown$, cancelDrag$, this.destroy$).pipe(share());
            /** @type {?} */
            const pointerMove = combineLatest([
                this.pointerMove$,
                scrollContainerScroll$,
            ]).pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([pointerMoveEvent, scroll]) => {
                return {
                    currentDrag$,
                    transformX: pointerMoveEvent.clientX - pointerDownEvent.clientX,
                    transformY: pointerMoveEvent.clientY - pointerDownEvent.clientY,
                    clientX: pointerMoveEvent.clientX,
                    clientY: pointerMoveEvent.clientY,
                    scrollLeft: scroll.left,
                    scrollTop: scroll.top,
                };
            })), map((/**
             * @param {?} moveData
             * @return {?}
             */
            (moveData) => {
                if (this.dragSnapGrid.x) {
                    moveData.transformX =
                        Math.round(moveData.transformX / this.dragSnapGrid.x) *
                            this.dragSnapGrid.x;
                }
                if (this.dragSnapGrid.y) {
                    moveData.transformY =
                        Math.round(moveData.transformY / this.dragSnapGrid.y) *
                            this.dragSnapGrid.y;
                }
                return moveData;
            })), map((/**
             * @param {?} moveData
             * @return {?}
             */
            (moveData) => {
                if (!this.dragAxis.x) {
                    moveData.transformX = 0;
                }
                if (!this.dragAxis.y) {
                    moveData.transformY = 0;
                }
                return moveData;
            })), map((/**
             * @param {?} moveData
             * @return {?}
             */
            (moveData) => {
                /** @type {?} */
                const scrollX = moveData.scrollLeft - startScrollPosition.left;
                /** @type {?} */
                const scrollY = moveData.scrollTop - startScrollPosition.top;
                return Object.assign({}, moveData, { x: moveData.transformX + scrollX, y: moveData.transformY + scrollY });
            })), filter((/**
             * @param {?} __0
             * @return {?}
             */
            ({ x, y, transformX, transformY }) => !this.validateDrag ||
                this.validateDrag({
                    x,
                    y,
                    transform: { x: transformX, y: transformY },
                }))), takeUntil(dragComplete$), share());
            /** @type {?} */
            const dragStarted$ = pointerMove.pipe(take(1), share());
            /** @type {?} */
            const dragEnded$ = pointerMove.pipe(takeLast(1), share());
            dragStarted$.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ clientX, clientY, x, y }) => {
                this.zone.run((/**
                 * @return {?}
                 */
                () => {
                    this.dragStart.next({ cancelDrag$ });
                }));
                this.scroller = autoScroll([
                    this.scrollContainer
                        ? this.scrollContainer.elementRef.nativeElement
                        : this.document.defaultView,
                ], Object.assign({}, this.autoScroll, { /**
                     * @return {?}
                     */
                    autoScroll() {
                        return true;
                    } }));
                addClass(this.renderer, this.element, this.dragActiveClass);
                if (this.ghostDragEnabled) {
                    /** @type {?} */
                    const rect = this.element.nativeElement.getBoundingClientRect();
                    /** @type {?} */
                    const clone = (/** @type {?} */ (this.element.nativeElement.cloneNode(true)));
                    if (!this.showOriginalElementWhileDragging) {
                        this.renderer.setStyle(this.element.nativeElement, 'visibility', 'hidden');
                    }
                    if (this.ghostElementAppendTo) {
                        this.ghostElementAppendTo.appendChild(clone);
                    }
                    else {
                        (/** @type {?} */ (this.element.nativeElement.parentNode)).insertBefore(clone, this.element.nativeElement.nextSibling);
                    }
                    this.ghostElement = clone;
                    this.document.body.style.cursor = this.dragCursor;
                    this.setElementStyles(clone, {
                        position: 'fixed',
                        top: `${rect.top}px`,
                        left: `${rect.left}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        cursor: this.dragCursor,
                        margin: '0',
                        willChange: 'transform',
                        pointerEvents: 'none',
                    });
                    if (this.ghostElementTemplate) {
                        /** @type {?} */
                        const viewRef = this.vcr.createEmbeddedView(this.ghostElementTemplate);
                        clone.innerHTML = '';
                        viewRef.rootNodes
                            .filter((/**
                         * @param {?} node
                         * @return {?}
                         */
                        (node) => node instanceof Node))
                            .forEach((/**
                         * @param {?} node
                         * @return {?}
                         */
                        (node) => {
                            clone.appendChild(node);
                        }));
                        dragEnded$.subscribe((/**
                         * @return {?}
                         */
                        () => {
                            this.vcr.remove(this.vcr.indexOf(viewRef));
                        }));
                    }
                    this.zone.run((/**
                     * @return {?}
                     */
                    () => {
                        this.ghostElementCreated.emit({
                            clientX: clientX - x,
                            clientY: clientY - y,
                            element: clone,
                        });
                    }));
                    dragEnded$.subscribe((/**
                     * @return {?}
                     */
                    () => {
                        (/** @type {?} */ (clone.parentElement)).removeChild(clone);
                        this.ghostElement = null;
                        this.renderer.setStyle(this.element.nativeElement, 'visibility', '');
                    }));
                }
                this.draggableHelper.currentDrag.next(currentDrag$);
            }));
            dragEnded$
                .pipe(mergeMap((/**
             * @param {?} dragEndData
             * @return {?}
             */
            (dragEndData) => {
                /** @type {?} */
                const dragEndData$ = cancelDrag$.pipe(count(), take(1), map((/**
                 * @param {?} calledCount
                 * @return {?}
                 */
                (calledCount) => (Object.assign({}, dragEndData, { dragCancelled: calledCount > 0 })))));
                cancelDrag$.complete();
                return dragEndData$;
            })))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ x, y, dragCancelled }) => {
                this.scroller.destroy();
                this.zone.run((/**
                 * @return {?}
                 */
                () => {
                    this.dragEnd.next({ x, y, dragCancelled });
                }));
                removeClass(this.renderer, this.element, this.dragActiveClass);
                currentDrag$.complete();
            }));
            merge(dragComplete$, dragEnded$)
                .pipe(take(1))
                .subscribe((/**
             * @return {?}
             */
            () => {
                requestAnimationFrame((/**
                 * @return {?}
                 */
                () => {
                    this.document.head.removeChild(globalDragStyle);
                }));
            }));
            return pointerMove;
        })), share());
        merge(pointerDragged$.pipe(take(1), map((/**
         * @param {?} value
         * @return {?}
         */
        (value) => [, value]))), pointerDragged$.pipe(pairwise()))
            .pipe(filter((/**
         * @param {?} __0
         * @return {?}
         */
        ([previous, next]) => {
            if (!previous) {
                return true;
            }
            return previous.x !== next.x || previous.y !== next.y;
        })), map((/**
         * @param {?} __0
         * @return {?}
         */
        ([previous, next]) => next)), auditTime(0, animationFrameScheduler))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ x, y, currentDrag$, clientX, clientY, transformX, transformY }) => {
            this.zone.run((/**
             * @return {?}
             */
            () => {
                this.dragging.next({ x, y });
            }));
            if (this.ghostElement) {
                /** @type {?} */
                const transform = `translate3d(${transformX}px, ${transformY}px, 0px)`;
                this.setElementStyles(this.ghostElement, {
                    transform,
                    '-webkit-transform': transform,
                    '-ms-transform': transform,
                    '-moz-transform': transform,
                    '-o-transform': transform,
                });
            }
            currentDrag$.next({
                clientX,
                clientY,
                dropData: this.dropData,
            });
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.dragAxis) {
            this.checkEventListeners();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.unsubscribeEventListeners();
        this.pointerDown$.complete();
        this.pointerMove$.complete();
        this.pointerUp$.complete();
        this.destroy$.next();
    }
    /**
     * @private
     * @return {?}
     */
    checkEventListeners() {
        /** @type {?} */
        const canDrag = this.canDrag();
        /** @type {?} */
        const hasEventListeners = Object.keys(this.eventListenerSubscriptions).length > 0;
        if (canDrag && !hasEventListeners) {
            this.zone.runOutsideAngular((/**
             * @return {?}
             */
            () => {
                this.eventListenerSubscriptions.mousedown = this.renderer.listen(this.element.nativeElement, 'mousedown', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onMouseDown(event);
                }));
                this.eventListenerSubscriptions.mouseup = this.renderer.listen('document', 'mouseup', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onMouseUp(event);
                }));
                this.eventListenerSubscriptions.touchstart = this.renderer.listen(this.element.nativeElement, 'touchstart', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onTouchStart(event);
                }));
                this.eventListenerSubscriptions.touchend = this.renderer.listen('document', 'touchend', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onTouchEnd(event);
                }));
                this.eventListenerSubscriptions.touchcancel = this.renderer.listen('document', 'touchcancel', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onTouchEnd(event);
                }));
                this.eventListenerSubscriptions.mouseenter = this.renderer.listen(this.element.nativeElement, 'mouseenter', (/**
                 * @return {?}
                 */
                () => {
                    this.onMouseEnter();
                }));
                this.eventListenerSubscriptions.mouseleave = this.renderer.listen(this.element.nativeElement, 'mouseleave', (/**
                 * @return {?}
                 */
                () => {
                    this.onMouseLeave();
                }));
            }));
        }
        else if (!canDrag && hasEventListeners) {
            this.unsubscribeEventListeners();
        }
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    onMouseDown(event) {
        if (event.button === 0) {
            if (!this.eventListenerSubscriptions.mousemove) {
                this.eventListenerSubscriptions.mousemove = this.renderer.listen('document', 'mousemove', (/**
                 * @param {?} mouseMoveEvent
                 * @return {?}
                 */
                (mouseMoveEvent) => {
                    this.pointerMove$.next({
                        event: mouseMoveEvent,
                        clientX: mouseMoveEvent.clientX,
                        clientY: mouseMoveEvent.clientY,
                    });
                }));
            }
            this.pointerDown$.next({
                event,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        }
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    onMouseUp(event) {
        if (event.button === 0) {
            if (this.eventListenerSubscriptions.mousemove) {
                this.eventListenerSubscriptions.mousemove();
                delete this.eventListenerSubscriptions.mousemove;
            }
            this.pointerUp$.next({
                event,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        }
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    onTouchStart(event) {
        /** @type {?} */
        let startScrollPosition;
        /** @type {?} */
        let isDragActivated;
        /** @type {?} */
        let hasContainerScrollbar;
        if ((this.scrollContainer && this.scrollContainer.activeLongPressDrag) ||
            this.touchStartLongPress) {
            this.timeLongPress.timerBegin = Date.now();
            isDragActivated = false;
            hasContainerScrollbar = this.hasScrollbar();
            startScrollPosition = this.getScrollPosition();
        }
        if (!this.eventListenerSubscriptions.touchmove) {
            /** @type {?} */
            const contextMenuListener = fromEvent(this.document, 'contextmenu').subscribe((/**
             * @param {?} e
             * @return {?}
             */
            (e) => {
                e.preventDefault();
            }));
            /** @type {?} */
            const touchMoveListener = fromEvent(this.document, 'touchmove', {
                passive: false,
            }).subscribe((/**
             * @param {?} touchMoveEvent
             * @return {?}
             */
            (touchMoveEvent) => {
                if (((this.scrollContainer && this.scrollContainer.activeLongPressDrag) ||
                    this.touchStartLongPress) &&
                    !isDragActivated &&
                    hasContainerScrollbar) {
                    isDragActivated = this.shouldBeginDrag(event, touchMoveEvent, startScrollPosition);
                }
                if (((!this.scrollContainer ||
                    !this.scrollContainer.activeLongPressDrag) &&
                    !this.touchStartLongPress) ||
                    !hasContainerScrollbar ||
                    isDragActivated) {
                    touchMoveEvent.preventDefault();
                    this.pointerMove$.next({
                        event: touchMoveEvent,
                        clientX: touchMoveEvent.targetTouches[0].clientX,
                        clientY: touchMoveEvent.targetTouches[0].clientY,
                    });
                }
            }));
            this.eventListenerSubscriptions.touchmove = (/**
             * @return {?}
             */
            () => {
                contextMenuListener.unsubscribe();
                touchMoveListener.unsubscribe();
            });
        }
        this.pointerDown$.next({
            event,
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
        });
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    onTouchEnd(event) {
        if (this.eventListenerSubscriptions.touchmove) {
            this.eventListenerSubscriptions.touchmove();
            delete this.eventListenerSubscriptions.touchmove;
            if ((this.scrollContainer && this.scrollContainer.activeLongPressDrag) ||
                this.touchStartLongPress) {
                this.enableScroll();
            }
        }
        this.pointerUp$.next({
            event,
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY,
        });
    }
    /**
     * @private
     * @return {?}
     */
    onMouseEnter() {
        this.setCursor(this.dragCursor);
    }
    /**
     * @private
     * @return {?}
     */
    onMouseLeave() {
        this.setCursor('');
    }
    /**
     * @private
     * @return {?}
     */
    canDrag() {
        return this.dragAxis.x || this.dragAxis.y;
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    setCursor(value) {
        if (!this.eventListenerSubscriptions.mousemove) {
            this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
        }
    }
    /**
     * @private
     * @return {?}
     */
    unsubscribeEventListeners() {
        Object.keys(this.eventListenerSubscriptions).forEach((/**
         * @param {?} type
         * @return {?}
         */
        (type) => {
            ((/** @type {?} */ (this))).eventListenerSubscriptions[type]();
            delete ((/** @type {?} */ (this))).eventListenerSubscriptions[type];
        }));
    }
    /**
     * @private
     * @param {?} element
     * @param {?} styles
     * @return {?}
     */
    setElementStyles(element, styles) {
        Object.keys(styles).forEach((/**
         * @param {?} key
         * @return {?}
         */
        (key) => {
            this.renderer.setStyle(element, key, styles[key]);
        }));
    }
    /**
     * @private
     * @return {?}
     */
    getScrollElement() {
        if (this.scrollContainer) {
            return this.scrollContainer.elementRef.nativeElement;
        }
        else {
            return this.document.body;
        }
    }
    /**
     * @private
     * @return {?}
     */
    getScrollPosition() {
        if (this.scrollContainer) {
            return {
                top: this.scrollContainer.elementRef.nativeElement.scrollTop,
                left: this.scrollContainer.elementRef.nativeElement.scrollLeft,
            };
        }
        else {
            return {
                top: window.pageYOffset || this.document.documentElement.scrollTop,
                left: window.pageXOffset || this.document.documentElement.scrollLeft,
            };
        }
    }
    /**
     * @private
     * @param {?} event
     * @param {?} touchMoveEvent
     * @param {?} startScrollPosition
     * @return {?}
     */
    shouldBeginDrag(event, touchMoveEvent, startScrollPosition) {
        /** @type {?} */
        const moveScrollPosition = this.getScrollPosition();
        /** @type {?} */
        const deltaScroll = {
            top: Math.abs(moveScrollPosition.top - startScrollPosition.top),
            left: Math.abs(moveScrollPosition.left - startScrollPosition.left),
        };
        /** @type {?} */
        const deltaX = Math.abs(touchMoveEvent.targetTouches[0].clientX - event.touches[0].clientX) - deltaScroll.left;
        /** @type {?} */
        const deltaY = Math.abs(touchMoveEvent.targetTouches[0].clientY - event.touches[0].clientY) - deltaScroll.top;
        /** @type {?} */
        const deltaTotal = deltaX + deltaY;
        /** @type {?} */
        const longPressConfig = this.touchStartLongPress
            ? this.touchStartLongPress
            : /* istanbul ignore next */
                {
                    delta: this.scrollContainer.longPressConfig.delta,
                    delay: this.scrollContainer.longPressConfig.duration,
                };
        if (deltaTotal > longPressConfig.delta ||
            deltaScroll.top > 0 ||
            deltaScroll.left > 0) {
            this.timeLongPress.timerBegin = Date.now();
        }
        this.timeLongPress.timerEnd = Date.now();
        /** @type {?} */
        const duration = this.timeLongPress.timerEnd - this.timeLongPress.timerBegin;
        if (duration >= longPressConfig.delay) {
            this.disableScroll();
            return true;
        }
        return false;
    }
    /**
     * @private
     * @return {?}
     */
    enableScroll() {
        if (this.scrollContainer) {
            this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', '');
        }
        this.renderer.setStyle(this.document.body, 'overflow', '');
    }
    /**
     * @private
     * @return {?}
     */
    disableScroll() {
        /* istanbul ignore next */
        if (this.scrollContainer) {
            this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', 'hidden');
        }
        this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    }
    /**
     * @private
     * @return {?}
     */
    hasScrollbar() {
        /** @type {?} */
        const scrollContainer = this.getScrollElement();
        /** @type {?} */
        const containerHasHorizontalScroll = scrollContainer.scrollWidth > scrollContainer.clientWidth;
        /** @type {?} */
        const containerHasVerticalScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight;
        return containerHasHorizontalScroll || containerHasVerticalScroll;
    }
}
DraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlDraggable]',
            },] }
];
/** @nocollapse */
DraggableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: DraggableHelper },
    { type: NgZone },
    { type: ViewContainerRef },
    { type: DraggableScrollContainerDirective, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
DraggableDirective.propDecorators = {
    dropData: [{ type: Input }],
    dragAxis: [{ type: Input }],
    dragSnapGrid: [{ type: Input }],
    ghostDragEnabled: [{ type: Input }],
    showOriginalElementWhileDragging: [{ type: Input }],
    validateDrag: [{ type: Input }],
    dragCursor: [{ type: Input }],
    dragActiveClass: [{ type: Input }],
    ghostElementAppendTo: [{ type: Input }],
    ghostElementTemplate: [{ type: Input }],
    touchStartLongPress: [{ type: Input }],
    autoScroll: [{ type: Input }],
    dragPointerDown: [{ type: Output }],
    dragStart: [{ type: Output }],
    ghostElementCreated: [{ type: Output }],
    dragging: [{ type: Output }],
    dragEnd: [{ type: Output }]
};
if (false) {
    /**
     * an object of data you can pass to the drop event
     * @type {?}
     */
    DraggableDirective.prototype.dropData;
    /**
     * The axis along which the element is draggable
     * @type {?}
     */
    DraggableDirective.prototype.dragAxis;
    /**
     * Snap all drags to an x / y grid
     * @type {?}
     */
    DraggableDirective.prototype.dragSnapGrid;
    /**
     * Show a ghost element that shows the drag when dragging
     * @type {?}
     */
    DraggableDirective.prototype.ghostDragEnabled;
    /**
     * Show the original element when ghostDragEnabled is true
     * @type {?}
     */
    DraggableDirective.prototype.showOriginalElementWhileDragging;
    /**
     * Allow custom behaviour to control when the element is dragged
     * @type {?}
     */
    DraggableDirective.prototype.validateDrag;
    /**
     * The cursor to use when hovering over a draggable element
     * @type {?}
     */
    DraggableDirective.prototype.dragCursor;
    /**
     * The css class to apply when the element is being dragged
     * @type {?}
     */
    DraggableDirective.prototype.dragActiveClass;
    /**
     * The element the ghost element will be appended to. Default is next to the dragged element
     * @type {?}
     */
    DraggableDirective.prototype.ghostElementAppendTo;
    /**
     * An ng-template to be inserted into the parent element of the ghost element. It will overwrite any child nodes.
     * @type {?}
     */
    DraggableDirective.prototype.ghostElementTemplate;
    /**
     * Amount of milliseconds to wait on touch devices before starting to drag the element (so that you can scroll the page by touching a draggable element)
     * @type {?}
     */
    DraggableDirective.prototype.touchStartLongPress;
    /** @type {?} */
    DraggableDirective.prototype.autoScroll;
    /**
     * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
     * @type {?}
     */
    DraggableDirective.prototype.dragPointerDown;
    /**
     * Called when the element has started to be dragged.
     * Only called after at least one mouse or touch move event.
     * If you call $event.cancelDrag$.emit() it will cancel the current drag
     * @type {?}
     */
    DraggableDirective.prototype.dragStart;
    /**
     * Called after the ghost element has been created
     * @type {?}
     */
    DraggableDirective.prototype.ghostElementCreated;
    /**
     * Called when the element is being dragged
     * @type {?}
     */
    DraggableDirective.prototype.dragging;
    /**
     * Called after the element is dragged
     * @type {?}
     */
    DraggableDirective.prototype.dragEnd;
    /**
     * @hidden
     * @type {?}
     */
    DraggableDirective.prototype.pointerDown$;
    /**
     * @hidden
     * @type {?}
     */
    DraggableDirective.prototype.pointerMove$;
    /**
     * @hidden
     * @type {?}
     */
    DraggableDirective.prototype.pointerUp$;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.eventListenerSubscriptions;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.ghostElement;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.destroy$;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.timeLongPress;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.scroller;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.element;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.renderer;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.draggableHelper;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.zone;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.vcr;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.scrollContainer;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.document;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULFVBQVUsRUFDVixTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUVOLE1BQU0sRUFDTixXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsT0FBTyxFQUNQLFVBQVUsRUFDVixLQUFLLEVBQ0wsYUFBYSxFQUNiLGFBQWEsRUFDYix1QkFBdUIsRUFDdkIsU0FBUyxHQUNWLE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUNMLEdBQUcsRUFDSCxRQUFRLEVBQ1IsU0FBUyxFQUNULElBQUksRUFDSixRQUFRLEVBQ1IsUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxTQUFTLEdBQ1YsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQW1CLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQy9FLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLFVBQVUsTUFBTSwrQkFBK0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMzRixPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLFFBQVEsQ0FBQzs7OztBQUUvQyxpQ0FHQzs7O0lBRkMsd0JBQVU7O0lBQ1Ysd0JBQVU7Ozs7O0FBR1osOEJBR0M7OztJQUZDLHFCQUFXOztJQUNYLHFCQUFXOzs7OztBQUdiLDhCQUdDOzs7SUFGQyxxQkFBVzs7SUFDWCxxQkFBVzs7Ozs7QUFHYiwwQ0FB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QUFNO3VCQUtOLE1BQU07c0JBS04sTUFBTTs7Ozs7OztJQTVGUCxzQ0FBdUI7Ozs7O0lBS3ZCLHNDQUFtRDs7Ozs7SUFLbkQsMENBQXFDOzs7OztJQUtyQyw4Q0FBMEM7Ozs7O0lBSzFDLDhEQUEyRDs7Ozs7SUFLM0QsMENBQW9DOzs7OztJQUtwQyx3Q0FBaUM7Ozs7O0lBS2pDLDZDQUFpQzs7Ozs7SUFLakMsa0RBQTJDOzs7OztJQUszQyxrREFBZ0Q7Ozs7O0lBS2hELGlEQUErRDs7SUFLL0Qsd0NBVUU7Ozs7O0lBS0YsNkNBQXFFOzs7Ozs7O0lBT3JFLHVDQUF5RDs7Ozs7SUFLekQsaURBQTZFOzs7OztJQUs3RSxzQ0FBdUQ7Ozs7O0lBS3ZELHFDQUFxRDs7Ozs7SUFLckQsMENBQTJDOzs7OztJQUszQywwQ0FBMkM7Ozs7O0lBSzNDLHdDQUF5Qzs7Ozs7SUFFekMsd0RBVU87Ozs7O0lBRVAsMENBQXlDOzs7OztJQUV6QyxzQ0FBaUM7Ozs7O0lBRWpDLDJDQUFzRTs7Ozs7SUFFdEUsc0NBQTBDOzs7OztJQU14QyxxQ0FBd0M7Ozs7O0lBQ3hDLHNDQUEyQjs7Ozs7SUFDM0IsNkNBQXdDOzs7OztJQUN4QyxrQ0FBb0I7Ozs7O0lBQ3BCLGlDQUE2Qjs7Ozs7SUFDN0IsNkNBQXNFOzs7OztJQUN0RSxzQ0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIE9uSW5pdCxcbiAgRWxlbWVudFJlZixcbiAgUmVuZGVyZXIyLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25DaGFuZ2VzLFxuICBOZ1pvbmUsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEluamVjdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIE9wdGlvbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIFN1YmplY3QsXG4gIE9ic2VydmFibGUsXG4gIG1lcmdlLFxuICBSZXBsYXlTdWJqZWN0LFxuICBjb21iaW5lTGF0ZXN0LFxuICBhbmltYXRpb25GcmFtZVNjaGVkdWxlcixcbiAgZnJvbUV2ZW50LFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHRha2VVbnRpbCxcbiAgdGFrZSxcbiAgdGFrZUxhc3QsXG4gIHBhaXJ3aXNlLFxuICBzaGFyZSxcbiAgZmlsdGVyLFxuICBjb3VudCxcbiAgc3RhcnRXaXRoLFxuICBhdWRpdFRpbWUsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEN1cnJlbnREcmFnRGF0YSwgRHJhZ2dhYmxlSGVscGVyIH0gZnJvbSAnLi9kcmFnZ2FibGUtaGVscGVyLnByb3ZpZGVyJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCBhdXRvU2Nyb2xsIGZyb20gJ0BtYXR0bGV3aXM5Mi9kb20tYXV0b3Njcm9sbGVyJztcbmltcG9ydCB7IERyYWdnYWJsZVNjcm9sbENvbnRhaW5lckRpcmVjdGl2ZSB9IGZyb20gJy4vZHJhZ2dhYmxlLXNjcm9sbC1jb250YWluZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IGFkZENsYXNzLCByZW1vdmVDbGFzcyB9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29vcmRpbmF0ZXMge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnQXhpcyB7XG4gIHg6IGJvb2xlYW47XG4gIHk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU25hcEdyaWQge1xuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdQb2ludGVyRG93bkV2ZW50IGV4dGVuZHMgQ29vcmRpbmF0ZXMge31cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnU3RhcnRFdmVudCB7XG4gIGNhbmNlbERyYWckOiBSZXBsYXlTdWJqZWN0PHZvaWQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdNb3ZlRXZlbnQgZXh0ZW5kcyBDb29yZGluYXRlcyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdFbmRFdmVudCBleHRlbmRzIENvb3JkaW5hdGVzIHtcbiAgZHJhZ0NhbmNlbGxlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0ZURyYWdQYXJhbXMgZXh0ZW5kcyBDb29yZGluYXRlcyB7XG4gIHRyYW5zZm9ybToge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gIH07XG59XG5cbmV4cG9ydCB0eXBlIFZhbGlkYXRlRHJhZyA9IChwYXJhbXM6IFZhbGlkYXRlRHJhZ1BhcmFtcykgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGludGVyZmFjZSBQb2ludGVyRXZlbnQge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVMb25nUHJlc3Mge1xuICB0aW1lckJlZ2luOiBudW1iZXI7XG4gIHRpbWVyRW5kOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2hvc3RFbGVtZW50Q3JlYXRlZEV2ZW50IHtcbiAgY2xpZW50WDogbnVtYmVyO1xuICBjbGllbnRZOiBudW1iZXI7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbXdsRHJhZ2dhYmxlXScsXG59KVxuZXhwb3J0IGNsYXNzIERyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogYW4gb2JqZWN0IG9mIGRhdGEgeW91IGNhbiBwYXNzIHRvIHRoZSBkcm9wIGV2ZW50XG4gICAqL1xuICBASW5wdXQoKSBkcm9wRGF0YTogYW55O1xuXG4gIC8qKlxuICAgKiBUaGUgYXhpcyBhbG9uZyB3aGljaCB0aGUgZWxlbWVudCBpcyBkcmFnZ2FibGVcbiAgICovXG4gIEBJbnB1dCgpIGRyYWdBeGlzOiBEcmFnQXhpcyA9IHsgeDogdHJ1ZSwgeTogdHJ1ZSB9O1xuXG4gIC8qKlxuICAgKiBTbmFwIGFsbCBkcmFncyB0byBhbiB4IC8geSBncmlkXG4gICAqL1xuICBASW5wdXQoKSBkcmFnU25hcEdyaWQ6IFNuYXBHcmlkID0ge307XG5cbiAgLyoqXG4gICAqIFNob3cgYSBnaG9zdCBlbGVtZW50IHRoYXQgc2hvd3MgdGhlIGRyYWcgd2hlbiBkcmFnZ2luZ1xuICAgKi9cbiAgQElucHV0KCkgZ2hvc3REcmFnRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIG9yaWdpbmFsIGVsZW1lbnQgd2hlbiBnaG9zdERyYWdFbmFibGVkIGlzIHRydWVcbiAgICovXG4gIEBJbnB1dCgpIHNob3dPcmlnaW5hbEVsZW1lbnRXaGlsZURyYWdnaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEFsbG93IGN1c3RvbSBiZWhhdmlvdXIgdG8gY29udHJvbCB3aGVuIHRoZSBlbGVtZW50IGlzIGRyYWdnZWRcbiAgICovXG4gIEBJbnB1dCgpIHZhbGlkYXRlRHJhZzogVmFsaWRhdGVEcmFnO1xuXG4gIC8qKlxuICAgKiBUaGUgY3Vyc29yIHRvIHVzZSB3aGVuIGhvdmVyaW5nIG92ZXIgYSBkcmFnZ2FibGUgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KCkgZHJhZ0N1cnNvcjogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIFRoZSBjc3MgY2xhc3MgdG8gYXBwbHkgd2hlbiB0aGUgZWxlbWVudCBpcyBiZWluZyBkcmFnZ2VkXG4gICAqL1xuICBASW5wdXQoKSBkcmFnQWN0aXZlQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGVsZW1lbnQgdGhlIGdob3N0IGVsZW1lbnQgd2lsbCBiZSBhcHBlbmRlZCB0by4gRGVmYXVsdCBpcyBuZXh0IHRvIHRoZSBkcmFnZ2VkIGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpIGdob3N0RWxlbWVudEFwcGVuZFRvOiBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogQW4gbmctdGVtcGxhdGUgdG8gYmUgaW5zZXJ0ZWQgaW50byB0aGUgcGFyZW50IGVsZW1lbnQgb2YgdGhlIGdob3N0IGVsZW1lbnQuIEl0IHdpbGwgb3ZlcndyaXRlIGFueSBjaGlsZCBub2Rlcy5cbiAgICovXG4gIEBJbnB1dCgpIGdob3N0RWxlbWVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgb24gdG91Y2ggZGV2aWNlcyBiZWZvcmUgc3RhcnRpbmcgdG8gZHJhZyB0aGUgZWxlbWVudCAoc28gdGhhdCB5b3UgY2FuIHNjcm9sbCB0aGUgcGFnZSBieSB0b3VjaGluZyBhIGRyYWdnYWJsZSBlbGVtZW50KVxuICAgKi9cbiAgQElucHV0KCkgdG91Y2hTdGFydExvbmdQcmVzczogeyBkZWxheTogbnVtYmVyOyBkZWx0YTogbnVtYmVyIH07XG5cbiAgLypcbiAgICogT3B0aW9ucyB1c2VkIHRvIGNvbnRyb2wgdGhlIGJlaGF2aW91ciBvZiBhdXRvIHNjcm9sbGluZzogaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvZG9tLWF1dG9zY3JvbGxlclxuICAgKi9cbiAgQElucHV0KCkgYXV0b1Njcm9sbDoge1xuICAgIG1hcmdpbjpcbiAgICAgIHwgbnVtYmVyXG4gICAgICB8IHsgdG9wPzogbnVtYmVyOyBsZWZ0PzogbnVtYmVyOyByaWdodD86IG51bWJlcjsgYm90dG9tPzogbnVtYmVyIH07XG4gICAgbWF4U3BlZWQ/OlxuICAgICAgfCBudW1iZXJcbiAgICAgIHwgeyB0b3A/OiBudW1iZXI7IGxlZnQ/OiBudW1iZXI7IHJpZ2h0PzogbnVtYmVyOyBib3R0b20/OiBudW1iZXIgfTtcbiAgICBzY3JvbGxXaGVuT3V0c2lkZT86IGJvb2xlYW47XG4gIH0gPSB7XG4gICAgbWFyZ2luOiAyMCxcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgY2FuIGJlIGRyYWdnZWQgYWxvbmcgb25lIGF4aXMgYW5kIGhhcyB0aGUgbW91c2Ugb3IgcG9pbnRlciBkZXZpY2UgcHJlc3NlZCBvbiBpdFxuICAgKi9cbiAgQE91dHB1dCgpIGRyYWdQb2ludGVyRG93biA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ1BvaW50ZXJEb3duRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBlbGVtZW50IGhhcyBzdGFydGVkIHRvIGJlIGRyYWdnZWQuXG4gICAqIE9ubHkgY2FsbGVkIGFmdGVyIGF0IGxlYXN0IG9uZSBtb3VzZSBvciB0b3VjaCBtb3ZlIGV2ZW50LlxuICAgKiBJZiB5b3UgY2FsbCAkZXZlbnQuY2FuY2VsRHJhZyQuZW1pdCgpIGl0IHdpbGwgY2FuY2VsIHRoZSBjdXJyZW50IGRyYWdcbiAgICovXG4gIEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdTdGFydEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGdob3N0IGVsZW1lbnQgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgQE91dHB1dCgpIGdob3N0RWxlbWVudENyZWF0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdob3N0RWxlbWVudENyZWF0ZWRFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgaXMgYmVpbmcgZHJhZ2dlZFxuICAgKi9cbiAgQE91dHB1dCgpIGRyYWdnaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxEcmFnTW92ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGVsZW1lbnQgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQE91dHB1dCgpIGRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdFbmRFdmVudD4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcG9pbnRlckRvd24kID0gbmV3IFN1YmplY3Q8UG9pbnRlckV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwb2ludGVyTW92ZSQgPSBuZXcgU3ViamVjdDxQb2ludGVyRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHBvaW50ZXJVcCQgPSBuZXcgU3ViamVjdDxQb2ludGVyRXZlbnQ+KCk7XG5cbiAgcHJpdmF0ZSBldmVudExpc3RlbmVyU3Vic2NyaXB0aW9uczoge1xuICAgIG1vdXNlbW92ZT86ICgpID0+IHZvaWQ7XG4gICAgbW91c2Vkb3duPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZXVwPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZWVudGVyPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZWxlYXZlPzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaHN0YXJ0PzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaG1vdmU/OiAoKSA9PiB2b2lkO1xuICAgIHRvdWNoZW5kPzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaGNhbmNlbD86ICgpID0+IHZvaWQ7XG4gIH0gPSB7fTtcblxuICBwcml2YXRlIGdob3N0RWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuXG4gIHByaXZhdGUgdGltZUxvbmdQcmVzczogVGltZUxvbmdQcmVzcyA9IHsgdGltZXJCZWdpbjogMCwgdGltZXJFbmQ6IDAgfTtcblxuICBwcml2YXRlIHNjcm9sbGVyOiB7IGRlc3Ryb3k6ICgpID0+IHZvaWQgfTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBkcmFnZ2FibGVIZWxwZXI6IERyYWdnYWJsZUhlbHBlcixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHZjcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHNjcm9sbENvbnRhaW5lcjogRHJhZ2dhYmxlU2Nyb2xsQ29udGFpbmVyRGlyZWN0aXZlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja0V2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICBjb25zdCBwb2ludGVyRHJhZ2dlZCQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMucG9pbnRlckRvd24kLnBpcGUoXG4gICAgICBmaWx0ZXIoKCkgPT4gdGhpcy5jYW5EcmFnKCkpLFxuICAgICAgbWVyZ2VNYXAoKHBvaW50ZXJEb3duRXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgICAvLyBmaXggZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0bGV3aXM5Mi9hbmd1bGFyLWRyYWdnYWJsZS1kcm9wcGFibGUvaXNzdWVzLzYxXG4gICAgICAgIC8vIHN0b3AgbW91c2UgZXZlbnRzIHByb3BhZ2F0aW5nIHVwIHRoZSBjaGFpblxuICAgICAgICBpZiAocG9pbnRlckRvd25FdmVudC5ldmVudC5zdG9wUHJvcGFnYXRpb24gJiYgIXRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICAgICAgcG9pbnRlckRvd25FdmVudC5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhY2sgdG8gcHJldmVudCB0ZXh0IGdldHRpbmcgc2VsZWN0ZWQgaW4gc2FmYXJpIHdoaWxlIGRyYWdnaW5nXG4gICAgICAgIGNvbnN0IGdsb2JhbERyYWdTdHlsZTogSFRNTFN0eWxlRWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnc3R5bGUnXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGdsb2JhbERyYWdTdHlsZSwgJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZChcbiAgICAgICAgICBnbG9iYWxEcmFnU3R5bGUsXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5jcmVhdGVUZXh0KGBcbiAgICAgICAgICBib2R5ICoge1xuICAgICAgICAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgIH1cbiAgICAgICAgYClcbiAgICAgICAgKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZ2xvYmFsRHJhZ1N0eWxlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc3RhcnRTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcblxuICAgICAgICBjb25zdCBzY3JvbGxDb250YWluZXJTY3JvbGwkID0gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVyID0gdGhpcy5zY3JvbGxDb250YWluZXJcbiAgICAgICAgICAgID8gdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgICA6ICd3aW5kb3cnO1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3RlbihzY3JvbGxDb250YWluZXIsICdzY3JvbGwnLCAoZSkgPT5cbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZSlcbiAgICAgICAgICApO1xuICAgICAgICB9KS5waXBlKFxuICAgICAgICAgIHN0YXJ0V2l0aChzdGFydFNjcm9sbFBvc2l0aW9uKSxcbiAgICAgICAgICBtYXAoKCkgPT4gdGhpcy5nZXRTY3JvbGxQb3NpdGlvbigpKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnREcmFnJCA9IG5ldyBTdWJqZWN0PEN1cnJlbnREcmFnRGF0YT4oKTtcbiAgICAgICAgY29uc3QgY2FuY2VsRHJhZyQgPSBuZXcgUmVwbGF5U3ViamVjdDx2b2lkPigpO1xuXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZHJhZ1BvaW50ZXJEb3duLm5leHQoeyB4OiAwLCB5OiAwIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBkcmFnQ29tcGxldGUkID0gbWVyZ2UoXG4gICAgICAgICAgdGhpcy5wb2ludGVyVXAkLFxuICAgICAgICAgIHRoaXMucG9pbnRlckRvd24kLFxuICAgICAgICAgIGNhbmNlbERyYWckLFxuICAgICAgICAgIHRoaXMuZGVzdHJveSRcbiAgICAgICAgKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgICAgIGNvbnN0IHBvaW50ZXJNb3ZlID0gY29tYmluZUxhdGVzdChbXG4gICAgICAgICAgdGhpcy5wb2ludGVyTW92ZSQsXG4gICAgICAgICAgc2Nyb2xsQ29udGFpbmVyU2Nyb2xsJCxcbiAgICAgICAgXSkucGlwZShcbiAgICAgICAgICBtYXAoKFtwb2ludGVyTW92ZUV2ZW50LCBzY3JvbGxdKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBjdXJyZW50RHJhZyQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybVg6IHBvaW50ZXJNb3ZlRXZlbnQuY2xpZW50WCAtIHBvaW50ZXJEb3duRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtWTogcG9pbnRlck1vdmVFdmVudC5jbGllbnRZIC0gcG9pbnRlckRvd25FdmVudC5jbGllbnRZLFxuICAgICAgICAgICAgICBjbGllbnRYOiBwb2ludGVyTW92ZUV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFk6IHBvaW50ZXJNb3ZlRXZlbnQuY2xpZW50WSxcbiAgICAgICAgICAgICAgc2Nyb2xsTGVmdDogc2Nyb2xsLmxlZnQsXG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogc2Nyb2xsLnRvcCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbWFwKChtb3ZlRGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1NuYXBHcmlkLngpIHtcbiAgICAgICAgICAgICAgbW92ZURhdGEudHJhbnNmb3JtWCA9XG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZChtb3ZlRGF0YS50cmFuc2Zvcm1YIC8gdGhpcy5kcmFnU25hcEdyaWQueCkgKlxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1NuYXBHcmlkLng7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdTbmFwR3JpZC55KSB7XG4gICAgICAgICAgICAgIG1vdmVEYXRhLnRyYW5zZm9ybVkgPVxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQobW92ZURhdGEudHJhbnNmb3JtWSAvIHRoaXMuZHJhZ1NuYXBHcmlkLnkpICpcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdTbmFwR3JpZC55O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW92ZURhdGE7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbWFwKChtb3ZlRGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYWdBeGlzLngpIHtcbiAgICAgICAgICAgICAgbW92ZURhdGEudHJhbnNmb3JtWCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcmFnQXhpcy55KSB7XG4gICAgICAgICAgICAgIG1vdmVEYXRhLnRyYW5zZm9ybVkgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW92ZURhdGE7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbWFwKChtb3ZlRGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsWCA9IG1vdmVEYXRhLnNjcm9sbExlZnQgLSBzdGFydFNjcm9sbFBvc2l0aW9uLmxlZnQ7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxZID0gbW92ZURhdGEuc2Nyb2xsVG9wIC0gc3RhcnRTY3JvbGxQb3NpdGlvbi50b3A7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5tb3ZlRGF0YSxcbiAgICAgICAgICAgICAgeDogbW92ZURhdGEudHJhbnNmb3JtWCArIHNjcm9sbFgsXG4gICAgICAgICAgICAgIHk6IG1vdmVEYXRhLnRyYW5zZm9ybVkgKyBzY3JvbGxZLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgICAoeyB4LCB5LCB0cmFuc2Zvcm1YLCB0cmFuc2Zvcm1ZIH0pID0+XG4gICAgICAgICAgICAgICF0aGlzLnZhbGlkYXRlRHJhZyB8fFxuICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRHJhZyh7XG4gICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogeyB4OiB0cmFuc2Zvcm1YLCB5OiB0cmFuc2Zvcm1ZIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgKSxcbiAgICAgICAgICB0YWtlVW50aWwoZHJhZ0NvbXBsZXRlJCksXG4gICAgICAgICAgc2hhcmUoKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGRyYWdTdGFydGVkJCA9IHBvaW50ZXJNb3ZlLnBpcGUodGFrZSgxKSwgc2hhcmUoKSk7XG4gICAgICAgIGNvbnN0IGRyYWdFbmRlZCQgPSBwb2ludGVyTW92ZS5waXBlKHRha2VMYXN0KDEpLCBzaGFyZSgpKTtcblxuICAgICAgICBkcmFnU3RhcnRlZCQuc3Vic2NyaWJlKCh7IGNsaWVudFgsIGNsaWVudFksIHgsIHkgfSkgPT4ge1xuICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnQubmV4dCh7IGNhbmNlbERyYWckIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5zY3JvbGxlciA9IGF1dG9TY3JvbGwoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgPyB0aGlzLnNjcm9sbENvbnRhaW5lci5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgICAgICA6IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAuLi50aGlzLmF1dG9TY3JvbGwsXG4gICAgICAgICAgICAgIGF1dG9TY3JvbGwoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgICBhZGRDbGFzcyh0aGlzLnJlbmRlcmVyLCB0aGlzLmVsZW1lbnQsIHRoaXMuZHJhZ0FjdGl2ZUNsYXNzKTtcblxuICAgICAgICAgIGlmICh0aGlzLmdob3N0RHJhZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xvbmVOb2RlKFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNob3dPcmlnaW5hbEVsZW1lbnRXaGlsZURyYWdnaW5nKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgICAgICdoaWRkZW4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdob3N0RWxlbWVudEFwcGVuZFRvKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50QXBwZW5kVG8uYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgIGNsb25lLFxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50ID0gY2xvbmU7XG5cbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSB0aGlzLmRyYWdDdXJzb3I7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudFN0eWxlcyhjbG9uZSwge1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgdG9wOiBgJHtyZWN0LnRvcH1weGAsXG4gICAgICAgICAgICAgIGxlZnQ6IGAke3JlY3QubGVmdH1weGAsXG4gICAgICAgICAgICAgIHdpZHRoOiBgJHtyZWN0LndpZHRofXB4YCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtyZWN0LmhlaWdodH1weGAsXG4gICAgICAgICAgICAgIGN1cnNvcjogdGhpcy5kcmFnQ3Vyc29yLFxuICAgICAgICAgICAgICBtYXJnaW46ICcwJyxcbiAgICAgICAgICAgICAgd2lsbENoYW5nZTogJ3RyYW5zZm9ybScsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnRUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy52Y3IuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50VGVtcGxhdGVcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgY2xvbmUuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgIHZpZXdSZWYucm9vdE5vZGVzXG4gICAgICAgICAgICAgICAgLmZpbHRlcigobm9kZSkgPT4gbm9kZSBpbnN0YW5jZW9mIE5vZGUpXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNsb25lLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBkcmFnRW5kZWQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52Y3IucmVtb3ZlKHRoaXMudmNyLmluZGV4T2Yodmlld1JlZikpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50Q3JlYXRlZC5lbWl0KHtcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBjbGllbnRYIC0geCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBjbGllbnRZIC0geSxcbiAgICAgICAgICAgICAgICBlbGVtZW50OiBjbG9uZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZHJhZ0VuZGVkJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBjbG9uZS5wYXJlbnRFbGVtZW50IS5yZW1vdmVDaGlsZChjbG9uZSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAndmlzaWJpbGl0eScsXG4gICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlSGVscGVyLmN1cnJlbnREcmFnLm5leHQoY3VycmVudERyYWckKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ0VuZGVkJFxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgbWVyZ2VNYXAoKGRyYWdFbmREYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGRyYWdFbmREYXRhJCA9IGNhbmNlbERyYWckLnBpcGUoXG4gICAgICAgICAgICAgICAgY291bnQoKSxcbiAgICAgICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgICAgIG1hcCgoY2FsbGVkQ291bnQpID0+ICh7XG4gICAgICAgICAgICAgICAgICAuLi5kcmFnRW5kRGF0YSxcbiAgICAgICAgICAgICAgICAgIGRyYWdDYW5jZWxsZWQ6IGNhbGxlZENvdW50ID4gMCxcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgY2FuY2VsRHJhZyQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGRyYWdFbmREYXRhJDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKHsgeCwgeSwgZHJhZ0NhbmNlbGxlZCB9KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmRyYWdFbmQubmV4dCh7IHgsIHksIGRyYWdDYW5jZWxsZWQgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKHRoaXMucmVuZGVyZXIsIHRoaXMuZWxlbWVudCwgdGhpcy5kcmFnQWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgY3VycmVudERyYWckLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgbWVyZ2UoZHJhZ0NvbXBsZXRlJCwgZHJhZ0VuZGVkJClcbiAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5kb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKGdsb2JhbERyYWdTdHlsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcG9pbnRlck1vdmU7XG4gICAgICB9KSxcbiAgICAgIHNoYXJlKClcbiAgICApO1xuXG4gICAgbWVyZ2UoXG4gICAgICBwb2ludGVyRHJhZ2dlZCQucGlwZShcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgbWFwKCh2YWx1ZSkgPT4gWywgdmFsdWVdKVxuICAgICAgKSxcbiAgICAgIHBvaW50ZXJEcmFnZ2VkJC5waXBlKHBhaXJ3aXNlKCkpXG4gICAgKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoW3ByZXZpb3VzLCBuZXh0XSkgPT4ge1xuICAgICAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcHJldmlvdXMueCAhPT0gbmV4dC54IHx8IHByZXZpb3VzLnkgIT09IG5leHQueTtcbiAgICAgICAgfSksXG4gICAgICAgIG1hcCgoW3ByZXZpb3VzLCBuZXh0XSkgPT4gbmV4dCksXG4gICAgICAgIGF1ZGl0VGltZSgwLCBhbmltYXRpb25GcmFtZVNjaGVkdWxlcilcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICh7IHgsIHksIGN1cnJlbnREcmFnJCwgY2xpZW50WCwgY2xpZW50WSwgdHJhbnNmb3JtWCwgdHJhbnNmb3JtWSB9KSA9PiB7XG4gICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nLm5leHQoeyB4LCB5IH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh0aGlzLmdob3N0RWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7dHJhbnNmb3JtWH1weCwgJHt0cmFuc2Zvcm1ZfXB4LCAwcHgpYDtcbiAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudFN0eWxlcyh0aGlzLmdob3N0RWxlbWVudCwge1xuICAgICAgICAgICAgICB0cmFuc2Zvcm0sXG4gICAgICAgICAgICAgICctd2Via2l0LXRyYW5zZm9ybSc6IHRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgJy1tcy10cmFuc2Zvcm0nOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICAgICctbW96LXRyYW5zZm9ybSc6IHRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgJy1vLXRyYW5zZm9ybSc6IHRyYW5zZm9ybSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50RHJhZyQubmV4dCh7XG4gICAgICAgICAgICBjbGllbnRYLFxuICAgICAgICAgICAgY2xpZW50WSxcbiAgICAgICAgICAgIGRyb3BEYXRhOiB0aGlzLmRyb3BEYXRhLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLmRyYWdBeGlzKSB7XG4gICAgICB0aGlzLmNoZWNrRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnBvaW50ZXJEb3duJC5jb21wbGV0ZSgpO1xuICAgIHRoaXMucG9pbnRlck1vdmUkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5wb2ludGVyVXAkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgY29uc3QgY2FuRHJhZzogYm9vbGVhbiA9IHRoaXMuY2FuRHJhZygpO1xuICAgIGNvbnN0IGhhc0V2ZW50TGlzdGVuZXJzOiBib29sZWFuID1cbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMpLmxlbmd0aCA+IDA7XG5cbiAgICBpZiAoY2FuRHJhZyAmJiAhaGFzRXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vkb3duID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ21vdXNlZG93bicsXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VEb3duKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZXVwID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAnbW91c2V1cCcsXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VVcChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2hzdGFydCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaFN0YXJ0KGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaGVuZCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaEVuZChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2hjYW5jZWwgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICd0b3VjaGNhbmNlbCcsXG4gICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hFbmQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlZW50ZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAnbW91c2VlbnRlcicsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlRW50ZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZWxlYXZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ21vdXNlbGVhdmUnLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZUxlYXZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghY2FuRHJhZyAmJiBoYXNFdmVudExpc3RlbmVycykge1xuICAgICAgdGhpcy51bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5idXR0b24gPT09IDApIHtcbiAgICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmUpIHtcbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmUgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICdtb3VzZW1vdmUnLFxuICAgICAgICAgIChtb3VzZU1vdmVFdmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb2ludGVyTW92ZSQubmV4dCh7XG4gICAgICAgICAgICAgIGV2ZW50OiBtb3VzZU1vdmVFdmVudCxcbiAgICAgICAgICAgICAgY2xpZW50WDogbW91c2VNb3ZlRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WTogbW91c2VNb3ZlRXZlbnQuY2xpZW50WSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucG9pbnRlckRvd24kLm5leHQoe1xuICAgICAgICBldmVudCxcbiAgICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlKSB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlKCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlbW92ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMucG9pbnRlclVwJC5uZXh0KHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uVG91Y2hTdGFydChldmVudDogVG91Y2hFdmVudCk6IHZvaWQge1xuICAgIGxldCBzdGFydFNjcm9sbFBvc2l0aW9uOiBhbnk7XG4gICAgbGV0IGlzRHJhZ0FjdGl2YXRlZDogYm9vbGVhbjtcbiAgICBsZXQgaGFzQ29udGFpbmVyU2Nyb2xsYmFyOiBib29sZWFuO1xuICAgIGlmIChcbiAgICAgICh0aGlzLnNjcm9sbENvbnRhaW5lciAmJiB0aGlzLnNjcm9sbENvbnRhaW5lci5hY3RpdmVMb25nUHJlc3NEcmFnKSB8fFxuICAgICAgdGhpcy50b3VjaFN0YXJ0TG9uZ1ByZXNzXG4gICAgKSB7XG4gICAgICB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJCZWdpbiA9IERhdGUubm93KCk7XG4gICAgICBpc0RyYWdBY3RpdmF0ZWQgPSBmYWxzZTtcbiAgICAgIGhhc0NvbnRhaW5lclNjcm9sbGJhciA9IHRoaXMuaGFzU2Nyb2xsYmFyKCk7XG4gICAgICBzdGFydFNjcm9sbFBvc2l0aW9uID0gdGhpcy5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaG1vdmUpIHtcbiAgICAgIGNvbnN0IGNvbnRleHRNZW51TGlzdGVuZXIgPSBmcm9tRXZlbnQ8RXZlbnQ+KFxuICAgICAgICB0aGlzLmRvY3VtZW50LFxuICAgICAgICAnY29udGV4dG1lbnUnXG4gICAgICApLnN1YnNjcmliZSgoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgdG91Y2hNb3ZlTGlzdGVuZXIgPSBmcm9tRXZlbnQ8VG91Y2hFdmVudD4oXG4gICAgICAgIHRoaXMuZG9jdW1lbnQsXG4gICAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgICB7XG4gICAgICAgICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgICAgIH1cbiAgICAgICkuc3Vic2NyaWJlKCh0b3VjaE1vdmVFdmVudCkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKCh0aGlzLnNjcm9sbENvbnRhaW5lciAmJiB0aGlzLnNjcm9sbENvbnRhaW5lci5hY3RpdmVMb25nUHJlc3NEcmFnKSB8fFxuICAgICAgICAgICAgdGhpcy50b3VjaFN0YXJ0TG9uZ1ByZXNzKSAmJlxuICAgICAgICAgICFpc0RyYWdBY3RpdmF0ZWQgJiZcbiAgICAgICAgICBoYXNDb250YWluZXJTY3JvbGxiYXJcbiAgICAgICAgKSB7XG4gICAgICAgICAgaXNEcmFnQWN0aXZhdGVkID0gdGhpcy5zaG91bGRCZWdpbkRyYWcoXG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgIHRvdWNoTW92ZUV2ZW50LFxuICAgICAgICAgICAgc3RhcnRTY3JvbGxQb3NpdGlvblxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICgoIXRoaXMuc2Nyb2xsQ29udGFpbmVyIHx8XG4gICAgICAgICAgICAhdGhpcy5zY3JvbGxDb250YWluZXIuYWN0aXZlTG9uZ1ByZXNzRHJhZykgJiZcbiAgICAgICAgICAgICF0aGlzLnRvdWNoU3RhcnRMb25nUHJlc3MpIHx8XG4gICAgICAgICAgIWhhc0NvbnRhaW5lclNjcm9sbGJhciB8fFxuICAgICAgICAgIGlzRHJhZ0FjdGl2YXRlZFxuICAgICAgICApIHtcbiAgICAgICAgICB0b3VjaE1vdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMucG9pbnRlck1vdmUkLm5leHQoe1xuICAgICAgICAgICAgZXZlbnQ6IHRvdWNoTW92ZUV2ZW50LFxuICAgICAgICAgICAgY2xpZW50WDogdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgICAgICAgY2xpZW50WTogdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaG1vdmUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnRleHRNZW51TGlzdGVuZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdG91Y2hNb3ZlTGlzdGVuZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMucG9pbnRlckRvd24kLm5leHQoe1xuICAgICAgZXZlbnQsXG4gICAgICBjbGllbnRYOiBldmVudC50b3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICBjbGllbnRZOiBldmVudC50b3VjaGVzWzBdLmNsaWVudFksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uVG91Y2hFbmQoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaG1vdmUpIHtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlKCk7XG4gICAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy50b3VjaG1vdmU7XG5cbiAgICAgIGlmIChcbiAgICAgICAgKHRoaXMuc2Nyb2xsQ29udGFpbmVyICYmIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmFjdGl2ZUxvbmdQcmVzc0RyYWcpIHx8XG4gICAgICAgIHRoaXMudG91Y2hTdGFydExvbmdQcmVzc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlU2Nyb2xsKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9pbnRlclVwJC5uZXh0KHtcbiAgICAgIGV2ZW50LFxuICAgICAgY2xpZW50WDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgIGNsaWVudFk6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uTW91c2VFbnRlcigpOiB2b2lkIHtcbiAgICB0aGlzLnNldEN1cnNvcih0aGlzLmRyYWdDdXJzb3IpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlTGVhdmUoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRDdXJzb3IoJycpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5EcmFnKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRyYWdBeGlzLnggfHwgdGhpcy5kcmFnQXhpcy55O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRDdXJzb3IodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmUpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMpLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgICh0aGlzIGFzIGFueSkuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnNbdHlwZV0oKTtcbiAgICAgIGRlbGV0ZSAodGhpcyBhcyBhbnkpLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zW3R5cGVdO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRFbGVtZW50U3R5bGVzKFxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIHN0eWxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfVxuICApIHtcbiAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShlbGVtZW50LCBrZXksIHN0eWxlc1trZXldKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2Nyb2xsRWxlbWVudCgpIHtcbiAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnNjcm9sbENvbnRhaW5lci5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50LmJvZHk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRTY3JvbGxQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvcDogdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCxcbiAgICAgICAgbGVmdDogdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHdpbmRvdy5wYWdlWU9mZnNldCB8fCB0aGlzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICAgIGxlZnQ6IHdpbmRvdy5wYWdlWE9mZnNldCB8fCB0aGlzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNob3VsZEJlZ2luRHJhZyhcbiAgICBldmVudDogVG91Y2hFdmVudCxcbiAgICB0b3VjaE1vdmVFdmVudDogVG91Y2hFdmVudCxcbiAgICBzdGFydFNjcm9sbFBvc2l0aW9uOiB7IHRvcDogbnVtYmVyOyBsZWZ0OiBudW1iZXIgfVxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCBtb3ZlU2Nyb2xsUG9zaXRpb24gPSB0aGlzLmdldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgY29uc3QgZGVsdGFTY3JvbGwgPSB7XG4gICAgICB0b3A6IE1hdGguYWJzKG1vdmVTY3JvbGxQb3NpdGlvbi50b3AgLSBzdGFydFNjcm9sbFBvc2l0aW9uLnRvcCksXG4gICAgICBsZWZ0OiBNYXRoLmFicyhtb3ZlU2Nyb2xsUG9zaXRpb24ubGVmdCAtIHN0YXJ0U2Nyb2xsUG9zaXRpb24ubGVmdCksXG4gICAgfTtcbiAgICBjb25zdCBkZWx0YVggPVxuICAgICAgTWF0aC5hYnMoXG4gICAgICAgIHRvdWNoTW92ZUV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCAtIGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WFxuICAgICAgKSAtIGRlbHRhU2Nyb2xsLmxlZnQ7XG4gICAgY29uc3QgZGVsdGFZID1cbiAgICAgIE1hdGguYWJzKFxuICAgICAgICB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFkgLSBldmVudC50b3VjaGVzWzBdLmNsaWVudFlcbiAgICAgICkgLSBkZWx0YVNjcm9sbC50b3A7XG4gICAgY29uc3QgZGVsdGFUb3RhbCA9IGRlbHRhWCArIGRlbHRhWTtcbiAgICBjb25zdCBsb25nUHJlc3NDb25maWcgPSB0aGlzLnRvdWNoU3RhcnRMb25nUHJlc3NcbiAgICAgID8gdGhpcy50b3VjaFN0YXJ0TG9uZ1ByZXNzXG4gICAgICA6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIHtcbiAgICAgICAgICBkZWx0YTogdGhpcy5zY3JvbGxDb250YWluZXIubG9uZ1ByZXNzQ29uZmlnLmRlbHRhLFxuICAgICAgICAgIGRlbGF5OiB0aGlzLnNjcm9sbENvbnRhaW5lci5sb25nUHJlc3NDb25maWcuZHVyYXRpb24sXG4gICAgICAgIH07XG4gICAgaWYgKFxuICAgICAgZGVsdGFUb3RhbCA+IGxvbmdQcmVzc0NvbmZpZy5kZWx0YSB8fFxuICAgICAgZGVsdGFTY3JvbGwudG9wID4gMCB8fFxuICAgICAgZGVsdGFTY3JvbGwubGVmdCA+IDBcbiAgICApIHtcbiAgICAgIHRoaXMudGltZUxvbmdQcmVzcy50aW1lckJlZ2luID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gICAgdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyRW5kID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBkdXJhdGlvbiA9XG4gICAgICB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJFbmQgLSB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJCZWdpbjtcbiAgICBpZiAoZHVyYXRpb24gPj0gbG9uZ1ByZXNzQ29uZmlnLmRlbGF5KSB7XG4gICAgICB0aGlzLmRpc2FibGVTY3JvbGwoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIGVuYWJsZVNjcm9sbCgpIHtcbiAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgJ292ZXJmbG93JyxcbiAgICAgICAgJydcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5kb2N1bWVudC5ib2R5LCAnb3ZlcmZsb3cnLCAnJyk7XG4gIH1cblxuICBwcml2YXRlIGRpc2FibGVTY3JvbGwoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgJ292ZXJmbG93JyxcbiAgICAgICAgJ2hpZGRlbidcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5kb2N1bWVudC5ib2R5LCAnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gIH1cblxuICBwcml2YXRlIGhhc1Njcm9sbGJhcigpOiBib29sZWFuIHtcbiAgICBjb25zdCBzY3JvbGxDb250YWluZXIgPSB0aGlzLmdldFNjcm9sbEVsZW1lbnQoKTtcbiAgICBjb25zdCBjb250YWluZXJIYXNIb3Jpem9udGFsU2Nyb2xsID1cbiAgICAgIHNjcm9sbENvbnRhaW5lci5zY3JvbGxXaWR0aCA+IHNjcm9sbENvbnRhaW5lci5jbGllbnRXaWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIYXNWZXJ0aWNhbFNjcm9sbCA9XG4gICAgICBzY3JvbGxDb250YWluZXIuc2Nyb2xsSGVpZ2h0ID4gc2Nyb2xsQ29udGFpbmVyLmNsaWVudEhlaWdodDtcbiAgICByZXR1cm4gY29udGFpbmVySGFzSG9yaXpvbnRhbFNjcm9sbCB8fCBjb250YWluZXJIYXNWZXJ0aWNhbFNjcm9sbDtcbiAgfVxufVxuIl19