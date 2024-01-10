import { Directive } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherNodeService } from '../../services/teacherNodeService';

@Directive()
export abstract class AbstractComponentAuthoring {
  allowedConnectedComponentTypes: string[];
  componentContent: any;
  componentId: string;
  idToOrder: any;
  inputChange: Subject<string> = new Subject<string>();
  nodeId: string;
  promptChange: Subject<string> = new Subject<string>();
  subscriptions: Subscription = new Subscription();

  constructor(
    protected configService: ConfigService,
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.componentId = this.componentContent.id;
    this.idToOrder = this.projectService.idToOrder;
    this.subscriptions.add(
      this.projectService.componentChanged$.subscribe(() => {
        this.componentChanged();
      })
    );
    this.subscriptions.add(
      this.nodeService.starterStateResponse$.subscribe((args: any) => {
        if (this.isForThisComponent(args)) {
          this.saveStarterState(args.starterState);
        }
      })
    );
    this.subscriptions.add(
      this.nodeService.deleteStarterState$.subscribe((args: any) => {
        if (this.isForThisComponent(args)) {
          this.deleteStarterState();
        }
      })
    );
    this.subscriptions.add(
      this.promptChange
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe((prompt: string) => {
          this.componentContent.prompt = prompt;
          this.componentChanged();
        })
    );
    this.subscriptions.add(
      this.inputChange.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.componentChanged();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  promptChanged(prompt: string): void {
    this.promptChange.next(prompt);
  }

  componentChanged(): void {
    this.projectService.nodeChanged();
  }

  isForThisComponent(object: any): boolean {
    return object.nodeId == this.nodeId && object.componentId == this.componentId;
  }

  deleteStarterState(): void {}

  saveStarterState(starterState: any): void {}

  setShowSubmitButtonValue(show: boolean): void {
    if (show == null || show == false) {
      this.componentContent.showSaveButton = false;
      this.componentContent.showSubmitButton = false;
    } else {
      this.componentContent.showSaveButton = true;
      this.componentContent.showSubmitButton = true;
    }
    this.nodeService.broadcastComponentShowSubmitButtonValueChanged({
      nodeId: this.nodeId,
      componentId: this.componentId,
      showSubmitButton: show
    });
  }

  assetSelected({ nodeId, componentId, assetItem, target }): void {}

  getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  getComponent(nodeId: string, componentId: string): any {
    return this.projectService.getComponent(nodeId, componentId);
  }

  confirmAndRemove(message: string, array: any[], index: number): void {
    if (confirm(message)) {
      array.splice(index, 1);
      this.componentChanged();
    }
  }

  moveObjectUp(objects: any[], index: number): void {
    this.projectService.moveObjectUp(objects, index);
    this.componentChanged();
  }

  moveObjectDown(objects: any[], index: number): void {
    this.projectService.moveObjectDown(objects, index);
    this.componentChanged();
  }
}
