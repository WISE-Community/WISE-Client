import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';

@Component({
    selector: 'html-authoring',
    templateUrl: 'html-authoring.component.html',
    standalone: false
})
export class HtmlAuthoring extends AbstractComponentAuthoring {}
