import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpgradeModule } from '@angular/upgrade/static';

describe('PeerReviewAndRevisionComponent', () => {
  let component: PeerReviewAndRevisionComponent;
  let fixture: ComponentFixture<PeerReviewAndRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerReviewAndRevisionComponent],
      imports: [HttpClientTestingModule, UpgradeModule]
    }).compileComponents();

    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          go: (route: string, params: any) => {}
        };
      }
    };
    fixture = TestBed.createComponent(PeerReviewAndRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
