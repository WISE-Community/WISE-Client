import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default inputs correctly', () => {
    expect(component.allowRemove()).toBeFalse();
    expect(component.color()).toBe('');
    expect(component.text()).toBe('');
    expect(component['textColor']()).toBe('');
  });

  it('should compute dark text color for light background color', () => {
    fixture.componentRef.setInput('color', '#FFFFFF');
    fixture.detectChanges();
    expect(component['textColor']()).toBe('#000000');
  });

  it('should compute white text color for dark background color', () => {
    fixture.componentRef.setInput('color', '#000000');
    fixture.detectChanges();
    expect(component['textColor']()).toBe('#FFFFFF');
  });

  it('should render tag text', () => {
    fixture.componentRef.setInput('text', 'My Tag');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.tag > span');
    expect(span.textContent.trim()).toBe('My Tag');
  });

  it('should not show remove button when allowRemove is false', () => {
    fixture.componentRef.setInput('allowRemove', false);
    fixture.detectChanges();
    const removeBtn = fixture.nativeElement.querySelector('.remove-tag');
    expect(removeBtn).toBeNull();
  });

  it('should show remove button when allowRemove is true and emit removeTagEvent on click', () => {
    fixture.componentRef.setInput('allowRemove', true);
    fixture.detectChanges();

    const removeBtn = fixture.nativeElement.querySelector('.remove-tag');
    expect(removeBtn).not.toBeNull();

    spyOn(component.removeTagEvent, 'emit');
    removeBtn.click();
    expect(component.removeTagEvent.emit).toHaveBeenCalled();
  });
});
