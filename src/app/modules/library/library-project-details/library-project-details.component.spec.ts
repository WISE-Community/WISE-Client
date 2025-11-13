import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LibraryProjectDetailsComponent } from './library-project-details.component';
import { UserService } from '../../../services/user.service';
import { Project } from '../../../domain/project';
import { ConfigService } from '../../../services/config.service';
import { ParentProject } from '../../../domain/parentProject';
import { MockComponent, MockProviders } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { LibraryProjectMenuComponent } from '../library-project-menu/library-project-menu.component';

let component: LibraryProjectDetailsComponent;
let fixture: ComponentFixture<LibraryProjectDetailsComponent>;
describe('LibraryProjectDetailsComponent', () => {
  beforeEach(() => {
    const project: Project = new Project();
    project.id = 1;
    project.name = 'Photosynthesis & Cellular Respiration';
    project.projectThumb = 'photo.png';
    project.metadata = {
      grades: ['7'],
      standards: {
        ngss: [{ id: 'MS-LS1-6', name: 'MS-LS1-6', url: 'http://ngss.com' }],
        commonCore: [],
        learningForJustice: []
      },
      title: 'Photosynthesis & Cellular Respiration',
      summary: 'A really great unit.',
      unitType: 'Platform',
      totalTime: '6-7 hours',
      authors: [
        { id: 10, firstName: 'Spaceman', lastName: 'Spiff', username: 'SpacemanSpiff' },
        { id: 12, firstName: 'Captain', lastName: 'Napalm', username: 'CaptainNapalm' }
      ],
      resources: [{ name: 'Resource 1', uri: 'http://example.com/resource1' }]
    };
    TestBed.configureTestingModule({
      imports: [LibraryProjectDetailsComponent, MockComponent(LibraryProjectMenuComponent)],
      providers: [
        MockProviders(ConfigService, MatDialog, MatDialogRef, UserService),
        { provide: MAT_DIALOG_DATA, useValue: { project: project } }
      ]
    });
    spyOn(TestBed.inject(UserService), 'getUserId').and.returnValue(10);

    fixture = TestBed.createComponent(LibraryProjectDetailsComponent);
    component = fixture.componentInstance;
    component['parentProject'] = new ParentProject();
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

  it('should show use with class and preview buttons', () => {
    component['isTeacher'] = true;
    fixture.detectChanges();
    expect(getButtonWithText('Use with Class')).toBeTruthy();
    expect(getButtonWithText('Preview')).toBeTruthy();
  });

  isResourceUnitType_HideButtons();
});

function isResourceUnitType_HideButtons() {
  describe('is not Resource unit type', () => {
    beforeEach(() => {
      component['project'].metadata.unitType = 'Resource';
      fixture.detectChanges();
    });

    it('should hide Use with Class button when unit type is Resource', () => {
      expect(getButtonWithText('Use with Class')).toBeFalsy();
    });

    it('should hide Preview button when unit type is Resource and it has no resources', () => {
      expect(getButtonWithText('Use with Class')).toBeFalsy();
      component['canPreview'] = false;
      fixture.detectChanges();
      expect(getButtonWithText('Preview')).toBeFalsy();
    });
  });
}

function getButtonWithText(text: string) {
  return fixture.debugElement
    .queryAll(By.css('button'))
    .find((el) => el.nativeElement.textContent.includes(text));
}
