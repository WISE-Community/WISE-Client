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
      fixture.detectChanges();
    });
    it('should show button when there is only 1 component', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
      expect(button.innerText).toBe('1 assessment item');
      expect(button.disabled).toBe(true);
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
      component.ngOnChanges();
      fixture.detectChanges();
      select = await loader.getHarness(MatSelectHarness);
    });
    it('should show options', async () => {
      await select.open();
      const optionGroups = await select.getOptionGroups();
      expect(optionGroups.length).toBe(1);
      expect(await optionGroups[0].getLabelText()).toBe('Assessment items to show');
      const options = await select.getOptions();
      expect(options.length).toBe(2);
      expect(await options[0].isSelected()).toBe(true);
      expect(await options[1].isSelected()).toBe(true);
    });
    it('clicking on an option should emit selected components', async () => {
      const spy = spyOn(component.componentsChange, 'emit').and.callThrough();
      await select.open();
      const options = await select.getOptions();
      await options[0].click();
      expect(spy).toHaveBeenCalledWith([
        {
          id: 'c2',
          type: 'OpenResponse'
        } as ComponentContent
      ]);
    });
  });
}
