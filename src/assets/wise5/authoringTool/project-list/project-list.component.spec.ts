import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { MockProviders } from 'ng-mocks';
import { ConfigService } from '../../services/configService';
import { CopyProjectService } from '../../services/copyProjectService';
import { SessionService } from '../../services/sessionService';
import { ProjectListComponent } from './project-list.component';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListComponent, MatDialogModule],
      providers: [
        MockProviders(ConfigService, CopyProjectService, SessionService),
        provideRouter([])
      ]
    }).compileComponents();
    spyOn(TestBed.inject(ConfigService), 'getConfigParam').and.returnValue([]);
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
