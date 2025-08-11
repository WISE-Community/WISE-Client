import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AbstractImportStepComponent } from '../../../../assets/wise5/authoringTool/addNode/abstract-import-step/abstract-import-step.component';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    RouterModule
  ],
  selector: 'choose-import-step',
  styleUrls: ['choose-import-step.component.scss', '../../add-content.scss'],
  templateUrl: 'choose-import-step.component.html'
})
export class ChooseImportStepComponent extends AbstractImportStepComponent {
  protected project: any;
  protected projectIdToOrder: any;
  private projectItems: any[] = [];

  ngOnInit(): void {
    super.ngOnInit();
    this.projectService.retrieveProjectById(this.importProjectId).then((projectJSON) => {
      this.project = projectJSON;
      const nodeOrderOfProject = this.projectService.getNodeOrderOfProject(this.project);
      this.projectIdToOrder = Object.values(nodeOrderOfProject.idToOrder);
      this.projectItems = nodeOrderOfProject.nodes;
    });
  }

  protected previewNode(node: any): void {
    window.open(`${this.project.previewProjectURL}/${node.id}`);
  }

  protected previewProject(): void {
    window.open(`${this.project.previewProjectURL}`);
  }

  protected getSelectedNodesToImport(): any[] {
    return this.projectItems.filter((item) => item.checked).map((item) => item.node);
  }
}
