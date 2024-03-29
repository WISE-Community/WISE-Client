import { Component, Input } from '@angular/core';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import {
  insertWiseLinks,
  replaceWiseLinks
} from '../../../assets/wise5/common/wise-link/wise-link';

@Component({
  selector: 'edit-component-rubric',
  templateUrl: 'edit-component-rubric.component.html',
  styleUrls: ['edit-component-rubric.component.scss']
})
export class EditComponentRubricComponent {
  @Input()
  componentContent: any;
  rubric: string;
  showRubricAuthoring: boolean = false;

  constructor(
    private ConfigService: ConfigService,
    private ProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    const componentContent = this.ConfigService.replaceStudentNames(
      this.ProjectService.injectAssetPaths(this.componentContent)
    );
    if (componentContent.rubric == null) {
      this.rubric = '';
    } else {
      this.rubric = replaceWiseLinks(componentContent.rubric);
    }
  }

  rubricChanged(): void {
    this.componentContent.rubric = this.ConfigService.removeAbsoluteAssetPaths(
      insertWiseLinks(this.rubric)
    );
    this.ProjectService.componentChanged();
  }
}
