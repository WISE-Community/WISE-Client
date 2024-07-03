import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitTagsComponent } from './unit-tags.component';

describe('UnitTagsComponent', () => {
  let component: UnitTagsComponent;
  let fixture: ComponentFixture<UnitTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitTagsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UnitTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
