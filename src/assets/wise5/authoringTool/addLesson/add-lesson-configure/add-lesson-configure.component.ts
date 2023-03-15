import { Component, ElementRef, ViewChild } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  templateUrl: './add-lesson-configure.component.html'
})
export class AddLessonConfigureComponent {
  name: string;
  @ViewChild('nameField') nameField: ElementRef;

  constructor(private upgrade: UpgradeModule) {}

  ngAfterViewInit() {
    this.nameField.nativeElement.focus();
  }

  protected cancel(): void {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }

  protected next(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.add-lesson.choose-location', {
      name: this.name
    });
  }
}
