import { Component, Inject, OnInit } from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { SaveStarterStateComponent } from '../save-starter-state/save-starter-state.component';
import { PreviewComponentComponent } from '../preview-component/preview-component.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    PreviewComponentComponent,
    SaveStarterStateComponent
  ],
  standalone: true,
  styleUrl: 'preview-component-dialog.component.scss',
  templateUrl: 'preview-component-dialog.component.html'
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

  protected updateStarterState(starterState: any): void {
    this.starterState = starterState;
  }
}
