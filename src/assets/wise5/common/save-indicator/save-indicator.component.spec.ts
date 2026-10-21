import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { Subject } from 'rxjs';
import { NotificationService } from '../../services/notificationService';
import { SaveIndicatorComponent } from './save-indicator.component';

describe('SaveIndicatorComponent', () => {
  let component: SaveIndicatorComponent;
  let fixture: ComponentFixture<SaveIndicatorComponent>;
  let setGlobalMessage$: Subject<any>;

  beforeEach(() => {
    setGlobalMessage$ = new Subject<any>();
    TestBed.configureTestingModule({
      imports: [SaveIndicatorComponent],
      providers: [
        MockProvider(NotificationService, {
          setGlobalMessage$
        })
      ]
    });
    fixture = TestBed.createComponent(SaveIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display progress spinner by default', () => {
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeNull();
  });

  it('should display progress spinner when isProgressIndicatorVisible is true', () => {
    setGlobalMessage$.next({
      globalMessage: { isProgressIndicatorVisible: true }
    });
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).not.toBeNull();
  });

  it('should hide progress spinner when isProgressIndicatorVisible is false', () => {
    setGlobalMessage$.next({
      globalMessage: { isProgressIndicatorVisible: true }
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-spinner')).not.toBeNull();

    setGlobalMessage$.next({
      globalMessage: { isProgressIndicatorVisible: false }
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeNull();
  });

  it('should display message text and formatted time', () => {
    const now = new Date(2026, 9, 12, 10, 30, 0);
    setGlobalMessage$.next({
      globalMessage: {
        text: 'All changes saved',
        time: now
      }
    });
    fixture.detectChanges();

    const messageEl = fixture.nativeElement.querySelector('.global-message');
    expect(messageEl).not.toBeNull();
    expect(messageEl.textContent).toContain('All changes saved');
  });
});

