import { Component, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, MatCheckboxModule],
  template: `
    <mat-checkbox color="primary" [(ngModel)]="node.showSaveButton" (change)="saveProject()" i18n>
      Show Save Button
    </mat-checkbox>
    <br />
    <mat-checkbox color="primary" [(ngModel)]="node.showSubmitButton" (change)="saveProject()" i18n>
      Show Submit Button
    </mat-checkbox>
  `
})
export class NodeAdvancedGeneralAuthoringComponent implements OnInit {
  protected node: any;

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.parent.parent.parent.params.subscribe(
      (params) => (this.node = this.projectService.getNodeById(params.nodeId))
    );
  }

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
