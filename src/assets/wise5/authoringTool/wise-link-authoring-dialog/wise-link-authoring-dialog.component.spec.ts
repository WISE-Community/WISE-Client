import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WiseLinkAuthoringDialogComponent } from './wise-link-authoring-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MockProvider } from 'ng-mocks';

describe('WiseLinkAuthoringDialogComponent', () => {
  let component: WiseLinkAuthoringDialogComponent;
  let fixture: ComponentFixture<WiseLinkAuthoringDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiseLinkAuthoringDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: {} }, MockProvider(TeacherProjectService)]
    }).compileComponents();

    fixture = TestBed.createComponent(WiseLinkAuthoringDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
