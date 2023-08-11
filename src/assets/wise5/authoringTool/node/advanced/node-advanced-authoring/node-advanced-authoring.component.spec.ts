import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeAdvancedAuthoringComponent } from './node-advanced-authoring.component';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';

describe('NodeAdvancedAuthoringComponent', () => {
  let component: NodeAdvancedAuthoringComponent;
  let fixture: ComponentFixture<NodeAdvancedAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeAdvancedAuthoringComponent],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        StudentTeacherCommonServicesModule,
        UpgradeModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();

    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          current: { name: '' },
          go: (route: string, params: any) => {},
          nodeId: ''
        };
      }
    };
    fixture = TestBed.createComponent(NodeAdvancedAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
