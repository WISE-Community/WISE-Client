import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JigsawComponent } from './jigsaw.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDividerModule } from '@angular/material/divider';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';

describe('JigsawComponent', () => {
  let component: JigsawComponent;
  let fixture: ComponentFixture<JigsawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JigsawComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatDividerModule,
        MatRadioModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();
    window.history.pushState({}, '', '');
    fixture = TestBed.createComponent(JigsawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
