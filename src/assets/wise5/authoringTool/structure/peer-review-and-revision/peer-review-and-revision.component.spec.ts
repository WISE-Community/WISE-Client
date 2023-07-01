import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision.component';

describe('PeerReviewAndRevisionComponent', () => {
  let component: PeerReviewAndRevisionComponent;
  let fixture: ComponentFixture<PeerReviewAndRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerReviewAndRevisionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PeerReviewAndRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
