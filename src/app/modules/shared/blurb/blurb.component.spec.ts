import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BlurbComponent } from './blurb.component';

describe('BlurbComponent', () => {
  let component: BlurbComponent;
  let fixture: ComponentFixture<BlurbComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BlurbComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(BlurbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render headline and content from inputs', () => {
    fixture.componentRef.setInput('headline', 'Interactive Simulations');
    fixture.componentRef.setInput('content', 'Explore dynamic science models.');
    fixture.detectChanges();

    const headlineEl = fixture.nativeElement.querySelector('h2');
    const contentEl = fixture.nativeElement.querySelector('p');

    expect(headlineEl.textContent.trim()).toBe('Interactive Simulations');
    expect(contentEl.textContent.trim()).toBe('Explore dynamic science models.');
  });

  it('should render picture and image when imgSrc is provided', () => {
    fixture.componentRef.setInput('imgSrc', 'assets/sim.png');
    fixture.componentRef.setInput('imgDescription', 'Simulation preview');
    fixture.componentRef.setInput('imgSources', [
      { media: '(min-width: 800px)', src: 'assets/sim-large.png', type: 'image/png' }
    ]);
    fixture.detectChanges();

    const picture = fixture.nativeElement.querySelector('picture');
    const img = fixture.nativeElement.querySelector('img.blurb__image');
    const source = fixture.nativeElement.querySelector('source');

    expect(picture).not.toBeNull();
    expect(img.getAttribute('src')).toBe('assets/sim.png');
    expect(img.getAttribute('alt')).toBe('Simulation preview');
    expect(source.getAttribute('media')).toBe('(min-width: 800px)');
  });

  it('should not render picture when imgSrc is not provided', () => {
    const picture = fixture.nativeElement.querySelector('picture');
    expect(picture).toBeNull();
  });
});
