import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { AuthorUrlParametersComponent } from '../../../../../app/authoring-tool/author-url-parameters/author-url-parameters.component';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EmbeddedService } from '../embeddedService';
import { EmbeddedAuthoring } from './embedded-authoring.component';

@NgModule({
  declarations: [EmbeddedAuthoring, EditComponentPrompt, AuthorUrlParametersComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule
  ],
  providers: [
    AnnotationService,
    ConfigService,
    EmbeddedService,
    NodeService,
    ProjectAssetService,
    ProjectService,
    SessionService,
    StudentAssetService,
    StudentDataService,
    TagService,
    TeacherProjectService
  ],
  exports: [EmbeddedAuthoring, EditComponentPrompt, AuthorUrlParametersComponent]
})
export class EmbeddedAuthoringModule {}
