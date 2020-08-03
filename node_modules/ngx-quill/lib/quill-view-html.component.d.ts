import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuillService } from './quill.service';
import { OnChanges, SimpleChanges } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class QuillViewHTMLComponent implements OnChanges {
    private sanitizer;
    protected service: QuillService;
    innerHTML: SafeHtml;
    themeClass: string;
    content: string;
    theme?: string;
    constructor(sanitizer: DomSanitizer, service: QuillService);
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<QuillViewHTMLComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<QuillViewHTMLComponent, "quill-view-html", never, { "content": "content"; "theme": "theme"; }, {}, never, never>;
}

//# sourceMappingURL=quill-view-html.component.d.ts.map