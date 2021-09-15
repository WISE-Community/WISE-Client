import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResponsesComponent } from './dialog-responses.component';

describe('DialogResponsesComponent', () => {
  let component: DialogResponsesComponent;
  let fixture: ComponentFixture<DialogResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogResponsesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
