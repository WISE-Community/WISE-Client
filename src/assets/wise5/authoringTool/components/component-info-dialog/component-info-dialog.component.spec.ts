import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentInfoDialogComponent } from './component-info-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { PreviewComponentModule } from '../preview-component/preview-component.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PreviewComponentComponent } from '../preview-component/preview-component.component';
import { ProjectService } from '../../../services/projectService';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ComponentInfoDialogComponent', () => {
  let component: ComponentInfoDialogComponent;
  let fixture: ComponentFixture<ComponentInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentInfoDialogComponent, PreviewComponentComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        PreviewComponentModule
      ],
      providers: [ComponentInfoService, { provide: MAT_DIALOG_DATA, useValue: 'OpenResponse' }]
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentInfoDialogComponent);
    const projectService = TestBed.inject(ProjectService);
    projectService.project = {};
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
