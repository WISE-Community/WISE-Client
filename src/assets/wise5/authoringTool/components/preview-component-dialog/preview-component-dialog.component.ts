import { Component, Inject, OnInit } from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: 'preview-component-dialog.component.html',
  styleUrls: ['preview-component-dialog.component.scss']
})
export class PreviewComponentDialogComponent implements OnInit {
  protected canSaveStarterState: boolean;
  protected componentTypesWithStarterStates = ['ConceptMap', 'Draw', 'Label'];
  protected starterState: any;

  constructor(@Inject(MAT_DIALOG_DATA) protected component: WISEComponent) {}

  ngOnInit(): void {
    this.canSaveStarterState = this.componentTypesWithStarterStates.includes(
      this.component.content.type
    );
  }

  updateStarterState(starterState: any): void {
    this.starterState = starterState;
  }
}
