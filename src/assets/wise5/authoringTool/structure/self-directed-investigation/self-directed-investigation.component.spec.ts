import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfDirectedInvestigationComponent } from './self-directed-investigation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SelfDirectedInvestigationComponent2', () => {
  let component: SelfDirectedInvestigationComponent;
  let fixture: ComponentFixture<SelfDirectedInvestigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfDirectedInvestigationComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SelfDirectedInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
