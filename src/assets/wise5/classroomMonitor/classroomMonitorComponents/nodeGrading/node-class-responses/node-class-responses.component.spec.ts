import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeClassResponsesComponent } from './node-class-responses.component';
import { AnnotationService } from '../../../../services/annotationService';
import { MockComponent, MockProvider, MockProviders } from 'ng-mocks';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { ComponentServiceLookupService } from '../../../../services/componentServiceLookupService';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { NotificationService } from '../../../../services/notificationService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { of } from 'rxjs';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';

describe('NodeClassResponsesComponent', () => {
  let component: NodeClassResponsesComponent;
  let fixture: ComponentFixture<NodeClassResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(WorkgroupSelectAutocompleteComponent)],
      imports: [NodeClassResponsesComponent],
      providers: [
        MockProviders(
          AnnotationService,
          ClassroomStatusService,
          ComponentServiceLookupService,
          ConfigService,
          TeacherDataService,
          NotificationService
        ),
        MockProvider(TeacherProjectService, {
          projectSaved$: of()
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NodeClassResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
