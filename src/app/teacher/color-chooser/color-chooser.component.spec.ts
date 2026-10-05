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

  it('should default color to empty string', () => {
    expect(component.color()).toBe('');
  });

  it('should update color when model is set', () => {
    fixture.componentRef.setInput('color', '#009688');
    fixture.detectChanges();
    expect(component.color()).toBe('#009688');
  });

  it('should emit colorChange when color model is modified', () => {
    spyOn(component.color, 'set').and.callThrough();
    component.color.set('#D50000');
    expect(component.color()).toBe('#D50000');
  });
});
