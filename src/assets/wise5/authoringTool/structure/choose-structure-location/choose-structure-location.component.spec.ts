import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseStructureLocationComponent } from './choose-structure-location.component';
import { MatIconModule } from '@angular/material/icon';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDividerModule } from '@angular/material/divider';

describe('ChooseStructureLocationComponent', () => {
  let component: ChooseStructureLocationComponent;
  let fixture: ComponentFixture<ChooseStructureLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseStructureLocationComponent],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatDividerModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();
    window.history.pushState(
      {
        structure: {
          nodes: [],
          group: {
            id: 'group2'
          }
        }
      },
      '',
      ''
    );

    spyOn(TestBed.inject(TeacherProjectService), 'getGroupNodesIdToOrder').and.returnValue({
      group0: { order: 0 },
      group1: { order: 1 }
    });
    fixture = TestBed.createComponent(ChooseStructureLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
