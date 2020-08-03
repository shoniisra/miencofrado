export declare class CalendarResizeHelper {
    private resizeContainerElement;
    private minWidth;
    private rtl;
    constructor(resizeContainerElement: HTMLElement, minWidth: number, rtl: boolean);
    validateResize({ rectangle, edges }: {
        rectangle: any;
        edges: any;
    }): boolean;
}
