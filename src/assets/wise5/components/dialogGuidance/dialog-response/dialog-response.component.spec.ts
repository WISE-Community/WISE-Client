import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResponseComponent } from './dialog-response.component';

describe('DialogResponseComponent', () => {
  let component: DialogResponseComponent;
  let fixture: ComponentFixture<DialogResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
