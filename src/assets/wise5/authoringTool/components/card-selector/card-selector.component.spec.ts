import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardSelectorComponent } from './card-selector.component';
import { By } from '@angular/platform-browser';

class Item {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

describe('CardSelectorComponent', () => {
  let component: CardSelectorComponent;
  let fixture: ComponentFixture<CardSelectorComponent>;
  let item1: Item;
  let item2: Item;
  let item3: Item;
  let items: Item[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSelectorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSelectorComponent);
    component = fixture.componentInstance;
    item1 = new Item('item1');
    item2 = new Item('item2');
    item3 = new Item('item3');
    items = [item1, item2, item3];
    component.items = items;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select item', () => {
    let noResultsDiv = fixture.debugElement.query(By.css('.success'));
    expect(noResultsDiv).toBeNull();
    component.selectItem(item2);
    fixture.detectChanges();
    noResultsDiv = fixture.debugElement.query(By.css('.success'));
    expect(noResultsDiv).not.toBeNull();
  });

  it('should show no results', () => {
    let noResultsDiv = fixture.debugElement.query(By.css('.no-results-message-container'));
    expect(noResultsDiv).toBeNull();
    component.items = [];
    fixture.detectChanges();
    noResultsDiv = fixture.debugElement.query(By.css('.no-results-message-container'));
    expect(noResultsDiv).not.toBeNull();
  });
});
