import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchCriteriaHelpComponent } from './branch-criteria-help.component';

describe('BranchCriteriaHelpComponent', () => {
  let component: BranchCriteriaHelpComponent;
  let fixture: ComponentFixture<BranchCriteriaHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchCriteriaHelpComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BranchCriteriaHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
