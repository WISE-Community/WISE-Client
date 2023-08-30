import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseStructureComponent } from './choose-structure.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChooseStructureComponent', () => {
  let component: ChooseStructureComponent;
  let fixture: ComponentFixture<ChooseStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseStructureComponent],
      imports: [MatCardModule, MatIconModule, RouterTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(ChooseStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
