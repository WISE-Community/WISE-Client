import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../services/annotationService';
import { ConfigService } from '../services/configService';
import { NotebookService } from '../services/notebookService';
import { NotificationService } from '../services/notificationService';
import { VLEProjectService } from './vleProjectService';
import { VLEComponent } from './vle.component';
import { SessionService } from '../services/sessionService';
import { StudentDataService } from '../services/studentDataService';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProjectService } from '../services/projectService';
import { UtilService } from '../services/utilService';
import { StudentAssetService } from '../services/studentAssetService';
import { TagService } from '../services/tagService';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TopBarComponent } from '../../../app/student/top-bar/top-bar.component';
import { NodeComponent } from './node/node.component';
import { NotebookNotesComponent } from '../../../app/notebook/notebook-notes/notebook-notes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentService } from '../components/componentService';
import { NodeService } from '../services/nodeService';
import { StudentAccountMenuComponent } from './student-account-menu/student-account-menu.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { NavigationComponent } from '../themes/default/navigation/navigation.component';
import { StepToolsComponent } from '../themes/default/themeComponents/stepTools/step-tools.component';
import { MatSelectModule } from '@angular/material/select';
import { NodeStatusIcon } from '../themes/default/themeComponents/nodeStatusIcon/node-status-icon.component';
import { NodeIconComponent } from '../classroomMonitor/classroomMonitorComponents/shared/nodeIcon/node-icon.component';
import { Node } from '../common/Node';
import { FormsModule } from '@angular/forms';

let component: VLEComponent;
let fixture: ComponentFixture<VLEComponent>;
const group0Id: string = 'group0';
const node1Id: string = 'node1';
let saveVLEEventSpy: jasmine.Spy;

class MockUpgradeModule {
  $injector: any = {
    get() {
      return { params: {}, go: () => {} };
    }
  };
}

describe('VLEComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatBadgeModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatSelectModule,
        MatSidenavModule,
        MatSnackBarModule,
        UpgradeModule
      ],
      declarations: [
        NavigationComponent,
        NodeComponent,
        NodeIconComponent,
        NodeStatusIcon,
        NotebookNotesComponent,
        StepToolsComponent,
        StudentAccountMenuComponent,
        TopBarComponent,
        VLEComponent
      ],
      providers: [
        AnnotationService,
        ConfigService,
        ComponentService,
        NodeService,
        NotebookService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        { provide: UpgradeModule, useClass: MockUpgradeModule },
        UtilService,
        VLEProjectService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const vleProjectService = TestBed.inject(VLEProjectService);
    spyOn(vleProjectService, 'getStyle').and.returnValue(null);
    spyOn(vleProjectService, 'getProjectTitle').and.returnValue('My Project');
    spyOn(vleProjectService, 'getProjectScript').and.returnValue(null);
    spyOn(vleProjectService, 'getStartNodeId').and.returnValue('node1');
    spyOn(vleProjectService, 'getThemeSettings').and.returnValue({});
    spyOn(vleProjectService, 'getProjectRootNode').and.returnValue({ id: group0Id });
    spyOn(vleProjectService, 'getNodeById').and.returnValue({});
    const projectService = TestBed.inject(ProjectService);
    spyOn(projectService, 'getSpaces').and.returnValue([]);
    spyOn(projectService, 'getProjectRootNode').and.returnValue({ id: group0Id });
    const notebookService = TestBed.inject(NotebookService);
    spyOn(notebookService, 'isNotebookEnabled').and.returnValue(false);
    const configService = TestBed.inject(ConfigService);
    spyOn(configService, 'isEndedAndLocked').and.returnValue(false);
    spyOn(configService, 'isRunActive').and.returnValue(true);
    const studentDataService = TestBed.inject(StudentDataService);
    spyOn(studentDataService, 'getNodeStatuses').and.returnValue({
      group0: { progress: {} },
      node1: { icon: '' }
    });
    spyOn(studentDataService, 'getRunStatus').and.returnValue({
      periods: [{ periodId: 1, periodName: '1' }]
    });
    spyOn(studentDataService, 'getCurrentNode').and.returnValue({ id: node1Id });
    spyOn(studentDataService, 'getCurrentNodeId').and.returnValue(node1Id);
    saveVLEEventSpy = spyOn(studentDataService, 'saveVLEEvent');
    saveVLEEventSpy.and.callFake(() => {
      return new Promise(() => {});
    });
    fixture = TestBed.createComponent(VLEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
