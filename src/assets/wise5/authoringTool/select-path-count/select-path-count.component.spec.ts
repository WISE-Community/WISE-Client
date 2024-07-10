import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectPathCountComponent } from './select-path-count.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectPathCountComponent', () => {
  let component: SelectPathCountComponent;
  let fixture: ComponentFixture<SelectPathCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SelectPathCountComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPathCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
