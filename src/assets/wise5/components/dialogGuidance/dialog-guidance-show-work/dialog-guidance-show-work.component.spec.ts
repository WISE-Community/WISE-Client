import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { DialogGuidanceShowWorkComponent } from './dialog-guidance-show-work.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CRaterService } from '../../../services/cRaterService';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { UserService } from '../../../../../app/services/user.service';

describe('DialogGuidanceShowWorkComponent', () => {
  let component: DialogGuidanceShowWorkComponent;
  let fixture: ComponentFixture<DialogGuidanceShowWorkComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogGuidanceShowWorkComponent, StudentTeacherCommonServicesModule],
      providers: [
        { provide: CRaterService, useValue: { getCRaterRubric() {} } },
        { provide: UserService, useValue: { isTeacher() {} } },
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceShowWorkComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue(new CRaterRubric());
    component.componentState = {
      studentData: {}
    };
  });

  describe('ngOnInit', () => {
    it('should show detected ideas when user is teacher', () => {
      spyOn(userService, 'isTeacher').and.returnValue(true);
      fixture.detectChanges();
      expect(component['showDetectedIdeas']).toBe(true);
    });

    it('should show detected ideas when user is not a teacher but there is additional settings', () => {
      spyOn(userService, 'isTeacher').and.returnValue(false);
      component.additionalSettings = { showDetectedIdeas: true };
      fixture.detectChanges();
      expect(component['showDetectedIdeas']).toBe(true);
    });
  });
});
