import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSelectorComponent } from './card-selector.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

describe('CardSelectorComponent', () => {
  let component: CardSelectorComponent;
  let fixture: ComponentFixture<CardSelectorComponent>;
  let item1: any;
  let item2: any;
  let item3: any;
  let items: any[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardSelectorComponent],
      imports: [MatCardModule, MatIconModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSelectorComponent);
    component = fixture.componentInstance;
    item1 = createItem('item1');
    item2 = createItem('item2');
    item3 = createItem('item3');
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

function createItem(id: string) {
  return { id: id };
}
