import { DataExportStrategy } from './DataExportStrategy';
import DataExportController from '../dataExportController';
import * as angular from 'angular';

export class RawDataExportStrategy implements DataExportStrategy {
  constructor(private controller: DataExportController) {}

  export() {
    this.controller.showDownloadingExportMessage();
    var selectedNodes = [];

    /*
     * holds the mappings from nodeid or nodeid-componentid to a boolean
     * value of whether the node was selected
     * example
     * selectedNodesMap["node3"] = true
     * selectedNodesMap["node4-wt38sdf1d3"] = true
     */
    var selectedNodesMap = null;
    if (this.controller.exportStepSelectionType === 'exportSelectSteps') {
      selectedNodes = this.controller.getSelectedNodesToExport();
      if (selectedNodes == null || selectedNodes.length == 0) {
        alert('Please select a step to export.');
        return;
      } else {
        selectedNodesMap = this.controller.getSelectedNodesMap(selectedNodes);
      }
    }
    this.controller.DataExportService.retrieveRawDataExport(selectedNodes).then((result) => {
      var runId = this.controller.ConfigService.getRunId();
      var data: any = {};
      var workgroups = this.controller.ConfigService.getClassmateUserInfosSortedByWorkgroupId();
      workgroups = this.controller.UtilService.makeCopyOfJSONObject(workgroups);
      for (var w = 0; w < workgroups.length; w++) {
        var workgroup = workgroups[w];
        if (workgroup != null) {
          if (!this.controller.includeStudentNames) {
            this.controller.removeNamesFromWorkgroup(workgroup);
          }
          var workgroupId = workgroup.workgroupId;
          if (this.controller.includeStudentWork) {
            workgroup.studentWork = [];
            var componentStates = this.controller.TeacherDataService.getComponentStatesByWorkgroupId(
              workgroupId
            );
            if (componentStates != null) {
              for (var c = 0; c < componentStates.length; c++) {
                var componentState = componentStates[c];
                if (componentState != null) {
                  var compositeId = this.controller.getCompositeId(componentState);
                  if (
                    selectedNodesMap == null ||
                    (compositeId != null && selectedNodesMap[compositeId] == true)
                  ) {
                    workgroup.studentWork.push(componentState);
                  }
                }
              }
            }
          }
          if (this.controller.includeAnnotations) {
            workgroup.annotations = [];
            var annotations = this.controller.TeacherDataService.getAnnotationsToWorkgroupId(
              workgroupId
            );
            if (annotations != null) {
              for (var a = 0; a < annotations.length; a++) {
                var annotation = annotations[a];
                if (annotation != null) {
                  var compositeId = this.controller.getCompositeId(annotation);
                  if (
                    selectedNodesMap == null ||
                    (compositeId != null && selectedNodesMap[compositeId] == true)
                  ) {
                    workgroup.annotations.push(annotation);
                  }
                }
              }
            }
          }
          if (this.controller.includeEvents) {
            workgroup.events = [];
            var events = this.controller.TeacherDataService.getEventsByWorkgroupId(workgroupId);
            if (events != null) {
              for (var e = 0; e < events.length; e++) {
                var event = events[e];
                if (event != null) {
                  var compositeId = this.controller.getCompositeId(event);
                  if (
                    selectedNodesMap == null ||
                    (compositeId != null && selectedNodesMap[compositeId] == true)
                  ) {
                    workgroup.events.push(event);
                  }
                }
              }
            }
          }
        }
      }
      data.workgroups = workgroups;
      const dataJSONString = angular.toJson(data, 4);
      const blob = new Blob([dataJSONString]);
      this.controller.FileSaver.saveAs(blob, runId + '_raw_data.json');
      this.controller.hideDownloadingExportMessage();
    });
  }
}
