import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfDirectedInvestigationComponent } from './self-directed-investigation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpgradeModule } from '@angular/upgrade/static';

describe('SelfDirectedInvestigationComponent2', () => {
  let component: SelfDirectedInvestigationComponent;
  let fixture: ComponentFixture<SelfDirectedInvestigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfDirectedInvestigationComponent],
      imports: [HttpClientTestingModule, UpgradeModule]
    }).compileComponents();

    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          go: (route: string, params: any) => {}
        };
      }
    };
    fixture = TestBed.createComponent(SelfDirectedInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
