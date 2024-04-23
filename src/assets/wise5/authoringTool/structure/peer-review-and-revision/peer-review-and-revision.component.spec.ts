import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDividerModule } from '@angular/material/divider';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';

describe('PeerReviewAndRevisionComponent', () => {
  let component: PeerReviewAndRevisionComponent;
  let fixture: ComponentFixture<PeerReviewAndRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerReviewAndRevisionComponent],
      imports: [
        HttpClientTestingModule,
        MatDividerModule,
        RouterTestingModule,

        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();
    window.history.pushState({}, '', '');
    fixture = TestBed.createComponent(PeerReviewAndRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
