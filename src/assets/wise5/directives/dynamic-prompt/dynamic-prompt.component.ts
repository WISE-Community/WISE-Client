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
import { PeerGroup } from '../../components/peerChat/PeerGroup';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'dynamic-prompt',
  standalone: true,
  styleUrl: './dynamic-prompt.component.scss',
  templateUrl: './dynamic-prompt.component.html'
})
export class DynamicPromptComponent implements OnInit {
  @Input() componentId: string;
  @Input() dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();
  @Input() nodeId: string;
  public peerGroup: PeerGroup;
  public prompt: string;

  constructor(
    public annotationService: AnnotationService,
    public configService: ConfigService,
    public constraintService: ConstraintService,
    public dataService: StudentDataService,
    public peerGroupService: PeerGroupService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const referenceComponent = this.projectService.getReferenceComponent(this.dynamicPrompt);
    if (referenceComponent.content.type === 'OpenResponse') {
      new DynamicPromptOpenResponseEvaluator(this).evaluate(referenceComponent);
    } else if (referenceComponent.content.type === 'MultipleChoice') {
      new DynamicPromptMultipleChoiceEvaluator(this).evaluate(referenceComponent);
    }
  }
}
