import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectAllProjectsCheckboxComponent } from './select-all-projects-checkbox.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('SelectAllProjectsCheckboxComponent', () => {
  let component: SelectAllProjectsCheckboxComponent;
  let fixture: ComponentFixture<SelectAllProjectsCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAllProjectsCheckboxComponent],
      imports: [MatCheckboxModule]
    });
    fixture = TestBed.createComponent(SelectAllProjectsCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
