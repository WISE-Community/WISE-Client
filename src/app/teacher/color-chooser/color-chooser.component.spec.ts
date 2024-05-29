import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorChooserComponent } from './color-chooser.component';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

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
