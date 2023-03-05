import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ShowGroupWorkGradingComponent } from './show-group-work-grading.component';

describe('ShowGroupWorkGradingComponent', () => {
  let component: ShowGroupWorkGradingComponent;
  let fixture: ComponentFixture<ShowGroupWorkGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [ShowGroupWorkGradingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowGroupWorkGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
