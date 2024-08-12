import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { DialogResponse } from '../DialogResponse';
import { DialogResponseComponent } from './dialog-response.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DialogResponseComponent', () => {
  let component: DialogResponseComponent;
  let fixture: ComponentFixture<DialogResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DialogResponseComponent],
    imports: [FlexLayoutModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResponseComponent);
    component = fixture.componentInstance;
    component.response = new DialogResponse('Hello World', new Date().getTime(), 1);
    component.response.user = 'Student';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
