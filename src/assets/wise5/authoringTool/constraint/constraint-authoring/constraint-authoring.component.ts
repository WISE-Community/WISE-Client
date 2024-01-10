import { Directive, Input, OnInit } from '@angular/core';
import { ConstraintAction } from '../../../../../app/domain/constraintAction';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Directive()
export abstract class ConstraintAuthoringComponent implements OnInit {
  @Input() constraint: any;
  constraintActions = [];
  node: any;
  removalConditionals = [
    { value: 'all', text: $localize`All` },
    { value: 'any', text: $localize`Any` }
  ];

  constructor(
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.node = this.projectService.getNodeById(this.dataService.getCurrentNodeId());
    this.automaticallySetActionIfPossible();
  }

  private automaticallySetActionIfPossible(): void {
    if (this.constraint.action === '') {
      const possibleConstraintActions = this.constraintActions.filter(
        (constraintAction: ConstraintAction) => {
          return constraintAction.value !== '';
        }
      );
      if (possibleConstraintActions.length === 1) {
        this.constraint.action = possibleConstraintActions[0].value;
      }
    }
  }

  addRemovalCriteria(constraint: any): void {
    constraint.removalCriteria.push({
      name: '',
      params: {}
    });
    this.saveProject();
  }

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
