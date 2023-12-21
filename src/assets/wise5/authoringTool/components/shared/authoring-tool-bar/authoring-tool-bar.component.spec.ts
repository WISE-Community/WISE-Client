import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthoringToolBarComponent } from './authoring-tool-bar.component';
import { NotificationService } from '../../../../services/notificationService';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SaveIndicatorModule } from '../../../../../wise5/common/save-indicator/save-indicator.module';

describe('AuthoringToolBarComponent', () => {
  let component: AuthoringToolBarComponent;
  let fixture: ComponentFixture<AuthoringToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthoringToolBarComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        SaveIndicatorModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [NotificationService]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthoringToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
