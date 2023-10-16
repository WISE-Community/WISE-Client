import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'add-lesson-configure',
  styleUrls: ['./add-lesson-configure.component.scss', '../../add-content.scss'],
  templateUrl: './add-lesson-configure.component.html'
})
export class AddLessonConfigureComponent {
  addLessonFormGroup: FormGroup = this.fb.group({
    title: new FormControl('', [Validators.required])
  });
  @ViewChild('titleField') titleField: ElementRef;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngAfterViewInit() {
    this.titleField.nativeElement.focus();
  }

  protected next(): void {
    this.router.navigate(['../choose-location'], {
      relativeTo: this.route,
      state: { title: this.addLessonFormGroup.controls['title'].value }
    });
  }
}
