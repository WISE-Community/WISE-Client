import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockComponent, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { NotificationService } from '../../../../services/notificationService';
import { AuthoringToolBarComponent } from './authoring-tool-bar.component';
import { SaveIndicatorComponent } from '../../../../common/save-indicator/save-indicator.component';

describe('AuthoringToolBarComponent', () => {
  let component: AuthoringToolBarComponent;
  let fixture: ComponentFixture<AuthoringToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthoringToolBarComponent, MockComponent(SaveIndicatorComponent)],
      providers: [
        MockProvider(NotificationService, {
          setGlobalMessage$: of({}),
          setIsJSONValid$: of({})
        }),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthoringToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
