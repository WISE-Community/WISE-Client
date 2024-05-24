import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { temporarilyHighlightElement } from '../../../common/dom/dom';

@Component({
  selector: 'add-lesson-configure',
  styleUrls: ['./add-lesson-configure.component.scss', '../../add-content.scss'],
  templateUrl: './add-lesson-configure.component.html'
})
export class AddLessonConfigureComponent {
  protected addLessonFormGroup: FormGroup = this.fb.group({
    title: new FormControl('', [Validators.required])
  });
  protected target: string;
  @ViewChild('titleField') titleField: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private projectService: TeacherProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.target = history.state.target;
  }

  ngAfterViewInit(): void {
    this.titleField.nativeElement.focus();
  }

  protected submit(): void {
    const newLesson = this.projectService.createGroup(
      this.addLessonFormGroup.controls['title'].value
    );
    if (this.target === 'group0' || this.target === 'inactiveGroups') {
      this.projectService.createNodeInside(newLesson, this.target);
    } else {
      this.projectService.createNodeAfter(newLesson, this.target);
    }
    this.updateProject(newLesson.id);
  }

  private updateProject(newNodeId: string): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
      this.router.navigate(['../..'], { relativeTo: this.route });
      // This timeout is used to allow the lesson to be added to the DOM before we highlight it
      setTimeout(() => {
        temporarilyHighlightElement(newNodeId);
      });
    });
  }
}
