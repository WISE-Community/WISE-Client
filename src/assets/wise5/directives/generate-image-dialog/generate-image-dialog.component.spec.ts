import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../common/ComponentContent';
import { ConceptMapService } from '../../components/conceptMap/conceptMapService';
import { DrawService } from '../../components/draw/drawService';
import { EmbeddedService } from '../../components/embedded/embeddedService';
import { GraphService } from '../../components/graph/graphService';
import { LabelService } from '../../components/label/labelService';
import { TableService } from '../../components/table/tableService';
import { ProjectService } from '../../services/projectService';
import { GenerateImageDialogComponent } from './generate-image-dialog.component';

describe('GenerateImageDialogComponent', () => {
  let component: GenerateImageDialogComponent;
  let fixture: ComponentFixture<GenerateImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [GenerateImageDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close() {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateImageDialogComponent);
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({} as ComponentContent);
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
