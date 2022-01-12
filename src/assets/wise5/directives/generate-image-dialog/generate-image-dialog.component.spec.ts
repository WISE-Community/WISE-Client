import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UpgradeModule } from '@angular/upgrade/static';
import { Subject } from 'rxjs';
import { ComponentComponent } from '../../components/component/component.component';
import { ConceptMapService } from '../../components/conceptMap/conceptMapService';
import { DrawService } from '../../components/draw/drawService';
import { EmbeddedService } from '../../components/embedded/embeddedService';
import { GraphService } from '../../components/graph/graphService';
import { LabelService } from '../../components/label/labelService';
import { TableService } from '../../components/table/tableService';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { NodeService } from '../../services/nodeService';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentAssetService } from '../../services/studentAssetService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { UtilService } from '../../services/utilService';
import { GenerateImageDialogComponent } from './generate-image-dialog.component';

class MockNodeService {
  private doneRenderingComponentSource: Subject<any> = new Subject<any>();
  public doneRenderingComponent$ = this.doneRenderingComponentSource.asObservable();
}

class MockNotebookService {
  isNotebookEnabled() {
    return true;
  }
  isStudentNoteClippingEnabled() {
    return true;
  }
}

describe('GenerateImageDialogComponent', () => {
  let component: GenerateImageDialogComponent;
  let fixture: ComponentFixture<GenerateImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, MatProgressSpinnerModule, UpgradeModule],
      declarations: [ComponentComponent, GenerateImageDialogComponent],
      providers: [
        AnnotationService,
        ConceptMapService,
        ConfigService,
        DrawService,
        EmbeddedService,
        GraphService,
        LabelService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close() {} } },
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockNotebookService },
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TableService,
        TagService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateImageDialogComponent);
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue({});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get component service', () => {
    expect(component.getComponentService('ConceptMap')).toEqual(TestBed.inject(ConceptMapService));
    expect(component.getComponentService('Draw')).toEqual(TestBed.inject(DrawService));
    expect(component.getComponentService('Embedded')).toEqual(TestBed.inject(EmbeddedService));
    expect(component.getComponentService('Graph')).toEqual(TestBed.inject(GraphService));
    expect(component.getComponentService('Label')).toEqual(TestBed.inject(LabelService));
    expect(component.getComponentService('Table')).toEqual(TestBed.inject(TableService));
  });

  it('should call generateImageFromRenderedComponentState', () => {
    component.componentState = { componentType: 'Draw' };
    const generateImageSpy = spyOn(
      TestBed.inject(DrawService),
      'generateImageFromRenderedComponentState'
    ).and.returnValue(Promise.resolve({}));
    component.generateImage();
    expect(generateImageSpy).toHaveBeenCalled();
  });
});
