import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LibraryProjectDetailsComponent } from './library-project-details.component';
import { UserService } from '../../../services/user.service';
import { Project } from '../../../domain/project';
import { NGSSStandards } from '../ngssStandards';
import { ConfigService } from '../../../services/config.service';
import { ParentProject } from '../../../domain/parentProject';
import { MockProviders } from 'ng-mocks';

describe('LibraryProjectDetailsComponent', () => {
  let component: LibraryProjectDetailsComponent;
  let fixture: ComponentFixture<LibraryProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibraryProjectDetailsComponent],
      providers: [
        MockProviders(ConfigService, MatDialog, MatDialogRef, UserService),
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(LibraryProjectDetailsComponent);
    component = fixture.componentInstance;
    const project: Project = new Project();
    project.id = 1;
    project.name = 'Photosynthesis & Cellular Respiration';
    project.projectThumb = 'photo.png';
    project.metadata = {
      grades: ['7'],
      title: 'Photosynthesis & Cellular Respiration',
      summary: 'A really great unit.',
      totalTime: '6-7 hours',
      authors: [
        { id: 10, firstName: 'Spaceman', lastName: 'Spiff', username: 'SpacemanSpiff' },
        { id: 12, firstName: 'Captain', lastName: 'Napalm', username: 'CaptainNapalm' }
      ],
      resources: [{ name: 'Resource 1', uri: 'http://example.com/resource1' }]
    };
    const ngssObject: any = {
      disciplines: [
        {
          name: 'Life Sciences',
          id: 'LS'
        }
      ],
      dciArrangements: [
        {
          children: [
            {
              name: 'Construct a scientific explanation...',
              id: 'MS-LS1-6'
            },
            {
              name: 'Develop a model...',
              id: 'MS-LS1-7'
            }
          ],
          name: 'From Molecules to Organisms: Structures and Processes',
          id: 'MS-LS1'
        }
      ]
    };
    const ngss: NGSSStandards = new NGSSStandards();
    ngss.disciplines = ngssObject.disciplines;
    ngss.dciArrangements = ngssObject.dciArrangements;
    component['ngss'] = ngss;
    component['project'] = new Project(project);
    component['parentProject'] = new ParentProject();
    component['setLicenseInfo']();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show project title and summary', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('Photosynthesis & Cellular Respiration');
    expect(compiled.textContent).toContain('A really great unit.');
  });

  it('should show project performance expectations', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('MS-LS1-6');
  });

  it('should show project license and authors', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('by Spaceman Spiff, Captain Napalm');
  });

  it('should show project resources', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('Resource 1');
  });

  it('should show copied project info', () => {
    component['project'].metadata.authors = [];
    component['parentProject'] = new ParentProject({
      id: 1000,
      title: 'Photosynthesis',
      uri: 'http://localhost:8080/project/1000',
      authors: [{ id: 6, firstName: 'Susie', lastName: 'Derkins', username: 'SusieDerkins' }]
    });
    component['setLicenseInfo']();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('is a copy of Photosynthesis');
  });
});
