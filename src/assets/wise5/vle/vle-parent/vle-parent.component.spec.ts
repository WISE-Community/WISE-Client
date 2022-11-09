import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { InitializeVLEService } from '../../services/initializeVLEService';
import { NodeClickLockedService } from '../../services/nodeClickLockedService';
import { PauseScreenService } from '../../services/pauseScreenService';
import { ProjectService } from '../../services/projectService';
import { StudentNotificationService } from '../../services/studentNotificationService';
import { VLEProjectService } from '../vleProjectService';
import { VLEParentComponent } from './vle-parent.component';

let fixture: ComponentFixture<VLEParentComponent>;
let initializeVLEService: InitializeVLEService;
let router: Router;

describe('VLEParentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [VLEParentComponent],
      providers: [
        InitializeVLEService,
        NodeClickLockedService,
        PauseScreenService,
        ProjectService,
        StudentNotificationService,
        VLEProjectService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(VLEParentComponent);
    initializeVLEService = TestBed.inject(InitializeVLEService);
    router = TestBed.inject(Router);
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('preview route should initialize preview', () => {
      spyOnProperty(router, 'url', 'get').and.returnValue('/preview/unit/123');
      const initPreviewSpy = spyOn(initializeVLEService, 'initializePreview');
      fixture.detectChanges();
      expect(initPreviewSpy).toHaveBeenCalledWith('123');
    });
    it('student route should initialize student', () => {
      spyOnProperty(router, 'url', 'get').and.returnValue('/student/unit/123');
      const initStudentSpy = spyOn(initializeVLEService, 'initializeStudent');
      fixture.detectChanges();
      expect(initStudentSpy).toHaveBeenCalledWith('123');
    });
  });
}
