import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { PeerGroupService } from '../../services/peerGroupService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { DynamicPrompt } from './DynamicPrompt';
import { ConstraintService } from '../../services/constraintService';
import { DynamicPromptOpenResponseEvaluator } from './DynamicPromptOpenResponseEvaluator';
import { DynamicPromptMultipleChoiceEvaluator } from './DynamicPromptMultipleChoiceEvaluator';

@Component({
  selector: 'dynamic-prompt',
  templateUrl: './dynamic-prompt.component.html',
  styleUrls: ['./dynamic-prompt.component.scss']
})
export class DynamicPromptComponent implements OnInit {
  annotationService: AnnotationService;
  @Input() componentId: string;
  configService: ConfigService;
  constraintService: ConstraintService;
  dataService: StudentDataService;
  @Input() dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();
  @Input() nodeId: string;
  prompt: string;
  peerGroupService: PeerGroupService;

  constructor(
    annotationService: AnnotationService,
    configService: ConfigService,
    constraintService: ConstraintService,
    dataService: StudentDataService,
    peerGroupService: PeerGroupService,
    private projectService: ProjectService
  ) {
    this.annotationService = annotationService;
    this.configService = configService;
    this.constraintService = constraintService;
    this.dataService = dataService;
    this.peerGroupService = peerGroupService;
  }

  ngOnInit(): void {
    const referenceComponent = this.projectService.getReferenceComponent(this.dynamicPrompt);
    if (referenceComponent.content.type === 'OpenResponse') {
      new DynamicPromptOpenResponseEvaluator(this).evaluate(referenceComponent);
    } else if (referenceComponent.content.type === 'MultipleChoice') {
      new DynamicPromptMultipleChoiceEvaluator(this).evaluate(referenceComponent);
    }
  }
}
