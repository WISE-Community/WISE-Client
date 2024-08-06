import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchiveProjectsButtonComponent } from './archive-projects-button.component';
import { ArchiveProjectService } from '../../services/archive-project.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ArchiveProjectsButtonComponent', () => {
  let component: ArchiveProjectsButtonComponent;
  let fixture: ComponentFixture<ArchiveProjectsButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ArchiveProjectsButtonComponent, MatSnackBarModule],
    providers: [ArchiveProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(ArchiveProjectsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
