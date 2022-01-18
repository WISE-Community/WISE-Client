import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../assets/wise5/services/annotationService';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { SessionService } from '../../../assets/wise5/services/sessionService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { UtilService } from '../../../assets/wise5/services/utilService';
import { EditComponentExcludeFromTotalScoreComponent } from '../edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../edit-component-max-score/edit-component-max-score.component';
import { EditComponentRubricComponent } from '../edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../edit-component-width/edit-component-width.component';
import { EditConnectedComponentsAddButtonComponent } from '../edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsComponent } from '../edit-connected-components/edit-connected-components.component';

import { EditCommonAdvancedComponent } from './edit-common-advanced.component';

describe('EditCommonAdvancedComponent', () => {
  let component: EditCommonAdvancedComponent;
  let fixture: ComponentFixture<EditCommonAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        UpgradeModule
      ],
      declarations: [
        EditCommonAdvancedComponent,
        EditComponentExcludeFromTotalScoreComponent,
        EditComponentJsonComponent,
        EditComponentMaxScoreComponent,
        EditComponentRubricComponent,
        EditComponentTagsComponent,
        EditComponentSaveButtonComponent,
        EditComponentSubmitButtonComponent,
        EditComponentWidthComponent,
        EditConnectedComponentsAddButtonComponent,
        EditConnectedComponentsComponent
      ],
      providers: [
        AnnotationService,
        ConfigService,
        NotificationService,
        ProjectService,
        SessionService,
        TeacherProjectService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommonAdvancedComponent);
    component = fixture.componentInstance;
    component.authoringComponentContent = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
