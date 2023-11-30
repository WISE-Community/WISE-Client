import { Component } from '@angular/core';
import { EditConnectedComponentsWithBackgroundComponent } from '../../../../../app/authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';

@Component({
  selector: 'edit-graph-connected-components',
  templateUrl: './edit-graph-connected-components.component.html',
  styleUrls: [
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
    './edit-graph-connected-components.component.scss'
  ]
})
export class EditGraphConnectedComponentsComponent extends EditConnectedComponentsWithBackgroundComponent {
  componentTypesThatCanImportWorkAsBackground: string[] = ['ConceptMap', 'Draw', 'Label'];

  addConnectedComponentSeriesNumber(connectedComponent: any) {
    if (connectedComponent.seriesNumbers == null) {
      connectedComponent.seriesNumbers = [];
    }
    connectedComponent.seriesNumbers.push(0);
    this.connectedComponentChanged();
  }

  deleteConnectedComponentSeriesNumber(connectedComponent: any, seriesNumberIndex: number) {
    connectedComponent.seriesNumbers.splice(seriesNumberIndex, 1);
    this.connectedComponentChanged();
  }

  connectedComponentSeriesNumberChanged() {
    this.connectedComponentChanged();
  }

  afterComponentIdChanged(connectedComponent: any) {
    super.afterComponentIdChanged(connectedComponent);
    const connectedComponentType = this.getConnectedComponentType(connectedComponent);
    if (connectedComponentType !== 'Embedded') {
      delete connectedComponent.highlightLatestPoint;
      delete connectedComponent.showXPlotLineOnLatestPoint;
      delete connectedComponent.seriesNumbers;
    }
    if (connectedComponentType !== 'Table') {
      delete connectedComponent.skipFirstRow;
      delete connectedComponent.xColumn;
      delete connectedComponent.yColumn;
    }
    if (connectedComponentType !== 'Graph') {
      delete connectedComponent.importGraphSettings;
      delete connectedComponent.showClassmateWorkSource;
    }
    if (!this.canConnectedComponentTypeImportWorkAsBackground(connectedComponent)) {
      delete connectedComponent.importWorkAsBackground;
    }
    if (connectedComponentType === 'Table') {
      connectedComponent.skipFirstRow = true;
      connectedComponent.xColumn = 0;
      connectedComponent.yColumn = 1;
    }
    connectedComponent.type = 'importWork';
  }

  connectedComponentShowClassmateWorkChanged(connectedComponent: any) {
    if (connectedComponent.showClassmateWork) {
      connectedComponent.showClassmateWorkSource = 'period';
    } else {
      delete connectedComponent.showClassmateWork;
      delete connectedComponent.showClassmateWorkSource;
    }
    this.connectedComponentChanged();
  }

  connectedComponentTypeChanged(connectedComponent: any) {
    if (connectedComponent.type === 'importWork') {
      delete connectedComponent.showClassmateWorkSource;
    } else if (connectedComponent.type === 'showWork') {
      delete connectedComponent.showClassmateWorkSource;
    } else if (connectedComponent.type === 'showClassmateWork') {
      // enable trials so each classmate work will show up in a different trial
      this.componentContent.enableTrials = true;
      if (connectedComponent.showClassmateWorkSource == null) {
        connectedComponent.showClassmateWorkSource = 'period';
      }
    }
    this.connectedComponentChanged();
  }

  customTrackBy(index: number): any {
    return index;
  }
}
