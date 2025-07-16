import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '../../../assets/wise5/common/Component';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditComponentExcludeFromTotalScoreComponent } from '../edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../edit-component-max-score/edit-component-max-score.component';
import { EditComponentRubricComponent } from '../edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../edit-component-tags/edit-component-tags.component';
import { EditConnectedComponentsComponent } from '../edit-connected-components/edit-connected-components.component';
import { EditCommonAdvancedComponent } from './edit-common-advanced.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EditComponentDefaultFeedback } from '../edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';
import { EditComponentWidthComponent } from '../edit-component-width/edit-component-width.component';
import { EditComponentConstraintsComponent } from '../edit-component-constraints/edit-component-constraints.component';
import { EditComponentMaxSubmitComponent } from '../edit-component-max-submit/edit-component-max-submit.component';

describe('EditCommonAdvancedComponent', () => {
  let component: EditCommonAdvancedComponent;
  let fixture: ComponentFixture<EditCommonAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCommonAdvancedComponent],
      imports: [
        BrowserAnimationsModule,
        EditComponentConstraintsComponent,
        EditComponentDefaultFeedback,
        EditComponentExcludeFromTotalScoreComponent,
        EditComponentMaxScoreComponent,
        EditComponentMaxSubmitComponent,
        EditComponentJsonComponent,
        EditComponentRubricComponent,
        EditComponentSaveButtonComponent,
        EditComponentSubmitButtonComponent,
        EditComponentTagsComponent,
        EditComponentWidthComponent,
        EditConnectedComponentsComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommonAdvancedComponent);
    component = fixture.componentInstance;
    component.component = { content: {} } as Component;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
