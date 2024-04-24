'use strict';

import { Component } from '@angular/core';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'label-authoring',
  templateUrl: 'label-authoring.component.html',
  styleUrls: ['label-authoring.component.scss']
})
export class LabelAuthoring extends AbstractComponentAuthoring {
  numberInputChange: Subject<number> = new Subject<number>();
  textInputChange: Subject<string> = new Subject<string>();

  constructor(
    protected ConfigService: ConfigService,
    protected NodeService: TeacherNodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {
    super(ConfigService, NodeService, ProjectAssetService, ProjectService);
    this.subscriptions.add(
      this.numberInputChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
    this.subscriptions.add(
      this.textInputChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.componentContent.enableCircles == null) {
      // If this component was created before enableCircles was implemented, we will default it to
      // true in the authoring so that the "Enable Dots" checkbox is checked.
      this.componentContent.enableCircles = true;
    }
  }

  addLabel(): void {
    const newLabel = {
      text: $localize`Enter text here`,
      color: 'blue',
      pointX: 100,
      pointY: 100,
      textX: 200,
      textY: 200,
      canEdit: false,
      canDelete: false,
      isStarterLabel: true
    };
    this.componentContent.labels.push(newLabel);
    this.componentChanged();
  }

  deleteLabel(index: number, label: any): void {
    if (confirm($localize`Are you sure you want to delete this label?\n\n${label.text}`)) {
      this.componentContent.labels.splice(index, 1);
      this.componentChanged();
    }
  }

  saveStarterState(starterState: any): void {
    this.componentContent.labels = starterState;
    this.componentChanged();
  }

  compareTextAlphabetically(stringA: string, stringB: string) {
    if (stringA < stringB) {
      return -1;
    } else if (stringA > stringB) {
      return 1;
    } else {
      return 0;
    }
  }

  deleteStarterState(): void {
    this.componentContent.labels = [];
    this.componentChanged();
  }

  openColorViewer(): void {
    window.open('http://www.javascripter.net/faq/colornam.htm');
  }
}
