import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectAllItemsCheckboxComponent } from './select-all-items-checkbox.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('SelectAllItemsCheckboxComponent', () => {
  let component: SelectAllItemsCheckboxComponent;
  let fixture: ComponentFixture<SelectAllItemsCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule, MatTooltipModule, SelectAllItemsCheckboxComponent]
    });
    fixture = TestBed.createComponent(SelectAllItemsCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
