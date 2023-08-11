import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectRunsControlsComponent } from './select-runs-controls.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

describe('SelectRunsControlsComponent', () => {
  let component: SelectRunsControlsComponent;
  let fixture: ComponentFixture<SelectRunsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectRunsControlsComponent],
      imports: [MatCheckboxModule, MatIconModule, MatMenuModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectRunsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
