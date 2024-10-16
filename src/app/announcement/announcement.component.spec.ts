import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementComponent } from './announcement.component';
import { Announcement } from '../domain/announcement';
import { MatDialog } from '@angular/material/dialog';

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
            closeAll: () => {}
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
    component.announcement = new Announcement();
    component.announcement.visible = true;
    component.announcement.bannerText = 'This is an announcement.';
    component.announcement.bannerButton = 'Do something';
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('This is an announcement.');
    expect(compiled.textContent).toContain('Do something');
  });
});
