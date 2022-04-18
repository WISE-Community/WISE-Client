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

let component: VLEComponent;
let fixture: ComponentFixture<VLEComponent>;
let saveVLEEventSpy: jasmine.Spy;

describe('VLEComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatBadgeModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatSidenavModule,
        MatSnackBarModule,
        UpgradeModule
      ],
      declarations: [
        NavigationComponent,
        NodeComponent,
        NotebookNotesComponent,
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
    spyOn(vleProjectService, 'getProjectRootNode').and.returnValue({ id: 'group0' });
    spyOn(vleProjectService, 'getNodeById').and.returnValue({});
    const projectService = TestBed.inject(ProjectService);
    spyOn(projectService, 'getSpaces').and.returnValue([]);
    spyOn(projectService, 'getProjectRootNode').and.returnValue({ id: 'group0' });
    const notebookService = TestBed.inject(NotebookService);
    spyOn(notebookService, 'isNotebookEnabled').and.returnValue(false);
    const configService = TestBed.inject(ConfigService);
    spyOn(configService, 'isEndedAndLocked').and.returnValue(false);
    spyOn(configService, 'isRunActive').and.returnValue(true);
    const studentDataService = TestBed.inject(StudentDataService);
    spyOn(studentDataService, 'getNodeStatuses').and.returnValue({ group0: { progress: {} } });
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
});
