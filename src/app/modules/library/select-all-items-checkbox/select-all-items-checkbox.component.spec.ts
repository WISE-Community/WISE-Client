import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectAllItemsCheckboxComponent } from './select-all-items-checkbox.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

describe('SelectAllItemsCheckboxComponent', () => {
  let component: SelectAllItemsCheckboxComponent;
  let fixture: ComponentFixture<SelectAllItemsCheckboxComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectAllItemsCheckboxComponent]
    });
    fixture = TestBed.createComponent(SelectAllItemsCheckboxComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be unchecked when 0 items are selected', async () => {
    fixture.componentRef.setInput('numAllItems', 5);
    fixture.componentRef.setInput('numSelectedItems', 0);
    fixture.detectChanges();

    const matCheckbox = await loader.getHarness(MatCheckboxHarness);
    expect(await matCheckbox.isChecked()).toBeFalse();
    expect(await matCheckbox.isIndeterminate()).toBeFalse();
  });

  it('should be indeterminate when some items are selected', async () => {
    fixture.componentRef.setInput('numAllItems', 5);
    fixture.componentRef.setInput('numSelectedItems', 2);
    fixture.detectChanges();

    const matCheckbox = await loader.getHarness(MatCheckboxHarness);
    expect(await matCheckbox.isIndeterminate()).toBeTrue();
  });

  it('should be checked when all items are selected', async () => {
    fixture.componentRef.setInput('numAllItems', 5);
    fixture.componentRef.setInput('numSelectedItems', 5);
    fixture.detectChanges();

    const matCheckbox = await loader.getHarness(MatCheckboxHarness);
    expect(await matCheckbox.isChecked()).toBeTrue();
    expect(await matCheckbox.isIndeterminate()).toBeFalse();
  });

  it('should emit allSelectedEvent when clicked while unchecked', () => {
    fixture.componentRef.setInput('numAllItems', 5);
    fixture.componentRef.setInput('numSelectedItems', 0);
    fixture.detectChanges();

    spyOn(component.allSelectedEvent, 'emit');
    const checkboxEl = fixture.nativeElement.querySelector('mat-checkbox');
    checkboxEl.click();
    expect(component.allSelectedEvent.emit).toHaveBeenCalled();
  });

  it('should emit noneSelectedEvent when clicked while all or some items are selected', () => {
    fixture.componentRef.setInput('numAllItems', 5);
    fixture.componentRef.setInput('numSelectedItems', 5);
    fixture.detectChanges();

    spyOn(component.noneSelectedEvent, 'emit');
    const checkboxEl = fixture.nativeElement.querySelector('mat-checkbox');
    checkboxEl.click();
    expect(component.noneSelectedEvent.emit).toHaveBeenCalled();
  });
});
