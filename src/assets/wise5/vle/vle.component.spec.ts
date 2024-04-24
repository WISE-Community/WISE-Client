import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfigService } from '../services/configService';
import { NotebookService } from '../services/notebookService';
import { VLEProjectService } from './vleProjectService';
import { VLEComponent } from './vle.component';
import { StudentDataService } from '../services/studentDataService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TopBarComponent } from '../../../app/student/top-bar/top-bar.component';
import { NodeComponent } from './node/node.component';
import { NotebookNotesComponent } from '../../../app/notebook/notebook-notes/notebook-notes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { NodeIconComponent } from './node-icon/node-icon.component';
import { FormsModule } from '@angular/forms';
import { InitializeVLEService } from '../services/initializeVLEService';
import { StudentTeacherCommonServicesModule } from '../../../app/student-teacher-common-services.module';
import { PauseScreenService } from '../services/pauseScreenService';
import { StudentNotificationService } from '../services/studentNotificationService';
import { SafeUrl } from '../../../assets/wise5/directives/safeUrl/safe-url.pipe';

let component: VLEComponent;
let fixture: ComponentFixture<VLEComponent>;
const node1Id: string = 'node1';
let saveVLEEventSpy: jasmine.Spy;

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
        RouterTestingModule,
        StudentTeacherCommonServicesModule,
        TopBarComponent
      ],
      declarations: [
        NavigationComponent,
        NodeComponent,
        NodeIconComponent,
        NodeStatusIcon,
        NotebookNotesComponent,
        SafeUrl,
        StepToolsComponent,
        VLEComponent
      ],
      providers: [
        InitializeVLEService,
        PauseScreenService,
        StudentNotificationService,
        VLEProjectService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const vleProjectService = TestBed.inject(VLEProjectService);
    spyOn(vleProjectService, 'getProjectScript').and.returnValue(null);
    const notebookService = TestBed.inject(NotebookService);
    spyOn(notebookService, 'isNotebookEnabled').and.returnValue(false);
    const configService = TestBed.inject(ConfigService);
    spyOn(configService, 'isEndedAndLocked').and.returnValue(false);
    const studentDataService = TestBed.inject(StudentDataService);
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
