import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'choose-structure',
  templateUrl: './choose-structure.component.html',
  styleUrls: ['./choose-structure.component.scss']
})
export class ChooseStructureComponent {
  private $state: any;
  protected structures = [
    {
      label: $localize`Jigsaw`,
      description: $localize`The Jigsaw KI lesson structure guides students through learning about specific aspects of a science topic of their choice and engages them in collaboration to learn more. Students share their own ideas and reflect on what they learned from their classmates.`,
      icon: 'extension',
      route: 'root.at.project.structure.jigsaw'
    },
    {
      label: $localize`Self-Directed Investigation`,
      description: $localize`The Self-Directed Investigation KI lesson structure helps students ask research questions about a science topic, guides them through refining their initial questions to researchable questions, and supports them in finding and evaluating evidence using online resources of their choice. Students synthesize their findings into a product of your choice.`,
      icon: 'contact_support',
      route: 'root.at.project.structure.self-directed-investigation'
    },
    {
      label: $localize`Peer Review & Revision`,
      description: $localize`The Peer Review & Revision KI lesson structure guides students through writing their own explanation, critiquing explanations of peer learners, and ultimately revising their own initial explanation.`,
      icon: 'question_answer',
      route: 'root.at.project.structure.peer-review-and-revision'
    },
    {
      label: $localize`KI Lesson with OER`,
      description: $localize`The KI Lesson with OER guides you to embed an open educational resource (OER) of your choice in a lesson structure that promotes knowledge integration (KI). The structure suggests different step types that engage students in eliciting their ideas, discovering new ideas through use of the OER, distinguishing among their initial and new ideas, and making connections to form integrated understanding.`,
      icon: 'autorenew',
      route: 'root.at.project.structure.ki-cycle-using-oer'
    }
  ];

  constructor(private upgrade: UpgradeModule) {}

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
  }

  protected chooseStructure(route: string): void {
    this.$state.go(route);
  }

  protected cancel(): void {
    this.$state.go('root.at.project');
  }
}
