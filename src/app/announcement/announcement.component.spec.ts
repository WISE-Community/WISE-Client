import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementComponent, AnnouncementDialogComponent } from './announcement.component';
import { Announcement } from '../domain/announcement';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AnnouncementComponent', () => {
  let component: AnnouncementComponent;
  let fixture: ComponentFixture<AnnouncementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnnouncementComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            closeAll: () => {},
            open: () => {}
          }
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the banner text and button', () => {
    const announcement = new Announcement();
    announcement.visible = true;
    announcement.bannerText = 'This is an announcement.';
    announcement.bannerButton = 'Do something';
    fixture.componentRef.setInput('announcement', announcement);
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('This is an announcement.');
    expect(compiled.textContent).toContain('Do something');
  });

  it('should emit dismiss event when dismiss button is clicked', () => {
    spyOn(component.dismiss, 'emit');
    const dismissBtn = fixture.nativeElement.querySelector('.announcement__dismiss');
    dismissBtn.click();
    expect(component.dismiss.emit).toHaveBeenCalled();
  });

  it('should open announcement dialog when showAnnouncementDetails is called', () => {
    const dialog = TestBed.inject(MatDialog);
    const dialogSpy = spyOn(dialog, 'open');
    const announcement = new Announcement();
    announcement.bannerText = 'Test';
    fixture.componentRef.setInput('announcement', announcement);
    fixture.detectChanges();

    component['showAnnouncementDetails']();
    expect(dialogSpy).toHaveBeenCalled();
  });
});

describe('AnnouncementDialogComponent', () => {
  let dialogComponent: AnnouncementDialogComponent;
  let dialogFixture: ComponentFixture<AnnouncementDialogComponent>;
  const mockAnnouncement: Announcement = new Announcement();

  beforeEach(() => {
    mockAnnouncement.title = 'Special Announcement';
    mockAnnouncement.content = '<p>Content</p>';

    TestBed.configureTestingModule({
      imports: [AnnouncementDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => {} }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockAnnouncement
        }
      ]
    });
    dialogFixture = TestBed.createComponent(AnnouncementDialogComponent);
    dialogComponent = dialogFixture.componentInstance;
    dialogFixture.detectChanges();
  });

  it('should create and have injected dialog data', () => {
    expect(dialogComponent).toBeTruthy();
    expect(dialogComponent.data.title).toBe('Special Announcement');
  });
});
