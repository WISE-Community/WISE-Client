import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription, filter } from 'rxjs';
import { GradingStepToolsComponent } from '../../grading-step-tools/grading-step-tools.component';
import { SelectPeriodComponent } from '../../select-period/select-period.component';
import { StudentGradingToolsComponent } from '../../studentGrading/student-grading-tools/student-grading-tools.component';
import { SaveIndicatorComponent } from '../../../../common/save-indicator/save-indicator.component';

@Component({
  imports: [
    GradingStepToolsComponent,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    SaveIndicatorComponent,
    SelectPeriodComponent,
    StudentGradingToolsComponent
  ],
  selector: 'tool-bar',
  styleUrl: './tool-bar.component.scss',
  templateUrl: './tool-bar.component.html'
})
export class ToolBarComponent implements OnInit {
  @Output() onMenuToggle: EventEmitter<any> = new EventEmitter<any>();
  protected showPeriodSelect: boolean = true;
  protected showStepTools: boolean;
  protected showTeamTools: boolean;
  private subscriptions: Subscription = new Subscription();
  protected viewName: string;
  @Input() workgroupId: number;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.processUI();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToRouterEvents(): void {
    this.subscriptions.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        this.processUI();
      })
    );
  }

  private processUI(): void {
    const path = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    this.viewName =
      {
        export: $localize`Data Export`,
        'manage-students': $localize`Manage Students`,
        milestones: $localize`Milestones`,
        notebook: $localize`Student Notebooks`,
        team: $localize`Grade by Student`
      }[path] ?? $localize`Grade by Step`;
    this.showPeriodSelect = path != 'export';
    this.showTeamTools = /\/team\/(\d+)$/.test(this.router.url);
    this.showStepTools = /node\/node(\d+)/.test(this.router.url);
  }

  protected toggleMenu(): void {
    this.onMenuToggle.emit();
  }
}
