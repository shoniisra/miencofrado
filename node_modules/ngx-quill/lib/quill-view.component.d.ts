import QuillType from 'quill';
import { QuillModules } from './quill-editor.interfaces';
import { AfterViewInit, ElementRef, OnChanges, Renderer2, SimpleChanges, NgZone } from '@angular/core';
import { CustomOption, CustomModule } from './quill-editor.interfaces';
import { QuillService } from './quill.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as ɵngcc0 from '@angular/core';
export declare class QuillViewComponent implements AfterViewInit, OnChanges {
    elementRef: ElementRef;
    protected renderer: Renderer2;
    protected zone: NgZone;
    protected service: QuillService;
    protected domSanitizer: DomSanitizer;
    protected platformId: any;
    quillEditor: QuillType;
    editorElem: HTMLElement;
    format?: 'object' | 'html' | 'text' | 'json';
    theme?: string;
    modules?: QuillModules;
    debug?: 'warn' | 'log' | 'error' | false;
    formats?: string[] | null;
    sanitize: boolean;
    strict: boolean;
    content: any;
    customModules: CustomModule[];
    customOptions: CustomOption[];
    preserveWhitespace: boolean;
    constructor(elementRef: ElementRef, renderer: Renderer2, zone: NgZone, service: QuillService, domSanitizer: DomSanitizer, platformId: any);
    valueSetter: (quillEditor: QuillType, value: any) => any;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): Promise<void>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<QuillViewComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<QuillViewComponent, "quill-view", never, { "sanitize": "sanitize"; "strict": "strict"; "customModules": "customModules"; "customOptions": "customOptions"; "preserveWhitespace": "preserveWhitespace"; "format": "format"; "theme": "theme"; "modules": "modules"; "debug": "debug"; "formats": "formats"; "content": "content"; }, {}, never, never>;
}

//# sourceMappingURL=quill-view.component.d.ts.map