import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'table-grading',
  standalone: false,
  template: `<table-show-work
    [nodeId]="nodeId"
    [componentId]="componentId"
    [componentState]="componentState"
    [isRevision]="isRevision"
  />`
})
export class TableGradingComponent extends ComponentShowWorkDirective {}
