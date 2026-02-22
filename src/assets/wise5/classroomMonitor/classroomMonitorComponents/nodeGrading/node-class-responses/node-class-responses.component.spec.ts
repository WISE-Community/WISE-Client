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
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('NodeClassResponsesComponent', () => {
  let component: NodeClassResponsesComponent;
  let fixture: ComponentFixture<NodeClassResponsesComponent>;
  let loader: HarnessLoader;

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
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component['sortedWorkgroups'] = [
      { workgroupId: 1, name: 'Workgroup 1' },
      { workgroupId: 2, name: 'Workgroup 2' }
    ];
    fixture.detectChanges();
  });

  it('clicking on the expand all button should expand all teams', async () => {
    expect(component['allWorkgroupsExpanded']).toBeFalsy();
    await (await loader.getHarness(MatButtonHarness.with({ text: '+ Expand all' }))).click();
    expect(component['allWorkgroupsExpanded']).toBeTrue();
  });
});
