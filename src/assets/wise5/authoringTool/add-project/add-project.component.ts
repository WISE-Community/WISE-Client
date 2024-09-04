import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterProjectService } from '../../services/registerProjectService';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithSpinnerComponent } from '../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { Router } from '@angular/router';
import { copy } from '../../common/object/object';
import { newProjectTemplate } from '../new-project-template';
import { catchError, Observable, throwError } from 'rxjs';

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
    private registerProjectService: RegisterProjectService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.titleField.nativeElement.focus();
  }

  protected cancel(): void {
    this.router.navigate(['/teacher/edit/home']);
  }

  protected create(): void {
    this.dialog.open(DialogWithSpinnerComponent, {
      data: {
        title: $localize`Creating Unit...`
      },
      disableClose: true
    });
    const project = copy(newProjectTemplate);
    project.metadata.title = this.addProjectFormGroup.controls['title'].value;
    const projectJSONString = JSON.stringify(project, null, 4);
    this.registerProjectService
      .register(project.metadata.title, projectJSONString)
      .pipe(catchError(this.handleRegisterError))
      .subscribe((projectId) => {
        this.dialog.closeAll();
        this.router.navigate([`/teacher/edit/unit/${projectId}`]);
      });
  }

  private handleRegisterError(): Observable<never> {
    this.dialog.closeAll;
    const errorMsg = $localize`There was an error creating this unit. Please contact WISE staff.`;
    alert(errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
