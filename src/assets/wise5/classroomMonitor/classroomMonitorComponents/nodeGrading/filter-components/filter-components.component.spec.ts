import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponentsComponent } from './filter-components.component';
import { MockProvider } from 'ng-mocks';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { ComponentContent } from '../../../../common/ComponentContent';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

let component: FilterComponentsComponent;
let fixture: ComponentFixture<FilterComponentsComponent>;
let loader: HarnessLoader;
let select: MatSelectHarness;
describe('FilterComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponentsComponent],
      providers: [MockProvider(ComponentTypeService)]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponentsComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
  });
  onlyOneComponent();
  moreThanOneComponent();
});

function onlyOneComponent() {
  describe('when there is only 1 component', () => {
    beforeEach(async () => {
      component.components = [
        {
          id: 'c1',
          type: 'MultipleChoice'
        } as ComponentContent
      ];
      component.selectedComponents = component.components;
      component.ngOnChanges();
      fixture.detectChanges();
      select = await loader.getHarness(MatSelectHarness);
    });
    it('should be disabled', async () => {
      expect(await select.isDisabled()).toBe(true);
    });

    it('should show star icon if component has !important tag', () => {
      component.components[0].tags = ['!important'];
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('mat-icon');
      expect(icon).toBeTruthy();
      expect(icon.textContent.trim()).toBe('star');
    });

    it('should not show star icon if component does not have !important tag', () => {
      component.components[0].tags = [];
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('mat-icon');
      expect(icon).toBeFalsy();
    });
  });
}

function moreThanOneComponent() {
  describe('when there is more than 1 component', () => {
    beforeEach(async () => {
      component.components = [
        {
          id: 'c1',
          type: 'MultipleChoice'
        } as ComponentContent,
        {
          id: 'c2',
          type: 'OpenResponse'
        } as ComponentContent
      ];
      component.selectedComponents = [component.components[0]];
      component.ngOnChanges();
      fixture.detectChanges();
      select = await loader.getHarness(MatSelectHarness);
    });
    it('should show options', async () => {
      await select.open();
      const options = await select.getOptions();
      expect(options.length).toBe(2);
      expect(await options[0].isSelected()).toBe(true);
      expect(await options[1].isSelected()).toBe(false);
    });
    it('clicking on an option should emit selected components', async () => {
      const spy = spyOn(component.componentsChange, 'emit').and.callThrough();
      await select.open();
      const options = await select.getOptions();
      await options[1].click();
      expect(spy).toHaveBeenCalledWith([
        {
          id: 'c1',
          type: 'MultipleChoice'
        } as ComponentContent,
        {
          id: 'c2',
          type: 'OpenResponse'
        } as ComponentContent
      ]);
    });

    it('should show star icon for option with !important tag', async () => {
      component.components[0].tags = ['!important'];
      fixture.detectChanges();
      await select.open();

      const options = await select.getOptions();
      const option1Text = await options[0].getText();
      const option2Text = await options[1].getText();

      expect(option1Text).toContain('star');
      expect(option2Text).not.toContain('star');
    });
  });
}
