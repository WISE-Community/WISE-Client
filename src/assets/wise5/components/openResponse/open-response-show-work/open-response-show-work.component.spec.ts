import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { OpenResponseShowWorkComponent } from './open-response-show-work.component';
import { AnnotationService } from '../../../services/annotationService';
import { UserService } from '../../../../../app/services/user.service';
import { ProjectService } from '../../../services/projectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OpenResponseShowWorkComponent', () => {
  let component: OpenResponseShowWorkComponent;
  let fixture: ComponentFixture<OpenResponseShowWorkComponent>;
  let annotationService: AnnotationService;
  let userService: UserService;
  let projectService: ProjectService;
  const mockComponentState = {
    id: 1,
    studentData: {
      response: 'Student answer',
      attachments: [
        { type: 'audio', url: 'audio1.mp3' },
        { type: 'audio', url: 'audio2.mp3' },
        { type: 'image', url: 'image1.png' },
        { type: 'file', url: 'document.pdf' }
      ]
    }
  };
  const mockCRaterAnnotation = {
    id: 1,
    type: 'autoScore',
    data: {
      ideas: [{ name: 'idea1', detected: true }]
    },
    studentWorkId: 1
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenResponseShowWorkComponent, StudentTeacherCommonServicesModule],
      providers: [
        { provide: UserService, useValue: { isTeacher() {} } },
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenResponseShowWorkComponent);
    component = fixture.componentInstance;
    annotationService = TestBed.inject(AnnotationService);
    userService = TestBed.inject(UserService);
    projectService = TestBed.inject(ProjectService);
    component.componentState = mockComponentState;
    component.nodeId = 'node1';
    component.componentId = 'component1';
    spyOn(projectService, 'getComponent').and.returnValue({
      id: 'component1',
      type: 'OpenResponse',
      cRater: {
        rubric: {
          ideas: [{ name: 'idea1' }]
        }
      }
    } as any);
    spyOn(projectService, 'injectAssetPaths').and.callFake((arg) => arg);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize student response and process attachments', () => {
      spyOn(annotationService, 'getAnnotationsByStudentWorkId').and.returnValue([]);
      fixture.detectChanges();
      expect(component['studentResponse']).toBe('Student answer');
      expect(component['audioAttachments'].length).toBe(2);
      expect(component['otherAttachments'].length).toBe(2);
    });

    it('should set up CRater rubric and annotations when CRater is configured', () => {
      spyOn(annotationService, 'getAnnotationsByStudentWorkId').and.returnValue([
        mockCRaterAnnotation
      ] as any);
      spyOn(userService, 'isTeacher').and.returnValue(true);
      fixture.detectChanges();
      expect(annotationService.getAnnotationsByStudentWorkId).toHaveBeenCalledWith(1);
    });

    it('should show detected ideas when user is teacher and CRater annotation exists', () => {
      spyOn(annotationService, 'getAnnotationsByStudentWorkId').and.returnValue([
        mockCRaterAnnotation
      ] as any);
      spyOn(userService, 'isTeacher').and.returnValue(true);
      fixture.detectChanges();
      expect(component['showDetectedIdeas']).toBe(true);
    });

    it('should not show detected ideas when user is not a teacher and there is no additional settings', () => {
      spyOn(annotationService, 'getAnnotationsByStudentWorkId').and.returnValue([]);
      spyOn(userService, 'isTeacher').and.returnValue(false);
      fixture.detectChanges();
      expect(component['showDetectedIdeas']).toBe(undefined);
    });

    it('should show detected ideas when user is not a teacher but there is additional settings', () => {
      spyOn(annotationService, 'getAnnotationsByStudentWorkId').and.returnValue([
        mockCRaterAnnotation
      ] as any);
      spyOn(userService, 'isTeacher').and.returnValue(false);
      component.additionalSettings = { showDetectedIdeas: true };
      fixture.detectChanges();
      expect(component['showDetectedIdeas']).toBe(true);
    });
  });
});
