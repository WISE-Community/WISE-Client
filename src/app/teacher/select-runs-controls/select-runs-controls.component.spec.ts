import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectRunsControlsComponent } from './select-runs-controls.component';
import { SelectRunsControlsModule } from './select-runs-controls.module';

describe('SelectRunsControlsComponent', () => {
  let component: SelectRunsControlsComponent;
  let fixture: ComponentFixture<SelectRunsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectRunsControlsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectRunsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
