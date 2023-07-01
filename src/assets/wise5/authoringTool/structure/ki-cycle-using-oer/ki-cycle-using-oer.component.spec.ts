import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KiCycleUsingOerComponent } from './ki-cycle-using-oer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpgradeModule } from '@angular/upgrade/static';

describe('KiCycleUsingOERComponent', () => {
  let component: KiCycleUsingOerComponent;
  let fixture: ComponentFixture<KiCycleUsingOerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KiCycleUsingOerComponent],
      imports: [HttpClientTestingModule, UpgradeModule]
    }).compileComponents();

    fixture = TestBed.createComponent(KiCycleUsingOerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
