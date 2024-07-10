import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectBranchCriteriaComponent } from './select-branch-criteria.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectBranchCriteriaComponent', () => {
  let component: SelectBranchCriteriaComponent;
  let fixture: ComponentFixture<SelectBranchCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SelectBranchCriteriaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectBranchCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
