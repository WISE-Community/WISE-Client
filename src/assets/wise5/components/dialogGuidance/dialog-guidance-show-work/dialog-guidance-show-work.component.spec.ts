import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { DialogGuidanceShowWorkComponent } from './dialog-guidance-show-work.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CRaterService } from '../../../services/cRaterService';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';

describe('DialogGuidanceShowWorkComponent', () => {
  let component: DialogGuidanceShowWorkComponent;
  let fixture: ComponentFixture<DialogGuidanceShowWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogGuidanceShowWorkComponent, StudentTeacherCommonServicesModule],
      providers: [
        { provide: CRaterService, useValue: { getCRaterRubric() {} } },
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceShowWorkComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue({} as CRaterRubric);
    component.componentState = {
      studentData: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
