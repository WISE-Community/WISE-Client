import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../../../assets/wise5/services/annotationService';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { SessionService } from '../../../assets/wise5/services/sessionService';
import { StudentAssetService } from '../../../assets/wise5/services/studentAssetService';
import { StudentDataService } from '../../../assets/wise5/services/studentDataService';
import { TagService } from '../../../assets/wise5/services/tagService';
import { UtilService } from '../../../assets/wise5/services/utilService';
import { NotebookNotesComponent } from './notebook-notes.component';

let component: NotebookNotesComponent;

describe('NotebookNotesComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [NotebookNotesComponent],
      providers: [
        AnnotationService,
        ConfigService,
        NotebookService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ]
    });
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(NotebookNotesComponent);
    component = fixture.componentInstance;
  });

  isHasPrivateNotes();
});

function isHasPrivateNotes() {
  it('should check if the notebook has private notes when it does not have any notes', () => {
    component.notebook = { items: {} };
    component.addPersonalGroupToGroups();
    expect(component.isHasPrivateNotes()).toEqual(false);
  });
  it('should check if the notebook has private notes when it has a note', () => {
    component.notebook = { items: { abcd: [{ type: 'note' }] } };
    component.addPersonalGroupToGroups();
    expect(component.isHasPrivateNotes()).toEqual(true);
  });
}
