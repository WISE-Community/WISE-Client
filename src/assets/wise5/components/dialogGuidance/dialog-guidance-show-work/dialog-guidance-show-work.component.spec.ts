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
    spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue(new CRaterRubric());
    component.componentState = {
      studentData: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
