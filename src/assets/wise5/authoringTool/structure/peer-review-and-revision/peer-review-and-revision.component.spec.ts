import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PeerReviewAndRevisionComponent', () => {
  let component: PeerReviewAndRevisionComponent;
  let fixture: ComponentFixture<PeerReviewAndRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerReviewAndRevisionComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PeerReviewAndRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
