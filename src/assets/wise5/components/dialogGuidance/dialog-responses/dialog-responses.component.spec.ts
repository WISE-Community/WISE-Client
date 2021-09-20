import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentHeader } from '../../../directives/component-header/component-header.component';
import { DialogResponsesComponent } from './dialog-responses.component';

describe('DialogResponsesComponent', () => {
  let component: DialogResponsesComponent;
  let fixture: ComponentFixture<DialogResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentHeader, DialogResponsesComponent]
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
