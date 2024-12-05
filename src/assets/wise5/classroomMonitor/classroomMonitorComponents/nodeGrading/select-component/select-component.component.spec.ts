import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponentComponent } from './select-component.component';

describe('SelectComponentComponent', () => {
  let component: SelectComponentComponent;
  let fixture: ComponentFixture<SelectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
