import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UpgradeModule } from '@angular/upgrade/static';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithSpinnerComponent } from '../../directives/dialog-with-spinner/dialog-with-spinner.component';

@Component({
  selector: 'add-project',
  styleUrls: ['./add-project.component.scss'],
  templateUrl: './add-project.component.html'
})
export class AddProjectComponent {
  protected addProjectFormGroup: FormGroup = this.fb.group({
    title: new FormControl('', [Validators.required])
  });
  @ViewChild('titleField') protected titleField: ElementRef;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private projectService: TeacherProjectService,
    private upgrade: UpgradeModule
  ) {}

  ngAfterViewInit(): void {
    this.titleField.nativeElement.focus();
  }

  protected cancel(): void {
    this.upgrade.$injector.get('$state').go('root.at.main');
  }

  protected create(): void {
    this.dialog.open(DialogWithSpinnerComponent, {
      data: {
        title: $localize`Creating Unit...`
      },
      disableClose: true
    });
    const project = this.projectService.getNewProjectTemplate();
    project.metadata.title = this.addProjectFormGroup.controls['title'].value;
    const projectJSONString = JSON.stringify(project, null, 4);
    this.projectService
      .registerNewProject(project.metadata.title, projectJSONString)
      .then((projectId) => {
        this.dialog.closeAll();
        this.upgrade.$injector.get('$state').go('root.at.project', { projectId: projectId });
      })
      .catch(() => {
        this.dialog.closeAll();
        alert($localize`There was an error creating this unit. Please contact WISE staff.`);
      });
  }
}
