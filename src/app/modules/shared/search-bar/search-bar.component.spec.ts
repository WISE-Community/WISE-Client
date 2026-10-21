import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SearchBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render placeholderText from input', () => {
    fixture.componentRef.setInput('placeholderText', 'Search projects...');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('mat-label');
    expect(label.textContent.trim()).toBe('Search projects...');
  });

  it('should synchronize value input to the search field and toggle clear button visibility', () => {
    const clearBtn = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    expect(clearBtn.classList.contains('invisible')).toBeTrue();

    fixture.componentRef.setInput('value', 'photosynthesis');
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputEl.value).toBe('photosynthesis');
    expect(clearBtn.classList.contains('invisible')).toBeFalse();
  });

  it('should disable and enable the search input and clear button when disable input changes', () => {
    fixture.componentRef.setInput('disable', true);
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const clearBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Clear"]'
    );

    expect(inputEl.disabled).toBeTrue();
    expect(clearBtn.disabled).toBeTrue();

    fixture.componentRef.setInput('disable', false);
    fixture.detectChanges();

    expect(inputEl.disabled).toBeFalse();
    expect(clearBtn.disabled).toBeFalse();
  });

  it('should emit update event with debounce when user types', fakeAsync(() => {
    let emittedValue: string | undefined;
    component.change.subscribe((val) => {
      emittedValue = val;
    });

    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
    inputEl.value = 'energy';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(100);
    expect(emittedValue).toBeUndefined();

    tick(150);
    expect(emittedValue).toBe('energy');
  }));

  it('should clear the input and emit update event when clear button is clicked', fakeAsync(() => {
    fixture.componentRef.setInput('value', 'gravity');
    fixture.detectChanges();

    let emittedValue: string | undefined;
    component.change.subscribe((val) => {
      emittedValue = val;
    });

    const clearBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Clear"]'
    );
    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');

    clearBtn.click();
    fixture.detectChanges();

    tick(250);
    expect(inputEl.value).toBe('');
    expect(emittedValue).toBe('');
  }));
});
