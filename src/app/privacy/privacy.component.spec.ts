import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrivacyComponent } from './privacy.component';

describe('PrivacyComponent', () => {
  let component: PrivacyComponent;
  let fixture: ComponentFixture<PrivacyComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PrivacyComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the privacy policy without student birthday wording', () => {
    const pageText = fixture.nativeElement.textContent;

    expect(pageText).toContain('WISE Terms of Use & Privacy Policy');
    expect(pageText).not.toMatch(/birth ?day|birthday/i);
  });
});
