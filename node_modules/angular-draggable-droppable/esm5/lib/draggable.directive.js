/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var DraggableDirective = /** @class */ (function () {
    /**
     * @hidden
     */
    function DraggableDirective(element, renderer, draggableHelper, zone, vcr, scrollContainer, document) {
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
    DraggableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.checkEventListeners();
        /** @type {?} */
        var pointerDragged$ = this.pointerDown$.pipe(filter((/**
         * @return {?}
         */
        function () { return _this.canDrag(); })), mergeMap((/**
         * @param {?} pointerDownEvent
         * @return {?}
         */
        function (pointerDownEvent) {
            // fix for https://github.com/mattlewis92/angular-draggable-droppable/issues/61
            // stop mouse events propagating up the chain
            if (pointerDownEvent.event.stopPropagation && !_this.scrollContainer) {
                pointerDownEvent.event.stopPropagation();
            }
            // hack to prevent text getting selected in safari while dragging
            /** @type {?} */
            var globalDragStyle = _this.renderer.createElement('style');
            _this.renderer.setAttribute(globalDragStyle, 'type', 'text/css');
            _this.renderer.appendChild(globalDragStyle, _this.renderer.createText("\n          body * {\n           -moz-user-select: none;\n           -ms-user-select: none;\n           -webkit-user-select: none;\n           user-select: none;\n          }\n        "));
            requestAnimationFrame((/**
             * @return {?}
             */
            function () {
                _this.document.head.appendChild(globalDragStyle);
            }));
            /** @type {?} */
            var startScrollPosition = _this.getScrollPosition();
            /** @type {?} */
            var scrollContainerScroll$ = new Observable((/**
             * @param {?} observer
             * @return {?}
             */
            function (observer) {
                /** @type {?} */
                var scrollContainer = _this.scrollContainer
                    ? _this.scrollContainer.elementRef.nativeElement
                    : 'window';
                return _this.renderer.listen(scrollContainer, 'scroll', (/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) {
                    return observer.next(e);
                }));
            })).pipe(startWith(startScrollPosition), map((/**
             * @return {?}
             */
            function () { return _this.getScrollPosition(); })));
            /** @type {?} */
            var currentDrag$ = new Subject();
            /** @type {?} */
            var cancelDrag$ = new ReplaySubject();
            _this.zone.run((/**
             * @return {?}
             */
            function () {
                _this.dragPointerDown.next({ x: 0, y: 0 });
            }));
            /** @type {?} */
            var dragComplete$ = merge(_this.pointerUp$, _this.pointerDown$, cancelDrag$, _this.destroy$).pipe(share());
            /** @type {?} */
            var pointerMove = combineLatest([
                _this.pointerMove$,
                scrollContainerScroll$,
            ]).pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = tslib_1.__read(_a, 2), pointerMoveEvent = _b[0], scroll = _b[1];
                return {
                    currentDrag$: currentDrag$,
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
            function (moveData) {
                if (_this.dragSnapGrid.x) {
                    moveData.transformX =
                        Math.round(moveData.transformX / _this.dragSnapGrid.x) *
                            _this.dragSnapGrid.x;
                }
                if (_this.dragSnapGrid.y) {
                    moveData.transformY =
                        Math.round(moveData.transformY / _this.dragSnapGrid.y) *
                            _this.dragSnapGrid.y;
                }
                return moveData;
            })), map((/**
             * @param {?} moveData
             * @return {?}
             */
            function (moveData) {
                if (!_this.dragAxis.x) {
                    moveData.transformX = 0;
                }
                if (!_this.dragAxis.y) {
                    moveData.transformY = 0;
                }
                return moveData;
            })), map((/**
             * @param {?} moveData
             * @return {?}
             */
            function (moveData) {
                /** @type {?} */
                var scrollX = moveData.scrollLeft - startScrollPosition.left;
                /** @type {?} */
                var scrollY = moveData.scrollTop - startScrollPosition.top;
                return tslib_1.__assign({}, moveData, { x: moveData.transformX + scrollX, y: moveData.transformY + scrollY });
            })), filter((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var x = _a.x, y = _a.y, transformX = _a.transformX, transformY = _a.transformY;
                return !_this.validateDrag ||
                    _this.validateDrag({
                        x: x,
                        y: y,
                        transform: { x: transformX, y: transformY },
                    });
            })), takeUntil(dragComplete$), share());
            /** @type {?} */
            var dragStarted$ = pointerMove.pipe(take(1), share());
            /** @type {?} */
            var dragEnded$ = pointerMove.pipe(takeLast(1), share());
            dragStarted$.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var clientX = _a.clientX, clientY = _a.clientY, x = _a.x, y = _a.y;
                _this.zone.run((/**
                 * @return {?}
                 */
                function () {
                    _this.dragStart.next({ cancelDrag$: cancelDrag$ });
                }));
                _this.scroller = autoScroll([
                    _this.scrollContainer
                        ? _this.scrollContainer.elementRef.nativeElement
                        : _this.document.defaultView,
                ], tslib_1.__assign({}, _this.autoScroll, { autoScroll: /**
                     * @return {?}
                     */
                    function () {
                        return true;
                    } }));
                addClass(_this.renderer, _this.element, _this.dragActiveClass);
                if (_this.ghostDragEnabled) {
                    /** @type {?} */
                    var rect = _this.element.nativeElement.getBoundingClientRect();
                    /** @type {?} */
                    var clone_1 = (/** @type {?} */ (_this.element.nativeElement.cloneNode(true)));
                    if (!_this.showOriginalElementWhileDragging) {
                        _this.renderer.setStyle(_this.element.nativeElement, 'visibility', 'hidden');
                    }
                    if (_this.ghostElementAppendTo) {
                        _this.ghostElementAppendTo.appendChild(clone_1);
                    }
                    else {
                        (/** @type {?} */ (_this.element.nativeElement.parentNode)).insertBefore(clone_1, _this.element.nativeElement.nextSibling);
                    }
                    _this.ghostElement = clone_1;
                    _this.document.body.style.cursor = _this.dragCursor;
                    _this.setElementStyles(clone_1, {
                        position: 'fixed',
                        top: rect.top + "px",
                        left: rect.left + "px",
                        width: rect.width + "px",
                        height: rect.height + "px",
                        cursor: _this.dragCursor,
                        margin: '0',
                        willChange: 'transform',
                        pointerEvents: 'none',
                    });
                    if (_this.ghostElementTemplate) {
                        /** @type {?} */
                        var viewRef_1 = _this.vcr.createEmbeddedView(_this.ghostElementTemplate);
                        clone_1.innerHTML = '';
                        viewRef_1.rootNodes
                            .filter((/**
                         * @param {?} node
                         * @return {?}
                         */
                        function (node) { return node instanceof Node; }))
                            .forEach((/**
                         * @param {?} node
                         * @return {?}
                         */
                        function (node) {
                            clone_1.appendChild(node);
                        }));
                        dragEnded$.subscribe((/**
                         * @return {?}
                         */
                        function () {
                            _this.vcr.remove(_this.vcr.indexOf(viewRef_1));
                        }));
                    }
                    _this.zone.run((/**
                     * @return {?}
                     */
                    function () {
                        _this.ghostElementCreated.emit({
                            clientX: clientX - x,
                            clientY: clientY - y,
                            element: clone_1,
                        });
                    }));
                    dragEnded$.subscribe((/**
                     * @return {?}
                     */
                    function () {
                        (/** @type {?} */ (clone_1.parentElement)).removeChild(clone_1);
                        _this.ghostElement = null;
                        _this.renderer.setStyle(_this.element.nativeElement, 'visibility', '');
                    }));
                }
                _this.draggableHelper.currentDrag.next(currentDrag$);
            }));
            dragEnded$
                .pipe(mergeMap((/**
             * @param {?} dragEndData
             * @return {?}
             */
            function (dragEndData) {
                /** @type {?} */
                var dragEndData$ = cancelDrag$.pipe(count(), take(1), map((/**
                 * @param {?} calledCount
                 * @return {?}
                 */
                function (calledCount) { return (tslib_1.__assign({}, dragEndData, { dragCancelled: calledCount > 0 })); })));
                cancelDrag$.complete();
                return dragEndData$;
            })))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var x = _a.x, y = _a.y, dragCancelled = _a.dragCancelled;
                _this.scroller.destroy();
                _this.zone.run((/**
                 * @return {?}
                 */
                function () {
                    _this.dragEnd.next({ x: x, y: y, dragCancelled: dragCancelled });
                }));
                removeClass(_this.renderer, _this.element, _this.dragActiveClass);
                currentDrag$.complete();
            }));
            merge(dragComplete$, dragEnded$)
                .pipe(take(1))
                .subscribe((/**
             * @return {?}
             */
            function () {
                requestAnimationFrame((/**
                 * @return {?}
                 */
                function () {
                    _this.document.head.removeChild(globalDragStyle);
                }));
            }));
            return pointerMove;
        })), share());
        merge(pointerDragged$.pipe(take(1), map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return [, value]; }))), pointerDragged$.pipe(pairwise()))
            .pipe(filter((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = tslib_1.__read(_a, 2), previous = _b[0], next = _b[1];
            if (!previous) {
                return true;
            }
            return previous.x !== next.x || previous.y !== next.y;
        })), map((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = tslib_1.__read(_a, 2), previous = _b[0], next = _b[1];
            return next;
        })), auditTime(0, animationFrameScheduler))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var x = _a.x, y = _a.y, currentDrag$ = _a.currentDrag$, clientX = _a.clientX, clientY = _a.clientY, transformX = _a.transformX, transformY = _a.transformY;
            _this.zone.run((/**
             * @return {?}
             */
            function () {
                _this.dragging.next({ x: x, y: y });
            }));
            if (_this.ghostElement) {
                /** @type {?} */
                var transform = "translate3d(" + transformX + "px, " + transformY + "px, 0px)";
                _this.setElementStyles(_this.ghostElement, {
                    transform: transform,
                    '-webkit-transform': transform,
                    '-ms-transform': transform,
                    '-moz-transform': transform,
                    '-o-transform': transform,
                });
            }
            currentDrag$.next({
                clientX: clientX,
                clientY: clientY,
                dropData: _this.dropData,
            });
        }));
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    DraggableDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.dragAxis) {
            this.checkEventListeners();
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.unsubscribeEventListeners();
        this.pointerDown$.complete();
        this.pointerMove$.complete();
        this.pointerUp$.complete();
        this.destroy$.next();
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.checkEventListeners = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var canDrag = this.canDrag();
        /** @type {?} */
        var hasEventListeners = Object.keys(this.eventListenerSubscriptions).length > 0;
        if (canDrag && !hasEventListeners) {
            this.zone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                _this.eventListenerSubscriptions.mousedown = _this.renderer.listen(_this.element.nativeElement, 'mousedown', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    _this.onMouseDown(event);
                }));
                _this.eventListenerSubscriptions.mouseup = _this.renderer.listen('document', 'mouseup', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    _this.onMouseUp(event);
                }));
                _this.eventListenerSubscriptions.touchstart = _this.renderer.listen(_this.element.nativeElement, 'touchstart', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    _this.onTouchStart(event);
                }));
                _this.eventListenerSubscriptions.touchend = _this.renderer.listen('document', 'touchend', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    _this.onTouchEnd(event);
                }));
                _this.eventListenerSubscriptions.touchcancel = _this.renderer.listen('document', 'touchcancel', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    _this.onTouchEnd(event);
                }));
                _this.eventListenerSubscriptions.mouseenter = _this.renderer.listen(_this.element.nativeElement, 'mouseenter', (/**
                 * @return {?}
                 */
                function () {
                    _this.onMouseEnter();
                }));
                _this.eventListenerSubscriptions.mouseleave = _this.renderer.listen(_this.element.nativeElement, 'mouseleave', (/**
                 * @return {?}
                 */
                function () {
                    _this.onMouseLeave();
                }));
            }));
        }
        else if (!canDrag && hasEventListeners) {
            this.unsubscribeEventListeners();
        }
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    DraggableDirective.prototype.onMouseDown = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        if (event.button === 0) {
            if (!this.eventListenerSubscriptions.mousemove) {
                this.eventListenerSubscriptions.mousemove = this.renderer.listen('document', 'mousemove', (/**
                 * @param {?} mouseMoveEvent
                 * @return {?}
                 */
                function (mouseMoveEvent) {
                    _this.pointerMove$.next({
                        event: mouseMoveEvent,
                        clientX: mouseMoveEvent.clientX,
                        clientY: mouseMoveEvent.clientY,
                    });
                }));
            }
            this.pointerDown$.next({
                event: event,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        }
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    DraggableDirective.prototype.onMouseUp = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.button === 0) {
            if (this.eventListenerSubscriptions.mousemove) {
                this.eventListenerSubscriptions.mousemove();
                delete this.eventListenerSubscriptions.mousemove;
            }
            this.pointerUp$.next({
                event: event,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        }
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    DraggableDirective.prototype.onTouchStart = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        /** @type {?} */
        var startScrollPosition;
        /** @type {?} */
        var isDragActivated;
        /** @type {?} */
        var hasContainerScrollbar;
        if ((this.scrollContainer && this.scrollContainer.activeLongPressDrag) ||
            this.touchStartLongPress) {
            this.timeLongPress.timerBegin = Date.now();
            isDragActivated = false;
            hasContainerScrollbar = this.hasScrollbar();
            startScrollPosition = this.getScrollPosition();
        }
        if (!this.eventListenerSubscriptions.touchmove) {
            /** @type {?} */
            var contextMenuListener_1 = fromEvent(this.document, 'contextmenu').subscribe((/**
             * @param {?} e
             * @return {?}
             */
            function (e) {
                e.preventDefault();
            }));
            /** @type {?} */
            var touchMoveListener_1 = fromEvent(this.document, 'touchmove', {
                passive: false,
            }).subscribe((/**
             * @param {?} touchMoveEvent
             * @return {?}
             */
            function (touchMoveEvent) {
                if (((_this.scrollContainer && _this.scrollContainer.activeLongPressDrag) ||
                    _this.touchStartLongPress) &&
                    !isDragActivated &&
                    hasContainerScrollbar) {
                    isDragActivated = _this.shouldBeginDrag(event, touchMoveEvent, startScrollPosition);
                }
                if (((!_this.scrollContainer ||
                    !_this.scrollContainer.activeLongPressDrag) &&
                    !_this.touchStartLongPress) ||
                    !hasContainerScrollbar ||
                    isDragActivated) {
                    touchMoveEvent.preventDefault();
                    _this.pointerMove$.next({
                        event: touchMoveEvent,
                        clientX: touchMoveEvent.targetTouches[0].clientX,
                        clientY: touchMoveEvent.targetTouches[0].clientY,
                    });
                }
            }));
            this.eventListenerSubscriptions.touchmove = (/**
             * @return {?}
             */
            function () {
                contextMenuListener_1.unsubscribe();
                touchMoveListener_1.unsubscribe();
            });
        }
        this.pointerDown$.next({
            event: event,
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
        });
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    DraggableDirective.prototype.onTouchEnd = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.eventListenerSubscriptions.touchmove) {
            this.eventListenerSubscriptions.touchmove();
            delete this.eventListenerSubscriptions.touchmove;
            if ((this.scrollContainer && this.scrollContainer.activeLongPressDrag) ||
                this.touchStartLongPress) {
                this.enableScroll();
            }
        }
        this.pointerUp$.next({
            event: event,
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY,
        });
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.onMouseEnter = /**
     * @private
     * @return {?}
     */
    function () {
        this.setCursor(this.dragCursor);
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.onMouseLeave = /**
     * @private
     * @return {?}
     */
    function () {
        this.setCursor('');
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.canDrag = /**
     * @private
     * @return {?}
     */
    function () {
        return this.dragAxis.x || this.dragAxis.y;
    };
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    DraggableDirective.prototype.setCursor = /**
     * @private
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (!this.eventListenerSubscriptions.mousemove) {
            this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
        }
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.unsubscribeEventListeners = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        Object.keys(this.eventListenerSubscriptions).forEach((/**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            ((/** @type {?} */ (_this))).eventListenerSubscriptions[type]();
            delete ((/** @type {?} */ (_this))).eventListenerSubscriptions[type];
        }));
    };
    /**
     * @private
     * @param {?} element
     * @param {?} styles
     * @return {?}
     */
    DraggableDirective.prototype.setElementStyles = /**
     * @private
     * @param {?} element
     * @param {?} styles
     * @return {?}
     */
    function (element, styles) {
        var _this = this;
        Object.keys(styles).forEach((/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            _this.renderer.setStyle(element, key, styles[key]);
        }));
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.getScrollElement = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.scrollContainer) {
            return this.scrollContainer.elementRef.nativeElement;
        }
        else {
            return this.document.body;
        }
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.getScrollPosition = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    /**
     * @private
     * @param {?} event
     * @param {?} touchMoveEvent
     * @param {?} startScrollPosition
     * @return {?}
     */
    DraggableDirective.prototype.shouldBeginDrag = /**
     * @private
     * @param {?} event
     * @param {?} touchMoveEvent
     * @param {?} startScrollPosition
     * @return {?}
     */
    function (event, touchMoveEvent, startScrollPosition) {
        /** @type {?} */
        var moveScrollPosition = this.getScrollPosition();
        /** @type {?} */
        var deltaScroll = {
            top: Math.abs(moveScrollPosition.top - startScrollPosition.top),
            left: Math.abs(moveScrollPosition.left - startScrollPosition.left),
        };
        /** @type {?} */
        var deltaX = Math.abs(touchMoveEvent.targetTouches[0].clientX - event.touches[0].clientX) - deltaScroll.left;
        /** @type {?} */
        var deltaY = Math.abs(touchMoveEvent.targetTouches[0].clientY - event.touches[0].clientY) - deltaScroll.top;
        /** @type {?} */
        var deltaTotal = deltaX + deltaY;
        /** @type {?} */
        var longPressConfig = this.touchStartLongPress
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
        var duration = this.timeLongPress.timerEnd - this.timeLongPress.timerBegin;
        if (duration >= longPressConfig.delay) {
            this.disableScroll();
            return true;
        }
        return false;
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.enableScroll = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.scrollContainer) {
            this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', '');
        }
        this.renderer.setStyle(this.document.body, 'overflow', '');
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.disableScroll = /**
     * @private
     * @return {?}
     */
    function () {
        /* istanbul ignore next */
        if (this.scrollContainer) {
            this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', 'hidden');
        }
        this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    };
    /**
     * @private
     * @return {?}
     */
    DraggableDirective.prototype.hasScrollbar = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var scrollContainer = this.getScrollElement();
        /** @type {?} */
        var containerHasHorizontalScroll = scrollContainer.scrollWidth > scrollContainer.clientWidth;
        /** @type {?} */
        var containerHasVerticalScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight;
        return containerHasHorizontalScroll || containerHasVerticalScroll;
    };
    DraggableDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mwlDraggable]',
                },] }
    ];
    /** @nocollapse */
    DraggableDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: DraggableHelper },
        { type: NgZone },
        { type: ViewContainerRef },
        { type: DraggableScrollContainerDirective, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
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
    return DraggableDirective;
}());
export { DraggableDirective };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxVQUFVLEVBQ1YsU0FBUyxFQUNULE1BQU0sRUFDTixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFFTixNQUFNLEVBQ04sV0FBVyxFQUNYLGdCQUFnQixFQUNoQixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLE9BQU8sRUFDUCxVQUFVLEVBQ1YsS0FBSyxFQUNMLGFBQWEsRUFDYixhQUFhLEVBQ2IsdUJBQXVCLEVBQ3ZCLFNBQVMsR0FDVixNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFDTCxHQUFHLEVBQ0gsUUFBUSxFQUNSLFNBQVMsRUFDVCxJQUFJLEVBQ0osUUFBUSxFQUNSLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFtQixlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMvRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxVQUFVLE1BQU0sK0JBQStCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDM0YsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxRQUFRLENBQUM7Ozs7QUFFL0MsaUNBR0M7OztJQUZDLHdCQUFVOztJQUNWLHdCQUFVOzs7OztBQUdaLDhCQUdDOzs7SUFGQyxxQkFBVzs7SUFDWCxxQkFBVzs7Ozs7QUFHYiw4QkFHQzs7O0lBRkMscUJBQVc7O0lBQ1gscUJBQVc7Ozs7O0FBR2IsMENB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TCxLQUFLO3VDQUtMLEtBQUs7c0NBS0wsS0FBSzs2QkFLTCxLQUFLO2tDQWVMLE1BQU07NEJBT04sTUFBTTtzQ0FLTixNQUFNOzJCQUtOLE1BQU07MEJBS04sTUFBTTs7SUE4cUJULHlCQUFDO0NBQUEsQUFqeEJELElBaXhCQztTQTl3Qlksa0JBQWtCOzs7Ozs7SUFJN0Isc0NBQXVCOzs7OztJQUt2QixzQ0FBbUQ7Ozs7O0lBS25ELDBDQUFxQzs7Ozs7SUFLckMsOENBQTBDOzs7OztJQUsxQyw4REFBMkQ7Ozs7O0lBSzNELDBDQUFvQzs7Ozs7SUFLcEMsd0NBQWlDOzs7OztJQUtqQyw2Q0FBaUM7Ozs7O0lBS2pDLGtEQUEyQzs7Ozs7SUFLM0Msa0RBQWdEOzs7OztJQUtoRCxpREFBK0Q7O0lBSy9ELHdDQVVFOzs7OztJQUtGLDZDQUFxRTs7Ozs7OztJQU9yRSx1Q0FBeUQ7Ozs7O0lBS3pELGlEQUE2RTs7Ozs7SUFLN0Usc0NBQXVEOzs7OztJQUt2RCxxQ0FBcUQ7Ozs7O0lBS3JELDBDQUEyQzs7Ozs7SUFLM0MsMENBQTJDOzs7OztJQUszQyx3Q0FBeUM7Ozs7O0lBRXpDLHdEQVVPOzs7OztJQUVQLDBDQUF5Qzs7Ozs7SUFFekMsc0NBQWlDOzs7OztJQUVqQywyQ0FBc0U7Ozs7O0lBRXRFLHNDQUEwQzs7Ozs7SUFNeEMscUNBQXdDOzs7OztJQUN4QyxzQ0FBMkI7Ozs7O0lBQzNCLDZDQUF3Qzs7Ozs7SUFDeEMsa0NBQW9COzs7OztJQUNwQixpQ0FBNkI7Ozs7O0lBQzdCLDZDQUFzRTs7Ozs7SUFDdEUsc0NBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBPbkluaXQsXG4gIEVsZW1lbnRSZWYsXG4gIFJlbmRlcmVyMixcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uQ2hhbmdlcyxcbiAgTmdab25lLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBJbmplY3QsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBPcHRpb25hbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBTdWJqZWN0LFxuICBPYnNlcnZhYmxlLFxuICBtZXJnZSxcbiAgUmVwbGF5U3ViamVjdCxcbiAgY29tYmluZUxhdGVzdCxcbiAgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIsXG4gIGZyb21FdmVudCxcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBtYXAsXG4gIG1lcmdlTWFwLFxuICB0YWtlVW50aWwsXG4gIHRha2UsXG4gIHRha2VMYXN0LFxuICBwYWlyd2lzZSxcbiAgc2hhcmUsXG4gIGZpbHRlcixcbiAgY291bnQsXG4gIHN0YXJ0V2l0aCxcbiAgYXVkaXRUaW1lLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDdXJyZW50RHJhZ0RhdGEsIERyYWdnYWJsZUhlbHBlciB9IGZyb20gJy4vZHJhZ2dhYmxlLWhlbHBlci5wcm92aWRlcic7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgYXV0b1Njcm9sbCBmcm9tICdAbWF0dGxld2lzOTIvZG9tLWF1dG9zY3JvbGxlcic7XG5pbXBvcnQgeyBEcmFnZ2FibGVTY3JvbGxDb250YWluZXJEaXJlY3RpdmUgfSBmcm9tICcuL2RyYWdnYWJsZS1zY3JvbGwtY29udGFpbmVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBhZGRDbGFzcywgcmVtb3ZlQ2xhc3MgfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvb3JkaW5hdGVzIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJhZ0F4aXMge1xuICB4OiBib29sZWFuO1xuICB5OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNuYXBHcmlkIHtcbiAgeD86IG51bWJlcjtcbiAgeT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnUG9pbnRlckRvd25FdmVudCBleHRlbmRzIENvb3JkaW5hdGVzIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJhZ1N0YXJ0RXZlbnQge1xuICBjYW5jZWxEcmFnJDogUmVwbGF5U3ViamVjdDx2b2lkPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnTW92ZUV2ZW50IGV4dGVuZHMgQ29vcmRpbmF0ZXMge31cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnRW5kRXZlbnQgZXh0ZW5kcyBDb29yZGluYXRlcyB7XG4gIGRyYWdDYW5jZWxsZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdGVEcmFnUGFyYW1zIGV4dGVuZHMgQ29vcmRpbmF0ZXMge1xuICB0cmFuc2Zvcm06IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICB9O1xufVxuXG5leHBvcnQgdHlwZSBWYWxpZGF0ZURyYWcgPSAocGFyYW1zOiBWYWxpZGF0ZURyYWdQYXJhbXMpID0+IGJvb2xlYW47XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9pbnRlckV2ZW50IHtcbiAgY2xpZW50WDogbnVtYmVyO1xuICBjbGllbnRZOiBudW1iZXI7XG4gIGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUaW1lTG9uZ1ByZXNzIHtcbiAgdGltZXJCZWdpbjogbnVtYmVyO1xuICB0aW1lckVuZDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdob3N0RWxlbWVudENyZWF0ZWRFdmVudCB7XG4gIGNsaWVudFg6IG51bWJlcjtcbiAgY2xpZW50WTogbnVtYmVyO1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bERyYWdnYWJsZV0nLFxufSlcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIGFuIG9iamVjdCBvZiBkYXRhIHlvdSBjYW4gcGFzcyB0byB0aGUgZHJvcCBldmVudFxuICAgKi9cbiAgQElucHV0KCkgZHJvcERhdGE6IGFueTtcblxuICAvKipcbiAgICogVGhlIGF4aXMgYWxvbmcgd2hpY2ggdGhlIGVsZW1lbnQgaXMgZHJhZ2dhYmxlXG4gICAqL1xuICBASW5wdXQoKSBkcmFnQXhpczogRHJhZ0F4aXMgPSB7IHg6IHRydWUsIHk6IHRydWUgfTtcblxuICAvKipcbiAgICogU25hcCBhbGwgZHJhZ3MgdG8gYW4geCAvIHkgZ3JpZFxuICAgKi9cbiAgQElucHV0KCkgZHJhZ1NuYXBHcmlkOiBTbmFwR3JpZCA9IHt9O1xuXG4gIC8qKlxuICAgKiBTaG93IGEgZ2hvc3QgZWxlbWVudCB0aGF0IHNob3dzIHRoZSBkcmFnIHdoZW4gZHJhZ2dpbmdcbiAgICovXG4gIEBJbnB1dCgpIGdob3N0RHJhZ0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBTaG93IHRoZSBvcmlnaW5hbCBlbGVtZW50IHdoZW4gZ2hvc3REcmFnRW5hYmxlZCBpcyB0cnVlXG4gICAqL1xuICBASW5wdXQoKSBzaG93T3JpZ2luYWxFbGVtZW50V2hpbGVEcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBbGxvdyBjdXN0b20gYmVoYXZpb3VyIHRvIGNvbnRyb2wgd2hlbiB0aGUgZWxlbWVudCBpcyBkcmFnZ2VkXG4gICAqL1xuICBASW5wdXQoKSB2YWxpZGF0ZURyYWc6IFZhbGlkYXRlRHJhZztcblxuICAvKipcbiAgICogVGhlIGN1cnNvciB0byB1c2Ugd2hlbiBob3ZlcmluZyBvdmVyIGEgZHJhZ2dhYmxlIGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpIGRyYWdDdXJzb3I6IHN0cmluZyA9ICcnO1xuXG4gIC8qKlxuICAgKiBUaGUgY3NzIGNsYXNzIHRvIGFwcGx5IHdoZW4gdGhlIGVsZW1lbnQgaXMgYmVpbmcgZHJhZ2dlZFxuICAgKi9cbiAgQElucHV0KCkgZHJhZ0FjdGl2ZUNsYXNzOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBlbGVtZW50IHRoZSBnaG9zdCBlbGVtZW50IHdpbGwgYmUgYXBwZW5kZWQgdG8uIERlZmF1bHQgaXMgbmV4dCB0byB0aGUgZHJhZ2dlZCBlbGVtZW50XG4gICAqL1xuICBASW5wdXQoKSBnaG9zdEVsZW1lbnRBcHBlbmRUbzogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIEFuIG5nLXRlbXBsYXRlIHRvIGJlIGluc2VydGVkIGludG8gdGhlIHBhcmVudCBlbGVtZW50IG9mIHRoZSBnaG9zdCBlbGVtZW50LiBJdCB3aWxsIG92ZXJ3cml0ZSBhbnkgY2hpbGQgbm9kZXMuXG4gICAqL1xuICBASW5wdXQoKSBnaG9zdEVsZW1lbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IG9uIHRvdWNoIGRldmljZXMgYmVmb3JlIHN0YXJ0aW5nIHRvIGRyYWcgdGhlIGVsZW1lbnQgKHNvIHRoYXQgeW91IGNhbiBzY3JvbGwgdGhlIHBhZ2UgYnkgdG91Y2hpbmcgYSBkcmFnZ2FibGUgZWxlbWVudClcbiAgICovXG4gIEBJbnB1dCgpIHRvdWNoU3RhcnRMb25nUHJlc3M6IHsgZGVsYXk6IG51bWJlcjsgZGVsdGE6IG51bWJlciB9O1xuXG4gIC8qXG4gICAqIE9wdGlvbnMgdXNlZCB0byBjb250cm9sIHRoZSBiZWhhdmlvdXIgb2YgYXV0byBzY3JvbGxpbmc6IGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2RvbS1hdXRvc2Nyb2xsZXJcbiAgICovXG4gIEBJbnB1dCgpIGF1dG9TY3JvbGw6IHtcbiAgICBtYXJnaW46XG4gICAgICB8IG51bWJlclxuICAgICAgfCB7IHRvcD86IG51bWJlcjsgbGVmdD86IG51bWJlcjsgcmlnaHQ/OiBudW1iZXI7IGJvdHRvbT86IG51bWJlciB9O1xuICAgIG1heFNwZWVkPzpcbiAgICAgIHwgbnVtYmVyXG4gICAgICB8IHsgdG9wPzogbnVtYmVyOyBsZWZ0PzogbnVtYmVyOyByaWdodD86IG51bWJlcjsgYm90dG9tPzogbnVtYmVyIH07XG4gICAgc2Nyb2xsV2hlbk91dHNpZGU/OiBib29sZWFuO1xuICB9ID0ge1xuICAgIG1hcmdpbjogMjAsXG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBlbGVtZW50IGNhbiBiZSBkcmFnZ2VkIGFsb25nIG9uZSBheGlzIGFuZCBoYXMgdGhlIG1vdXNlIG9yIHBvaW50ZXIgZGV2aWNlIHByZXNzZWQgb24gaXRcbiAgICovXG4gIEBPdXRwdXQoKSBkcmFnUG9pbnRlckRvd24gPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdQb2ludGVyRG93bkV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgZWxlbWVudCBoYXMgc3RhcnRlZCB0byBiZSBkcmFnZ2VkLlxuICAgKiBPbmx5IGNhbGxlZCBhZnRlciBhdCBsZWFzdCBvbmUgbW91c2Ugb3IgdG91Y2ggbW92ZSBldmVudC5cbiAgICogSWYgeW91IGNhbGwgJGV2ZW50LmNhbmNlbERyYWckLmVtaXQoKSBpdCB3aWxsIGNhbmNlbCB0aGUgY3VycmVudCBkcmFnXG4gICAqL1xuICBAT3V0cHV0KCkgZHJhZ1N0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxEcmFnU3RhcnRFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSBnaG9zdCBlbGVtZW50IGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIEBPdXRwdXQoKSBnaG9zdEVsZW1lbnRDcmVhdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxHaG9zdEVsZW1lbnRDcmVhdGVkRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBlbGVtZW50IGlzIGJlaW5nIGRyYWdnZWRcbiAgICovXG4gIEBPdXRwdXQoKSBkcmFnZ2luZyA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ01vdmVFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSBlbGVtZW50IGlzIGRyYWdnZWRcbiAgICovXG4gIEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxEcmFnRW5kRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHBvaW50ZXJEb3duJCA9IG5ldyBTdWJqZWN0PFBvaW50ZXJFdmVudD4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcG9pbnRlck1vdmUkID0gbmV3IFN1YmplY3Q8UG9pbnRlckV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwb2ludGVyVXAkID0gbmV3IFN1YmplY3Q8UG9pbnRlckV2ZW50PigpO1xuXG4gIHByaXZhdGUgZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnM6IHtcbiAgICBtb3VzZW1vdmU/OiAoKSA9PiB2b2lkO1xuICAgIG1vdXNlZG93bj86ICgpID0+IHZvaWQ7XG4gICAgbW91c2V1cD86ICgpID0+IHZvaWQ7XG4gICAgbW91c2VlbnRlcj86ICgpID0+IHZvaWQ7XG4gICAgbW91c2VsZWF2ZT86ICgpID0+IHZvaWQ7XG4gICAgdG91Y2hzdGFydD86ICgpID0+IHZvaWQ7XG4gICAgdG91Y2htb3ZlPzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaGVuZD86ICgpID0+IHZvaWQ7XG4gICAgdG91Y2hjYW5jZWw/OiAoKSA9PiB2b2lkO1xuICB9ID0ge307XG5cbiAgcHJpdmF0ZSBnaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcblxuICBwcml2YXRlIHRpbWVMb25nUHJlc3M6IFRpbWVMb25nUHJlc3MgPSB7IHRpbWVyQmVnaW46IDAsIHRpbWVyRW5kOiAwIH07XG5cbiAgcHJpdmF0ZSBzY3JvbGxlcjogeyBkZXN0cm95OiAoKSA9PiB2b2lkIH07XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZHJhZ2dhYmxlSGVscGVyOiBEcmFnZ2FibGVIZWxwZXIsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSB2Y3I6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBzY3JvbGxDb250YWluZXI6IERyYWdnYWJsZVNjcm9sbENvbnRhaW5lckRpcmVjdGl2ZSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnlcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tFdmVudExpc3RlbmVycygpO1xuXG4gICAgY29uc3QgcG9pbnRlckRyYWdnZWQkOiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLnBvaW50ZXJEb3duJC5waXBlKFxuICAgICAgZmlsdGVyKCgpID0+IHRoaXMuY2FuRHJhZygpKSxcbiAgICAgIG1lcmdlTWFwKChwb2ludGVyRG93bkV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICAgICAgLy8gZml4IGZvciBodHRwczovL2dpdGh1Yi5jb20vbWF0dGxld2lzOTIvYW5ndWxhci1kcmFnZ2FibGUtZHJvcHBhYmxlL2lzc3Vlcy82MVxuICAgICAgICAvLyBzdG9wIG1vdXNlIGV2ZW50cyBwcm9wYWdhdGluZyB1cCB0aGUgY2hhaW5cbiAgICAgICAgaWYgKHBvaW50ZXJEb3duRXZlbnQuZXZlbnQuc3RvcFByb3BhZ2F0aW9uICYmICF0aGlzLnNjcm9sbENvbnRhaW5lcikge1xuICAgICAgICAgIHBvaW50ZXJEb3duRXZlbnQuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYWNrIHRvIHByZXZlbnQgdGV4dCBnZXR0aW5nIHNlbGVjdGVkIGluIHNhZmFyaSB3aGlsZSBkcmFnZ2luZ1xuICAgICAgICBjb25zdCBnbG9iYWxEcmFnU3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ3N0eWxlJ1xuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShnbG9iYWxEcmFnU3R5bGUsICd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgZ2xvYmFsRHJhZ1N0eWxlLFxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuY3JlYXRlVGV4dChgXG4gICAgICAgICAgYm9keSAqIHtcbiAgICAgICAgICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgICB9XG4gICAgICAgIGApXG4gICAgICAgICk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGdsb2JhbERyYWdTdHlsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHN0YXJ0U2Nyb2xsUG9zaXRpb24gPSB0aGlzLmdldFNjcm9sbFBvc2l0aW9uKCk7XG5cbiAgICAgICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVyU2Nyb2xsJCA9IG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgICAgIGNvbnN0IHNjcm9sbENvbnRhaW5lciA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyXG4gICAgICAgICAgICA/IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgICAgICAgICAgOiAnd2luZG93JztcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJlci5saXN0ZW4oc2Nyb2xsQ29udGFpbmVyLCAnc2Nyb2xsJywgKGUpID0+XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KGUpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSkucGlwZShcbiAgICAgICAgICBzdGFydFdpdGgoc3RhcnRTY3JvbGxQb3NpdGlvbiksXG4gICAgICAgICAgbWFwKCgpID0+IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKSlcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50RHJhZyQgPSBuZXcgU3ViamVjdDxDdXJyZW50RHJhZ0RhdGE+KCk7XG4gICAgICAgIGNvbnN0IGNhbmNlbERyYWckID0gbmV3IFJlcGxheVN1YmplY3Q8dm9pZD4oKTtcblxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRyYWdQb2ludGVyRG93bi5uZXh0KHsgeDogMCwgeTogMCB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZHJhZ0NvbXBsZXRlJCA9IG1lcmdlKFxuICAgICAgICAgIHRoaXMucG9pbnRlclVwJCxcbiAgICAgICAgICB0aGlzLnBvaW50ZXJEb3duJCxcbiAgICAgICAgICBjYW5jZWxEcmFnJCxcbiAgICAgICAgICB0aGlzLmRlc3Ryb3kkXG4gICAgICAgICkucGlwZShzaGFyZSgpKTtcblxuICAgICAgICBjb25zdCBwb2ludGVyTW92ZSA9IGNvbWJpbmVMYXRlc3QoW1xuICAgICAgICAgIHRoaXMucG9pbnRlck1vdmUkLFxuICAgICAgICAgIHNjcm9sbENvbnRhaW5lclNjcm9sbCQsXG4gICAgICAgIF0pLnBpcGUoXG4gICAgICAgICAgbWFwKChbcG9pbnRlck1vdmVFdmVudCwgc2Nyb2xsXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgY3VycmVudERyYWckLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm1YOiBwb2ludGVyTW92ZUV2ZW50LmNsaWVudFggLSBwb2ludGVyRG93bkV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybVk6IHBvaW50ZXJNb3ZlRXZlbnQuY2xpZW50WSAtIHBvaW50ZXJEb3duRXZlbnQuY2xpZW50WSxcbiAgICAgICAgICAgICAgY2xpZW50WDogcG9pbnRlck1vdmVFdmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICBjbGllbnRZOiBwb2ludGVyTW92ZUV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgIHNjcm9sbExlZnQ6IHNjcm9sbC5sZWZ0LFxuICAgICAgICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbC50b3AsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1hcCgobW92ZURhdGEpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdTbmFwR3JpZC54KSB7XG4gICAgICAgICAgICAgIG1vdmVEYXRhLnRyYW5zZm9ybVggPVxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQobW92ZURhdGEudHJhbnNmb3JtWCAvIHRoaXMuZHJhZ1NuYXBHcmlkLngpICpcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdTbmFwR3JpZC54O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnU25hcEdyaWQueSkge1xuICAgICAgICAgICAgICBtb3ZlRGF0YS50cmFuc2Zvcm1ZID1cbiAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKG1vdmVEYXRhLnRyYW5zZm9ybVkgLyB0aGlzLmRyYWdTbmFwR3JpZC55KSAqXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnU25hcEdyaWQueTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vdmVEYXRhO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1hcCgobW92ZURhdGEpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5kcmFnQXhpcy54KSB7XG4gICAgICAgICAgICAgIG1vdmVEYXRhLnRyYW5zZm9ybVggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZHJhZ0F4aXMueSkge1xuICAgICAgICAgICAgICBtb3ZlRGF0YS50cmFuc2Zvcm1ZID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vdmVEYXRhO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1hcCgobW92ZURhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFggPSBtb3ZlRGF0YS5zY3JvbGxMZWZ0IC0gc3RhcnRTY3JvbGxQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsWSA9IG1vdmVEYXRhLnNjcm9sbFRvcCAtIHN0YXJ0U2Nyb2xsUG9zaXRpb24udG9wO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4ubW92ZURhdGEsXG4gICAgICAgICAgICAgIHg6IG1vdmVEYXRhLnRyYW5zZm9ybVggKyBzY3JvbGxYLFxuICAgICAgICAgICAgICB5OiBtb3ZlRGF0YS50cmFuc2Zvcm1ZICsgc2Nyb2xsWSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSksXG4gICAgICAgICAgZmlsdGVyKFxuICAgICAgICAgICAgKHsgeCwgeSwgdHJhbnNmb3JtWCwgdHJhbnNmb3JtWSB9KSA9PlxuICAgICAgICAgICAgICAhdGhpcy52YWxpZGF0ZURyYWcgfHxcbiAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZURyYWcoe1xuICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHsgeDogdHJhbnNmb3JtWCwgeTogdHJhbnNmb3JtWSB9LFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICksXG4gICAgICAgICAgdGFrZVVudGlsKGRyYWdDb21wbGV0ZSQpLFxuICAgICAgICAgIHNoYXJlKClcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBkcmFnU3RhcnRlZCQgPSBwb2ludGVyTW92ZS5waXBlKHRha2UoMSksIHNoYXJlKCkpO1xuICAgICAgICBjb25zdCBkcmFnRW5kZWQkID0gcG9pbnRlck1vdmUucGlwZSh0YWtlTGFzdCgxKSwgc2hhcmUoKSk7XG5cbiAgICAgICAgZHJhZ1N0YXJ0ZWQkLnN1YnNjcmliZSgoeyBjbGllbnRYLCBjbGllbnRZLCB4LCB5IH0pID0+IHtcbiAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ1N0YXJ0Lm5leHQoeyBjYW5jZWxEcmFnJCB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuc2Nyb2xsZXIgPSBhdXRvU2Nyb2xsKFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lclxuICAgICAgICAgICAgICAgID8gdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgICAgICAgOiB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLi4udGhpcy5hdXRvU2Nyb2xsLFxuICAgICAgICAgICAgICBhdXRvU2Nyb2xsKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgICAgYWRkQ2xhc3ModGhpcy5yZW5kZXJlciwgdGhpcy5lbGVtZW50LCB0aGlzLmRyYWdBY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgICBpZiAodGhpcy5naG9zdERyYWdFbmFibGVkKSB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsb25lTm9kZShcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG93T3JpZ2luYWxFbGVtZW50V2hpbGVEcmFnZ2luZykge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICAgICd2aXNpYmlsaXR5JyxcbiAgICAgICAgICAgICAgICAnaGlkZGVuJ1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnRBcHBlbmRUbykge1xuICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudEFwcGVuZFRvLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICBjbG9uZSxcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5uZXh0U2libGluZ1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IGNsb25lO1xuXG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gdGhpcy5kcmFnQ3Vyc29yO1xuXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnRTdHlsZXMoY2xvbmUsIHtcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICAgIHRvcDogYCR7cmVjdC50b3B9cHhgLFxuICAgICAgICAgICAgICBsZWZ0OiBgJHtyZWN0LmxlZnR9cHhgLFxuICAgICAgICAgICAgICB3aWR0aDogYCR7cmVjdC53aWR0aH1weGAsXG4gICAgICAgICAgICAgIGhlaWdodDogYCR7cmVjdC5oZWlnaHR9cHhgLFxuICAgICAgICAgICAgICBjdXJzb3I6IHRoaXMuZHJhZ0N1cnNvcixcbiAgICAgICAgICAgICAgbWFyZ2luOiAnMCcsXG4gICAgICAgICAgICAgIHdpbGxDaGFuZ2U6ICd0cmFuc2Zvcm0nLFxuICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZ2hvc3RFbGVtZW50VGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgY29uc3Qgdmlld1JlZiA9IHRoaXMudmNyLmNyZWF0ZUVtYmVkZGVkVmlldyhcbiAgICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudFRlbXBsYXRlXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGNsb25lLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICB2aWV3UmVmLnJvb3ROb2Rlc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoKG5vZGUpID0+IG5vZGUgaW5zdGFuY2VvZiBOb2RlKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjbG9uZS5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgZHJhZ0VuZGVkJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudmNyLnJlbW92ZSh0aGlzLnZjci5pbmRleE9mKHZpZXdSZWYpKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudENyZWF0ZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogY2xpZW50WCAtIHgsXG4gICAgICAgICAgICAgICAgY2xpZW50WTogY2xpZW50WSAtIHksXG4gICAgICAgICAgICAgICAgZWxlbWVudDogY2xvbmUsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRyYWdFbmRlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgY2xvbmUucGFyZW50RWxlbWVudCEucmVtb3ZlQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmRyYWdnYWJsZUhlbHBlci5jdXJyZW50RHJhZy5uZXh0KGN1cnJlbnREcmFnJCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdFbmRlZCRcbiAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgIG1lcmdlTWFwKChkcmFnRW5kRGF0YSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBkcmFnRW5kRGF0YSQgPSBjYW5jZWxEcmFnJC5waXBlKFxuICAgICAgICAgICAgICAgIGNvdW50KCksXG4gICAgICAgICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICAgICAgICBtYXAoKGNhbGxlZENvdW50KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgLi4uZHJhZ0VuZERhdGEsXG4gICAgICAgICAgICAgICAgICBkcmFnQ2FuY2VsbGVkOiBjYWxsZWRDb3VudCA+IDAsXG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGNhbmNlbERyYWckLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgIHJldHVybiBkcmFnRW5kRGF0YSQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIClcbiAgICAgICAgICAuc3Vic2NyaWJlKCh7IHgsIHksIGRyYWdDYW5jZWxsZWQgfSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5kcmFnRW5kLm5leHQoeyB4LCB5LCBkcmFnQ2FuY2VsbGVkIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZW1vdmVDbGFzcyh0aGlzLnJlbmRlcmVyLCB0aGlzLmVsZW1lbnQsIHRoaXMuZHJhZ0FjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgIGN1cnJlbnREcmFnJC5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIG1lcmdlKGRyYWdDb21wbGV0ZSQsIGRyYWdFbmRlZCQpXG4gICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChnbG9iYWxEcmFnU3R5bGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHBvaW50ZXJNb3ZlO1xuICAgICAgfSksXG4gICAgICBzaGFyZSgpXG4gICAgKTtcblxuICAgIG1lcmdlKFxuICAgICAgcG9pbnRlckRyYWdnZWQkLnBpcGUoXG4gICAgICAgIHRha2UoMSksXG4gICAgICAgIG1hcCgodmFsdWUpID0+IFssIHZhbHVlXSlcbiAgICAgICksXG4gICAgICBwb2ludGVyRHJhZ2dlZCQucGlwZShwYWlyd2lzZSgpKVxuICAgIClcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKFtwcmV2aW91cywgbmV4dF0pID0+IHtcbiAgICAgICAgICBpZiAoIXByZXZpb3VzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHByZXZpb3VzLnggIT09IG5leHQueCB8fCBwcmV2aW91cy55ICE9PSBuZXh0Lnk7XG4gICAgICAgIH0pLFxuICAgICAgICBtYXAoKFtwcmV2aW91cywgbmV4dF0pID0+IG5leHQpLFxuICAgICAgICBhdWRpdFRpbWUoMCwgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAoeyB4LCB5LCBjdXJyZW50RHJhZyQsIGNsaWVudFgsIGNsaWVudFksIHRyYW5zZm9ybVgsIHRyYW5zZm9ybVkgfSkgPT4ge1xuICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2luZy5uZXh0KHsgeCwgeSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3RyYW5zZm9ybVh9cHgsICR7dHJhbnNmb3JtWX1weCwgMHB4KWA7XG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnRTdHlsZXModGhpcy5naG9zdEVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtLFxuICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICAgICctbXMtdHJhbnNmb3JtJzogdHJhbnNmb3JtLFxuICAgICAgICAgICAgICAnLW1vei10cmFuc2Zvcm0nOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICAgICctby10cmFuc2Zvcm0nOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudERyYWckLm5leHQoe1xuICAgICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICAgIGNsaWVudFksXG4gICAgICAgICAgICBkcm9wRGF0YTogdGhpcy5kcm9wRGF0YSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5kcmFnQXhpcykge1xuICAgICAgdGhpcy5jaGVja0V2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy51bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgdGhpcy5wb2ludGVyRG93biQuY29tcGxldGUoKTtcbiAgICB0aGlzLnBvaW50ZXJNb3ZlJC5jb21wbGV0ZSgpO1xuICAgIHRoaXMucG9pbnRlclVwJC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0V2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbkRyYWc6IGJvb2xlYW4gPSB0aGlzLmNhbkRyYWcoKTtcbiAgICBjb25zdCBoYXNFdmVudExpc3RlbmVyczogYm9vbGVhbiA9XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zKS5sZW5ndGggPiAwO1xuXG4gICAgaWYgKGNhbkRyYWcgJiYgIWhhc0V2ZW50TGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlZG93biA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICdtb3VzZWRvd24nLFxuICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlRG93bihldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2V1cCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgJ21vdXNldXAnLFxuICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlVXAoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNoc3RhcnQgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAndG91Y2hzdGFydCcsXG4gICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hTdGFydChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2hlbmQgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICd0b3VjaGVuZCcsXG4gICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hFbmQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNoY2FuY2VsID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAndG91Y2hjYW5jZWwnLFxuICAgICAgICAgIChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblRvdWNoRW5kKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZWVudGVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ21vdXNlZW50ZXInLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZUVudGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2VsZWF2ZSA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICdtb3VzZWxlYXZlJyxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VMZWF2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoIWNhbkRyYWcgJiYgaGFzRXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlKSB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICAgICAobW91c2VNb3ZlRXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlck1vdmUkLm5leHQoe1xuICAgICAgICAgICAgICBldmVudDogbW91c2VNb3ZlRXZlbnQsXG4gICAgICAgICAgICAgIGNsaWVudFg6IG1vdXNlTW92ZUV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFk6IG1vdXNlTW92ZUV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLnBvaW50ZXJEb3duJC5uZXh0KHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5idXR0b24gPT09IDApIHtcbiAgICAgIGlmICh0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlbW92ZSkge1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlbW92ZSgpO1xuICAgICAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmU7XG4gICAgICB9XG4gICAgICB0aGlzLnBvaW50ZXJVcCQubmV4dCh7XG4gICAgICAgIGV2ZW50LFxuICAgICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgICBsZXQgc3RhcnRTY3JvbGxQb3NpdGlvbjogYW55O1xuICAgIGxldCBpc0RyYWdBY3RpdmF0ZWQ6IGJvb2xlYW47XG4gICAgbGV0IGhhc0NvbnRhaW5lclNjcm9sbGJhcjogYm9vbGVhbjtcbiAgICBpZiAoXG4gICAgICAodGhpcy5zY3JvbGxDb250YWluZXIgJiYgdGhpcy5zY3JvbGxDb250YWluZXIuYWN0aXZlTG9uZ1ByZXNzRHJhZykgfHxcbiAgICAgIHRoaXMudG91Y2hTdGFydExvbmdQcmVzc1xuICAgICkge1xuICAgICAgdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyQmVnaW4gPSBEYXRlLm5vdygpO1xuICAgICAgaXNEcmFnQWN0aXZhdGVkID0gZmFsc2U7XG4gICAgICBoYXNDb250YWluZXJTY3JvbGxiYXIgPSB0aGlzLmhhc1Njcm9sbGJhcigpO1xuICAgICAgc3RhcnRTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlKSB7XG4gICAgICBjb25zdCBjb250ZXh0TWVudUxpc3RlbmVyID0gZnJvbUV2ZW50PEV2ZW50PihcbiAgICAgICAgdGhpcy5kb2N1bWVudCxcbiAgICAgICAgJ2NvbnRleHRtZW51J1xuICAgICAgKS5zdWJzY3JpYmUoKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRvdWNoTW92ZUxpc3RlbmVyID0gZnJvbUV2ZW50PFRvdWNoRXZlbnQ+KFxuICAgICAgICB0aGlzLmRvY3VtZW50LFxuICAgICAgICAndG91Y2htb3ZlJyxcbiAgICAgICAge1xuICAgICAgICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgICAgICB9XG4gICAgICApLnN1YnNjcmliZSgodG91Y2hNb3ZlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICgodGhpcy5zY3JvbGxDb250YWluZXIgJiYgdGhpcy5zY3JvbGxDb250YWluZXIuYWN0aXZlTG9uZ1ByZXNzRHJhZykgfHxcbiAgICAgICAgICAgIHRoaXMudG91Y2hTdGFydExvbmdQcmVzcykgJiZcbiAgICAgICAgICAhaXNEcmFnQWN0aXZhdGVkICYmXG4gICAgICAgICAgaGFzQ29udGFpbmVyU2Nyb2xsYmFyXG4gICAgICAgICkge1xuICAgICAgICAgIGlzRHJhZ0FjdGl2YXRlZCA9IHRoaXMuc2hvdWxkQmVnaW5EcmFnKFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICB0b3VjaE1vdmVFdmVudCxcbiAgICAgICAgICAgIHN0YXJ0U2Nyb2xsUG9zaXRpb25cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAoKCF0aGlzLnNjcm9sbENvbnRhaW5lciB8fFxuICAgICAgICAgICAgIXRoaXMuc2Nyb2xsQ29udGFpbmVyLmFjdGl2ZUxvbmdQcmVzc0RyYWcpICYmXG4gICAgICAgICAgICAhdGhpcy50b3VjaFN0YXJ0TG9uZ1ByZXNzKSB8fFxuICAgICAgICAgICFoYXNDb250YWluZXJTY3JvbGxiYXIgfHxcbiAgICAgICAgICBpc0RyYWdBY3RpdmF0ZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgdG91Y2hNb3ZlRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlJC5uZXh0KHtcbiAgICAgICAgICAgIGV2ZW50OiB0b3VjaE1vdmVFdmVudCxcbiAgICAgICAgICAgIGNsaWVudFg6IHRvdWNoTW92ZUV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgIGNsaWVudFk6IHRvdWNoTW92ZUV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlID0gKCkgPT4ge1xuICAgICAgICBjb250ZXh0TWVudUxpc3RlbmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRvdWNoTW92ZUxpc3RlbmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9O1xuICAgIH1cbiAgICB0aGlzLnBvaW50ZXJEb3duJC5uZXh0KHtcbiAgICAgIGV2ZW50LFxuICAgICAgY2xpZW50WDogZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQudG91Y2hlc1swXS5jbGllbnRZLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvblRvdWNoRW5kKGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlKSB7XG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNobW92ZSgpO1xuICAgICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlO1xuXG4gICAgICBpZiAoXG4gICAgICAgICh0aGlzLnNjcm9sbENvbnRhaW5lciAmJiB0aGlzLnNjcm9sbENvbnRhaW5lci5hY3RpdmVMb25nUHJlc3NEcmFnKSB8fFxuICAgICAgICB0aGlzLnRvdWNoU3RhcnRMb25nUHJlc3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVNjcm9sbCgpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBvaW50ZXJVcCQubmV4dCh7XG4gICAgICBldmVudCxcbiAgICAgIGNsaWVudFg6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICBjbGllbnRZOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlRW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRDdXJzb3IodGhpcy5kcmFnQ3Vyc29yKTtcbiAgfVxuXG4gIHByaXZhdGUgb25Nb3VzZUxlYXZlKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0Q3Vyc29yKCcnKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FuRHJhZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kcmFnQXhpcy54IHx8IHRoaXMuZHJhZ0F4aXMueTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Q3Vyc29yKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAodGhpcyBhcyBhbnkpLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zW3R5cGVdKCk7XG4gICAgICBkZWxldGUgKHRoaXMgYXMgYW55KS5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9uc1t0eXBlXTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RWxlbWVudFN0eWxlcyhcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBzdHlsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH1cbiAgKSB7XG4gICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZWxlbWVudCwga2V5LCBzdHlsZXNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldFNjcm9sbEVsZW1lbnQoKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kb2N1bWVudC5ib2R5O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2Nyb2xsUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICAgIGxlZnQ6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiB3aW5kb3cucGFnZVlPZmZzZXQgfHwgdGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICBsZWZ0OiB3aW5kb3cucGFnZVhPZmZzZXQgfHwgdGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzaG91bGRCZWdpbkRyYWcoXG4gICAgZXZlbnQ6IFRvdWNoRXZlbnQsXG4gICAgdG91Y2hNb3ZlRXZlbnQ6IFRvdWNoRXZlbnQsXG4gICAgc3RhcnRTY3JvbGxQb3NpdGlvbjogeyB0b3A6IG51bWJlcjsgbGVmdDogbnVtYmVyIH1cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbW92ZVNjcm9sbFBvc2l0aW9uID0gdGhpcy5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIGNvbnN0IGRlbHRhU2Nyb2xsID0ge1xuICAgICAgdG9wOiBNYXRoLmFicyhtb3ZlU2Nyb2xsUG9zaXRpb24udG9wIC0gc3RhcnRTY3JvbGxQb3NpdGlvbi50b3ApLFxuICAgICAgbGVmdDogTWF0aC5hYnMobW92ZVNjcm9sbFBvc2l0aW9uLmxlZnQgLSBzdGFydFNjcm9sbFBvc2l0aW9uLmxlZnQpLFxuICAgIH07XG4gICAgY29uc3QgZGVsdGFYID1cbiAgICAgIE1hdGguYWJzKFxuICAgICAgICB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFggLSBldmVudC50b3VjaGVzWzBdLmNsaWVudFhcbiAgICAgICkgLSBkZWx0YVNjcm9sbC5sZWZ0O1xuICAgIGNvbnN0IGRlbHRhWSA9XG4gICAgICBNYXRoLmFicyhcbiAgICAgICAgdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZIC0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZXG4gICAgICApIC0gZGVsdGFTY3JvbGwudG9wO1xuICAgIGNvbnN0IGRlbHRhVG90YWwgPSBkZWx0YVggKyBkZWx0YVk7XG4gICAgY29uc3QgbG9uZ1ByZXNzQ29uZmlnID0gdGhpcy50b3VjaFN0YXJ0TG9uZ1ByZXNzXG4gICAgICA/IHRoaXMudG91Y2hTdGFydExvbmdQcmVzc1xuICAgICAgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICB7XG4gICAgICAgICAgZGVsdGE6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmxvbmdQcmVzc0NvbmZpZy5kZWx0YSxcbiAgICAgICAgICBkZWxheTogdGhpcy5zY3JvbGxDb250YWluZXIubG9uZ1ByZXNzQ29uZmlnLmR1cmF0aW9uLFxuICAgICAgICB9O1xuICAgIGlmIChcbiAgICAgIGRlbHRhVG90YWwgPiBsb25nUHJlc3NDb25maWcuZGVsdGEgfHxcbiAgICAgIGRlbHRhU2Nyb2xsLnRvcCA+IDAgfHxcbiAgICAgIGRlbHRhU2Nyb2xsLmxlZnQgPiAwXG4gICAgKSB7XG4gICAgICB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJCZWdpbiA9IERhdGUubm93KCk7XG4gICAgfVxuICAgIHRoaXMudGltZUxvbmdQcmVzcy50aW1lckVuZCA9IERhdGUubm93KCk7XG4gICAgY29uc3QgZHVyYXRpb24gPVxuICAgICAgdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyRW5kIC0gdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyQmVnaW47XG4gICAgaWYgKGR1cmF0aW9uID49IGxvbmdQcmVzc0NvbmZpZy5kZWxheSkge1xuICAgICAgdGhpcy5kaXNhYmxlU2Nyb2xsKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBlbmFibGVTY3JvbGwoKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICdvdmVyZmxvdycsXG4gICAgICAgICcnXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZG9jdW1lbnQuYm9keSwgJ292ZXJmbG93JywgJycpO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNhYmxlU2Nyb2xsKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICdvdmVyZmxvdycsXG4gICAgICAgICdoaWRkZW4nXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZG9jdW1lbnQuYm9keSwgJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYXNTY3JvbGxiYXIoKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVyID0gdGhpcy5nZXRTY3JvbGxFbGVtZW50KCk7XG4gICAgY29uc3QgY29udGFpbmVySGFzSG9yaXpvbnRhbFNjcm9sbCA9XG4gICAgICBzY3JvbGxDb250YWluZXIuc2Nyb2xsV2lkdGggPiBzY3JvbGxDb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGFzVmVydGljYWxTY3JvbGwgPVxuICAgICAgc2Nyb2xsQ29udGFpbmVyLnNjcm9sbEhlaWdodCA+IHNjcm9sbENvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG4gICAgcmV0dXJuIGNvbnRhaW5lckhhc0hvcml6b250YWxTY3JvbGwgfHwgY29udGFpbmVySGFzVmVydGljYWxTY3JvbGw7XG4gIH1cbn1cbiJdfQ==