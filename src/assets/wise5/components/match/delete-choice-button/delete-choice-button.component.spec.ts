import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteChoiceButtonComponent } from './delete-choice-button.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

let component: DeleteChoiceButtonComponent;
let fixture: ComponentFixture<DeleteChoiceButtonComponent>;
let loader: HarnessLoader;
describe('DeleteChoiceButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteChoiceButtonComponent]
    });
    fixture = TestBed.createComponent(DeleteChoiceButtonComponent);
    component = fixture.componentInstance;
    component.buckets = [{ items: [{ id: 1 }, { id: 2 }] }, { items: [{ id: 3 }] }];
    component.item = { id: 2 };
    loader = TestbedHarnessEnvironment.loader(fixture);
  });
  deleteChoice();
});

function deleteChoice() {
  describe('clicking on the button', () => {
    it('should delete a choice', async () => {
      expect(component.buckets[0].items.length).toEqual(2);
      spyOn(window, 'confirm').and.returnValue(true);
      await (await loader.getHarness(MatButtonHarness)).click();
      expect(component.buckets[0].items.length).toEqual(1);
    });
  });
}
