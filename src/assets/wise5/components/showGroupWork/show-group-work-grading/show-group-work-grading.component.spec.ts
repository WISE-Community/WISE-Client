import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ShowGroupWorkGradingComponent } from './show-group-work-grading.component';
import { provideHttpClient } from '@angular/common/http';

describe('ShowGroupWorkGradingComponent', () => {
  let component: ShowGroupWorkGradingComponent;
  let fixture: ComponentFixture<ShowGroupWorkGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowGroupWorkGradingComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowGroupWorkGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
