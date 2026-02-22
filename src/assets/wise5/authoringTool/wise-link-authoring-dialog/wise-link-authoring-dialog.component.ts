import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule
  ],
  styleUrl: './wise-link-authoring-dialog.component.scss',
  templateUrl: './wise-link-authoring-dialog.component.html'
})
export class WiseLinkAuthoringDialogComponent {
  protected items: any[];
  protected wiseLinkComponentId: string = '';
  protected wiseLinkNodeId: string = '';
  protected wiseLinkText: string = '';
  protected wiseLinkType: string = 'link';

  constructor(
    protected dialogRef: MatDialogRef<WiseLinkAuthoringDialogComponent>,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.items = this.projectService.getNodesInOrder();
  }

  protected wiseLinkNodeIdChanged(): void {
    if (this.wiseLinkNodeId != null && this.wiseLinkNodeId !== '') {
      this.wiseLinkComponentId = '';
      const position = this.getNodePositionById(this.wiseLinkNodeId);
      const title = this.getNodeTitle(this.wiseLinkNodeId);
      this.wiseLinkText = `${position}: ${title}`;
    }
  }

  private getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  private getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected isGroupNode(nodeId: string): boolean {
    return this.projectService.isGroupNode(nodeId);
  }

  protected getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  protected create(): void {
    if (this.wiseLinkNodeId == null || this.wiseLinkNodeId === '') {
      alert($localize`You must select a step.`);
    } else if (this.wiseLinkText == null || this.wiseLinkText === '') {
      alert($localize`You must enter text.`);
    } else {
      this.dialogRef.close({
        wiseLinkNodeId: this.wiseLinkNodeId,
        wiseLinkComponentId: this.wiseLinkComponentId,
        wiseLinkType: this.wiseLinkType,
        wiseLinkText: this.wiseLinkText
      });
    }
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
