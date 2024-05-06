import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BlurbComponent } from './blurb.component';

describe('BlurbComponent', () => {
  let component: BlurbComponent;
  let fixture: ComponentFixture<BlurbComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BlurbComponent]
      }).compileComponents();
      fixture = TestBed.createComponent(BlurbComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
