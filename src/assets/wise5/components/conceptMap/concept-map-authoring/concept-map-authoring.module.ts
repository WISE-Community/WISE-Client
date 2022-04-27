import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UpgradeModule } from '@angular/upgrade/static';
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
import { UtilService } from '../../../services/utilService';
import { ConceptMapService } from '../conceptMapService';
import { ConceptMapAuthoring } from './concept-map-authoring.component';

@NgModule({
  declarations: [ConceptMapAuthoring, EditComponentPrompt],
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    UpgradeModule
  ],
  providers: [
    AnnotationService,
    ConceptMapService,
    ConfigService,
    NodeService,
    ProjectAssetService,
    ProjectService,
    SessionService,
    StudentAssetService,
    StudentDataService,
    TagService,
    TeacherProjectService,
    UtilService
  ],
  exports: [ConceptMapAuthoring, EditComponentPrompt]
})
export class ConceptMapAuthoringModule {}
