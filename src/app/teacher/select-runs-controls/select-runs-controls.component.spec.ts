import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectRunsControlsComponent } from './select-runs-controls.component';
import { SelectRunsControlsModule } from './select-runs-controls.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { MockArchiveProjectService } from '../../services/mock-archive-project.service';

describe('SelectRunsControlsComponent', () => {
  let component: SelectRunsControlsComponent;
  let fixture: ComponentFixture<SelectRunsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, SelectRunsControlsModule],
      providers: [{ provide: ArchiveProjectService, useClass: MockArchiveProjectService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectRunsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
