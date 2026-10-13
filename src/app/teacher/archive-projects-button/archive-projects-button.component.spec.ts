import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchiveProjectsButtonComponent } from './archive-projects-button.component';

describe('ArchiveProjectsButtonComponent', () => {
  let component: ArchiveProjectsButtonComponent;
  let fixture: ComponentFixture<ArchiveProjectsButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArchiveProjectsButtonComponent]
    });
    fixture = TestBed.createComponent(ArchiveProjectsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display restore button and emit false when showArchive is false', () => {
    spyOn(component.archiveProjectsEvent, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    const icon = fixture.nativeElement.querySelector('mat-icon');

    expect(icon.textContent.trim()).toBe('unarchive');
    button.click();
    expect(component.archiveProjectsEvent.emit).toHaveBeenCalledWith(false);
  });

  it('should display archive button and emit true when showArchive is true', () => {
    fixture.componentRef.setInput('showArchive', true);
    fixture.detectChanges();

    spyOn(component.archiveProjectsEvent, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    const icon = fixture.nativeElement.querySelector('mat-icon');

    expect(icon.textContent.trim()).toBe('archive');
    button.click();
    expect(component.archiveProjectsEvent.emit).toHaveBeenCalledWith(true);
  });
});

