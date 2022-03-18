import { Component, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: 'preview-component-dialog.component.html'
})
export class PreviewComponentDialogComponent implements OnInit {
  @Input()
  componentId: string;

  @Input()
  nodeId: string;

  ngOnInit(): void {}
}
