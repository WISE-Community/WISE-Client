import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorChooserComponent } from './color-chooser.component';

describe('ColorChooserComponent', () => {
  let component: ColorChooserComponent;
  let fixture: ComponentFixture<ColorChooserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ColorChooserComponent]
    });
    fixture = TestBed.createComponent(ColorChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
