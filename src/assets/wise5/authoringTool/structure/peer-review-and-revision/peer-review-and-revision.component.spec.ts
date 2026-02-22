import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MockProvider } from 'ng-mocks';

describe('PeerReviewAndRevisionComponent', () => {
  let component: PeerReviewAndRevisionComponent;
  let fixture: ComponentFixture<PeerReviewAndRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerReviewAndRevisionComponent],
      providers: [MockProvider(TeacherProjectService), provideHttpClient(), provideRouter([])]
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
