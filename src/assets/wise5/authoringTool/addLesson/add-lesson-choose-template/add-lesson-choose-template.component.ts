import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'add-lesson-choose-template',
  styleUrls: ['./add-lesson-choose-template.component.scss'],
  templateUrl: './add-lesson-choose-template.component.html'
})
export class AddLessonChooseTemplateComponent {
  protected templates = [
    {
      label: $localize`Create Your Own`,
      icon: 'mode_edit',
      route: 'configure'
    },
    {
      label: $localize`Jigsaw`,
      icon: 'extension',
      route: 'structure/jigsaw'
    },
    {
      label: $localize`Self-Directed Investigation`,
      icon: 'contact_support',
      route: 'structure/self-directed-investigation'
    },
    {
      label: $localize`Peer Review & Revision`,
      icon: 'question_answer',
      route: 'structure/peer-review-and-revision'
    },
    {
      label: $localize`KI Lesson with OER`,
      icon: 'autorenew',
      route: 'structure/ki-cycle-using-oer'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  protected chooseTemplate(template: any): void {
    this.router.navigate([...template.route.split('/')], {
      relativeTo: this.route
    });
  }
}
