import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterHomeComponent } from './register-home.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterHomeComponent', () => {
  let component: RegisterHomeComponent;
  let fixture: ComponentFixture<RegisterHomeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegisterHomeComponent],
        imports: [RouterTestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
