import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogWithOpenInNewWindowComponent } from './dialog-with-open-in-new-window.component';

const content = 'This is the rubric content';
const title = 'This is the unit title';

describe('DialogWithOpenInNewWindowComponent', () => {
  let component: DialogWithOpenInNewWindowComponent;
  let fixture: ComponentFixture<DialogWithOpenInNewWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogWithOpenInNewWindowComponent],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            content: content,
            scroll: true,
            title: title
          }
        },
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWithOpenInNewWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set the title', () => {
    expect(component).toBeTruthy();
    const h1 = fixture.nativeElement.querySelector('h2');
    expect(h1.textContent).toEqual(title);
  });

  it('should set the content', () => {
    expect(component).toBeTruthy();
    const contentDiv = fixture.debugElement.nativeElement.querySelector('.dialog-content-scroll');
    expect(contentDiv.innerHTML).toEqual(content);
  });
});
