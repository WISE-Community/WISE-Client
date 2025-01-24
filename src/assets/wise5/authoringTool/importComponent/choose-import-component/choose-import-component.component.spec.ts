import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChooseImportComponentComponent } from './choose-import-component.component';
import { ProjectLibraryService } from '../../../services/projectLibraryService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImportComponentService } from '../../../services/importComponentService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertComponentService } from '../../../services/insertComponentService';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

let component: ChooseImportComponentComponent;
const component1 = { id: 'component1', type: 'OpenResponse' };
const component2 = { id: 'component2', type: 'MultipleChoice' };
let fixture: ComponentFixture<ChooseImportComponentComponent>;
const group0 = { id: 'group0', type: 'group', ids: ['group1'] };
const group1 = { id: 'group1', type: 'group', title: '', startId: 'node1', ids: ['node1'] };
const node1 = {
  id: 'node1',
  type: 'node',
  title: 'First step',
  components: [component1, component2]
};
const project: any = {
  startGroupId: 'group0',
  metadata: { title: 'Project Title' },
  nodes: [group0, group1, node1],
  inactiveNodes: []
};
let projectService: TeacherProjectService;

describe('ChooseImportComponentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ChooseImportComponentComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        CopyNodesService,
        ImportComponentService,
        InsertComponentService,
        ProjectAssetService,
        ProjectLibraryService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'retrieveProjectById').and.resolveTo(project);
    window.history.pushState({ importType: 'component' }, '', '');
    fixture = TestBed.createComponent(ChooseImportComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('should create', fakeAsync(async () => {
      component.ngOnInit();
      tick();
      expect(component).toBeTruthy();
      const loader = TestbedHarnessEnvironment.loader(fixture);
      const previewStepButton = await loader.getHarness(
        MatButtonHarness.with({ selector: '[mattooltip="Preview step"]' })
      );
      expect(previewStepButton).toBeTruthy();
      const previewComponentButton = await loader.getHarness(
        MatButtonHarness.with({ selector: '[mattooltip="Preview component"]' })
      );
      expect(previewComponentButton).toBeTruthy();
    }));
  });
}
