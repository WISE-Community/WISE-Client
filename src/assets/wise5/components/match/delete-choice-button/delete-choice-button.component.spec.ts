import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { DeleteChoiceButton } from './delete-choice-button.component';

let component: DeleteChoiceButton;
let fixture: ComponentFixture<DeleteChoiceButton>;

describe('DeleteChoiceButton', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [DeleteChoiceButton],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteChoiceButton);
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
