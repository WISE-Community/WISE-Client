import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { NotificationService } from '../../services/notificationService';
import { SaveIndicatorComponent } from './save-indicator.component';

describe('SaveIndicatorComponent', () => {
  let component: SaveIndicatorComponent;
  let fixture: ComponentFixture<SaveIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SaveIndicatorComponent],
      providers: [
        MockProvider(NotificationService, {
          setGlobalMessage$: of({ globalMessage: { isProgressIndicatorVisible: false } })
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
});
