import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../services/configService';
import { NotebookService } from '../services/notebookService';
import { VLEProjectService } from './vleProjectService';
import { VLEComponent } from './vle.component';
import { StudentDataService } from '../services/studentDataService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InitializeVLEService } from '../services/initializeVLEService';
import { StudentTeacherCommonServicesModule } from '../../../app/student-teacher-common-services.module';
import { PauseScreenService } from '../services/pauseScreenService';
import { StudentNotificationService } from '../services/studentNotificationService';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: VLEComponent;
let fixture: ComponentFixture<VLEComponent>;
const node1Id: string = 'node1';
let saveVLEEventSpy: jasmine.Spy;

describe('VLEComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, VLEComponent, StudentTeacherCommonServicesModule],
      providers: [
        InitializeVLEService,
        PauseScreenService,
        provideRouter([]),
        StudentNotificationService,
        VLEProjectService,
        provideHttpClient(withInterceptorsFromDi())
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
