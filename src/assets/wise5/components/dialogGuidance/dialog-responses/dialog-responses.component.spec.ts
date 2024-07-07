import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { DialogResponsesComponent } from './dialog-responses.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DialogResponsesComponent', () => {
  let component: DialogResponsesComponent;
  let fixture: ComponentFixture<DialogResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogResponsesComponent],
      imports: [ComponentHeaderComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
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
