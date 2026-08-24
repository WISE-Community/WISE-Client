import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { isValidJSONString } from '../../common/string/string';
import { ConfigService } from '../../services/configService';
import { NotificationService } from '../../services/notificationService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { RubricAuthoringComponent } from '../rubric/rubric-authoring.component';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MilestonesAuthoringComponent } from '../milestones-authoring/milestones-authoring.component';
import { EditUnitTypeComponent } from '../edit-unit-type/edit-unit-type.component';
import { UserService } from '../../../../app/services/user.service';

@Component({
  imports: [
    CdkTextareaAutosize,
    EditUnitTypeComponent,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatTabsModule,
    MatTooltipModule,
    MilestonesAuthoringComponent,
    RubricAuthoringComponent
  ],
  templateUrl: 'advanced-project-authoring.component.html'
})
export class AdvancedProjectAuthoringComponent {
  protected isMyUnit: boolean;
  protected metadata: any;
  protected navigationType: 'default' | 'tab';
  protected projectJSONString: string;
  protected publishUnitUrl;
  protected selectedTab: number;

  constructor(
    private configService: ConfigService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.metadata = this.projectService.getProjectMetadata();
    if (this.metadata.unitType == null) {
      this.metadata.unitType = 'Platform';
    }
    this.navigationType = this.projectService.project.theme ?? 'default';
    this.projectJSONString = JSON.stringify(this.projectService.project, null, 4);
    this.publishUnitUrl = `${this.configService.getContextPath()}/contact?projectId=${this.configService.getProjectId()}&publish=true`;
    this.isMyUnit = this.metadata.authors.some(
      (author) => author.id === this.userService.getUserId()
    );
  }

  protected tabChanged(event: MatTabChangeEvent): void {
    if (event.index === 2) {
      this.showJSON();
    } else {
      this.hideJSON();
    }
  }

  private showJSON(): void {
    this.notificationService.showJSONValidMessage();
  }

  private hideJSON(): void {
    if (isValidJSONString(this.projectJSONString)) {
      this.notificationService.hideJSONValidMessage();
    } else if (
      confirm(
        $localize`The JSON is invalid. Invalid JSON will not be saved.\nClick "OK" to revert back to the last valid JSON.\nClick "Cancel" to keep the invalid JSON open so you can fix it.`
      )
    ) {
      this.notificationService.hideJSONValidMessage();
      this.selectedTab = 2; // re-open JSON tab so user can review JSON
    }
  }

  protected saveProjectJSONString(): void {
    try {
      this.saveProjectJSON(this.projectJSONString);
      this.notificationService.showJSONValidMessage();
    } catch (e) {
      this.notificationService.showJSONInvalidMessage();
    }
  }

  private saveProjectJSON(projectJSONString: string): void {
    const project = JSON.parse(projectJSONString);
    this.projectService.setProject(project);
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject();
  }

  protected downloadProject(): void {
    window.location.href = `/api/project/export/${this.configService.getProjectId()}`;
  }

  protected setNavigationType(): void {
    this.projectService.project.theme = this.navigationType;
    this.projectService.saveProject();
  }
}
