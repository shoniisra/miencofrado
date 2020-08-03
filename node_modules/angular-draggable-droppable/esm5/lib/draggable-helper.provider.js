/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @record
 */
export function CurrentDragData() { }
if (false) {
    /** @type {?} */
    CurrentDragData.prototype.clientX;
    /** @type {?} */
    CurrentDragData.prototype.clientY;
    /** @type {?} */
    CurrentDragData.prototype.dropData;
}
var DraggableHelper = /** @class */ (function () {
    function DraggableHelper() {
        this.currentDrag = new Subject();
    }
    DraggableHelper.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    /** @nocollapse */ DraggableHelper.ngInjectableDef = i0.defineInjectable({ factory: function DraggableHelper_Factory() { return new DraggableHelper(); }, token: DraggableHelper, providedIn: "root" });
    return DraggableHelper;
}());
export { DraggableHelper };
if (false) {
    /** @type {?} */
    DraggableHelper.prototype.currentDrag;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLWhlbHBlci5wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kcmFnZ2FibGUtaGVscGVyLnByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBRTNDLHFDQUlDOzs7SUFIQyxrQ0FBZ0I7O0lBQ2hCLGtDQUFnQjs7SUFDaEIsbUNBQWM7O0FBR2hCO0lBQUE7UUFJRSxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUE0QixDQUFDO0tBQ3ZEOztnQkFMQSxVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7MEJBWEQ7Q0FjQyxBQUxELElBS0M7U0FGWSxlQUFlOzs7SUFDMUIsc0NBQXNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEN1cnJlbnREcmFnRGF0YSB7XG4gIGNsaWVudFg6IG51bWJlcjtcbiAgY2xpZW50WTogbnVtYmVyO1xuICBkcm9wRGF0YTogYW55O1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlSGVscGVyIHtcbiAgY3VycmVudERyYWcgPSBuZXcgU3ViamVjdDxTdWJqZWN0PEN1cnJlbnREcmFnRGF0YT4+KCk7XG59XG4iXX0=