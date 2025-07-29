import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { TranslatableRichTextEditorComponent } from '../../../authoringTool/components/translatable-rich-text-editor/translatable-rich-text-editor.component';

@Component({
  imports: [TranslatableRichTextEditorComponent],
  template: `<translatable-rich-text-editor
    [content]="componentContent"
    key="html"
    (defaultLanguageTextChanged)="componentChanged()"
  /> `
})
export class HtmlAuthoringComponent extends AbstractComponentAuthoring {}
