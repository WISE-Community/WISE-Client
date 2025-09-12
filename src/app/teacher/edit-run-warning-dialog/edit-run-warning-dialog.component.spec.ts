import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditRunWarningDialogComponent } from './edit-run-warning-dialog.component';
import { ConfigService } from '../../services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Run } from '../../domain/run';
import { provideRouter } from '@angular/router';

export class MockConfigService {
  getContextPath(): string {
    return '';
  }
}

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

describe('EditRunWarningDialogComponent', () => {
  let component: EditRunWarningDialogComponent;
  let fixture: ComponentFixture<EditRunWarningDialogComponent>;

  const run = new Run({ id: 1, project: { id: 1, name: 'Test' } });
  run.project.metadata = {
    title: 'Test Project'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        { provide: MAT_DIALOG_DATA, useValue: run },
        { provide: ConfigService, useClass: MockConfigService },
        provideRouter([])
      ],
      imports: [EditRunWarningDialogComponent]
    });
    fixture = TestBed.createComponent(EditRunWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
