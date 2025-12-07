import { Directive, Input, inject } from '@angular/core';
import { copy } from '../../../assets/wise5/common/object/object';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';

@Directive()
export class NotebookParentComponent {
  configService = inject(ConfigService);
  notebookService = inject(NotebookService);

  @Input() config: any;
  @Input() mode: string;
  @Input() workgroupId: number;
  notebook: any;

  ngOnInit(): void {
    if (this.workgroupId == null) {
      this.workgroupId = this.configService.getWorkgroupId();
    }
    if (this.config == null) {
      this.setConfig();
    }
    this.notebook = this.notebookService.getNotebookByWorkgroup(this.workgroupId);
  }

  setConfig(): void {
    if (this.isStudentNotebook()) {
      this.config = copy(this.notebookService.getStudentNotebookConfig());
    } else {
      this.config = copy(this.notebookService.getTeacherNotebookConfig());
    }
  }

  isStudentNotebook(): boolean {
    return (
      this.configService.getMode() === 'studentRun' ||
      this.configService.getMode() === 'preview' ||
      ((this.configService.isRunOwner() || this.configService.isRunSharedTeacher()) &&
        this.configService.getWorkgroupId() !== this.workgroupId)
    );
  }
}
