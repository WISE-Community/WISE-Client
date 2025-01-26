import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteChoiceButtonComponent } from './delete-choice-button.component';

let component: DeleteChoiceButtonComponent;
let fixture: ComponentFixture<DeleteChoiceButtonComponent>;

describe('DeleteChoiceButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteChoiceButtonComponent],
      providers: []
    });
    fixture = TestBed.createComponent(DeleteChoiceButtonComponent);
    component = fixture.componentInstance;
    component.buckets = [{ items: [{ id: 1 }, { id: 2 }] }, { items: [{ id: 3 }] }];
    component.item = { id: 2 };
  });
  deleteChoice();
});

function deleteChoice() {
  describe('deleteChoice', () => {
    it('should delete a choice', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteChoice();
      expect(component.buckets[0].items.length).toEqual(1);
    });
  });
}
