import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WiseLinkAuthoringDialogComponent } from './wise-link-authoring-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('WiseLinkAuthoringDialogComponent', () => {
  let component: WiseLinkAuthoringDialogComponent;
  let fixture: ComponentFixture<WiseLinkAuthoringDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [WiseLinkAuthoringDialogComponent],
    imports: [BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        StudentTeacherCommonServicesModule],
    providers: [{ provide: MatDialogRef, useValue: {} }, TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(WiseLinkAuthoringDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
