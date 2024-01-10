import { AbstractConstraintStrategy } from './AbstractConstraintStrategy';

export class AddXNumberOfNotesOnThisStepConstraintStrategy extends AbstractConstraintStrategy {
  evaluate(criteria: any): boolean {
    try {
      const notebookItemsByNodeId = this.getNotebookItemsByNodeId(
        this.notebookService.getNotebookByWorkgroup(),
        criteria.params.nodeId
      );
      return notebookItemsByNodeId.length >= criteria.params.requiredNumberOfNotes;
    } catch (e) {}
    return false;
  }

  private getNotebookItemsByNodeId(notebook: any, nodeId: string): any[] {
    return notebook.allItems.filter((item) => item.nodeId === nodeId);
  }
}
