import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'add-lesson-configure',
  styleUrls: ['./add-lesson-configure.component.scss'],
  templateUrl: './add-lesson-configure.component.html'
})
export class AddLessonConfigureComponent {
  addLessonFormGroup: FormGroup = this.fb.group({
    title: new FormControl('', [Validators.required])
  });
  @ViewChild('titleField') titleField: ElementRef;

  constructor(private fb: FormBuilder, private upgrade: UpgradeModule) {}

  ngAfterViewInit() {
    this.titleField.nativeElement.focus();
  }

  protected cancel(): void {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }

  protected next(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.add-lesson.choose-location', {
      title: this.addLessonFormGroup.controls['title'].value
    });
  }
}
