import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { SelectMenuComponent } from './select-menu.component';

describe('SelectMenuComponent', () => {
  let component: SelectMenuComponent;
  let fixture: ComponentFixture<SelectMenuComponent>;
  let loader: HarnessLoader;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SelectMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMenuComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render placeholder text from input', () => {
    fixture.componentRef.setInput('placeholderText', 'Choose category');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('mat-label');
    expect(label.textContent.trim()).toBe('Choose category');
  });

  it('should render options and emit update when selection changes', async () => {
    fixture.componentRef.setInput('options', [
      { id: 'opt1', name: 'Option 1' },
      { id: 'opt2', name: 'Option 2' }
    ]);
    fixture.componentRef.setInput('valueProp', 'id');
    fixture.componentRef.setInput('viewValueProp', 'name');
    fixture.detectChanges();

    let emittedValue: any;
    component.change.subscribe((val) => {
      emittedValue = val;
    });

    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    expect(options.length).toBe(2);
    expect(await options[0].getText()).toBe('Option 1');
    expect(await options[1].getText()).toBe('Option 2');

    await options[1].click();
    expect(emittedValue).toBe('opt2');
  });

  it('should synchronize value input to the select control', async () => {
    fixture.componentRef.setInput('options', [
      { value: 'apple', viewValue: 'Apple' },
      { value: 'banana', viewValue: 'Banana' }
    ]);
    fixture.componentRef.setInput('value', 'banana');
    fixture.detectChanges();

    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.getValueText()).toBe('Banana');
  });

  it('should disable and enable the select control when disable input changes', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.isDisabled()).toBeFalse();

    fixture.componentRef.setInput('disable', true);
    fixture.detectChanges();
    expect(await select.isDisabled()).toBeTrue();

    fixture.componentRef.setInput('disable', false);
    fixture.detectChanges();
    expect(await select.isDisabled()).toBeFalse();
  });

  it('should support multi-select trigger text', async () => {
    const multiFixture = TestBed.createComponent(SelectMenuComponent);
    multiFixture.componentRef.setInput('multiple', true);
    multiFixture.componentRef.setInput('options', [
      { value: 'A', viewValue: 'Alpha' },
      { value: 'B', viewValue: 'Beta' },
      { value: 'C', viewValue: 'Gamma' }
    ]);
    multiFixture.componentRef.setInput('value', ['A', 'B']);
    multiFixture.detectChanges();
    await multiFixture.whenStable();
    multiFixture.detectChanges();

    const multiLoader = TestbedHarnessEnvironment.loader(multiFixture);
    const select = await multiLoader.getHarness(MatSelectHarness);
    const valueText = await select.getValueText();
    expect(valueText).toContain('A');
    expect(valueText).toContain('+1 more');

    const trigger = multiFixture.nativeElement.querySelector('mat-select-trigger');
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain('A');
    expect(trigger?.textContent).toContain('+1 more');
  });
});
