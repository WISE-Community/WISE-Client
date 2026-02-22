import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectRunsControlsComponent } from './select-runs-controls.component';

describe('SelectRunsControlsComponent', () => {
  let component: SelectRunsControlsComponent;
  let fixture: ComponentFixture<SelectRunsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectRunsControlsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectRunsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
