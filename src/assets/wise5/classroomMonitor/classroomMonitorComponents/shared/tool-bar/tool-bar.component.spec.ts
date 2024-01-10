import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { ToolBarComponent } from './tool-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ToolBarComponent', () => {
  let component: ToolBarComponent;
  let fixture: ComponentFixture<ToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolBarComponent],
      imports: [MatIconModule, MatToolbarModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
