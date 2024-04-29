import { Component } from '@angular/core';
import * as FileSaver from 'file-saver';
import { DataExportContext } from '../DataExportContext';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { NotebookDataExportStrategy } from '../strategies/NotebookDataExportStrategy';
import { NotificationDataExportStrategy } from '../strategies/NotificationDataExportStrategy';
import { StudentAssetDataExportStrategy } from '../strategies/StudentAssetDataExportStrategy';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithSpinnerComponent } from '../../../directives/dialog-with-spinner/dialog-with-spinner.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent {
  constructor(
    public annotationService: AnnotationService,
    public componentServiceLookupService: ComponentServiceLookupService,
    public configService: ConfigService,
    public dataExportService: DataExportService,
    private dialog: MatDialog,
    public projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router,
    public dataService: TeacherDataService
  ) {}

  export(exportType: string): void {
    this.dataService.saveEvent(
      'ClassroomMonitor',
      null,
      null,
      null,
      'UserInteraction',
      'exportRequested',
      { exportType: exportType }
    );
    const dataExportContext = new DataExportContext(this);
    if (exportType === 'latestNotebookItems' || exportType === 'allNotebookItems') {
      dataExportContext.setStrategy(new NotebookDataExportStrategy(exportType));
    } else if (exportType === 'notifications') {
      dataExportContext.setStrategy(new NotificationDataExportStrategy());
    } else if (exportType === 'studentAssets') {
      dataExportContext.setStrategy(new StudentAssetDataExportStrategy());
    }
    dataExportContext.export();
  }

  /**
   * Generate the csv file and have the client download it
   * @param rows a 2D array that represents the rows in the export
   * each row contains an array. the inner array contains strings or
   * numbers which represent the cell values in the export.
   * @param fileName the name of the file that will be generated
   */
  generateCSVFile(rows: any[], fileName: string): void {
    var csvString = '';
    if (rows != null) {
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        if (row != null) {
          for (var c = 0; c < row.length; c++) {
            var cell = row[c];
            if (cell == null || cell === '' || typeof cell === 'undefined') {
              cell = ' ';
            } else if (typeof cell === 'object') {
              /*
               * the cell value is an object so we will obtain the
               * string representation of the object and wrap it
               * in quotes
               */
              cell = JSON.stringify(cell);
              cell = cell.replace(/"/g, '""');
              if (cell != null && cell.length >= 32767) {
                /*
                 * the cell value is larger than the allowable
                 * excel cell size so we will display the string
                 * "Data Too Large" instead
                 */
                cell = 'Data Too Large';
              }
              cell = '"' + cell + '"';
            } else if (typeof cell === 'string') {
              if (cell != null && cell.length >= 32767) {
                /*
                 * the cell value is larger than the allowable
                 * excel cell size so we will display the string
                 * "Data Too Large" instead
                 */
                cell = 'Data Too Large';
              }
              cell = cell.replace(/"/g, '""');
              cell = '"' + cell + '"';
            }
            csvString += cell + ',';
          }
          csvString += '\r\n';
        }
      }
    }
    const csvBlob = new Blob([csvString], { type: 'text/csv; charset=utf-8' });
    FileSaver.saveAs(csvBlob, fileName);
  }

  /**
   * Get the node position
   * @param nodeId the node id
   * @returns the node position
   */
  getNodePositionById(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  /**
   * Get the node title for a node
   * @param nodeId the node id
   * @returns the node title
   */
  getNodeTitleByNodeId(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }
  showDownloadingExportMessage(): void {
    this.dialog.open(DialogWithSpinnerComponent, {
      data: {
        title: $localize`Downloading Export`
      },
      disableClose: false
    });
  }

  hideDownloadingExportMessage(): void {
    this.dialog.closeAll();
  }

  protected exportVisitsClicked(): void {
    this.router.navigate(['visits'], { relativeTo: this.route });
  }

  protected goToExportItemPage(): void {
    this.router.navigate(['item'], { relativeTo: this.route });
  }

  protected goToExportRawDataPage(): void {
    this.router.navigate(['raw'], { relativeTo: this.route });
  }

  protected goToExportEventsPage(): void {
    this.router.navigate(['events'], { relativeTo: this.route });
  }

  protected goToExportOneWorkgroupPerRowPage(): void {
    this.router.navigate(['one-workgroup-per-row'], { relativeTo: this.route });
  }

  protected goToExportStudentWorkPage(): void {
    this.router.navigate(['student-work'], { relativeTo: this.route });
  }
}
