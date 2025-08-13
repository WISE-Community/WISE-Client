import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentTypeButtonComponent } from './component-type-button.component';

describe('ComponentTypeButtonComponent', () => {
  let component: ComponentTypeButtonComponent;
  let fixture: ComponentFixture<ComponentTypeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentTypeButtonComponent, MatDialogModule],
      providers: [ComponentInfoService]
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentTypeButtonComponent);
    component = fixture.componentInstance;
    component.componentType = 'OpenResponse';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
