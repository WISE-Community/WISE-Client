import { Directive, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { ConfigService } from '../../services/configService';
import { NodeService } from '../../services/nodeService';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Directive()
export abstract class ComponentAuthoring {
  @Input() nodeId: string;
  @Input() componentId: string;
  inputChange: Subject<string> = new Subject<string>();
  promptChange: Subject<string> = new Subject<string>();
  allowedConnectedComponentTypes: string[];
  componentContent: any;
  idToOrder: any;
  subscriptions: Subscription = new Subscription();

  constructor(
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected ProjectAssetService: ProjectAssetService,
    protected ProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.componentContent = this.ProjectService.getComponent(this.nodeId, this.componentId);
    this.idToOrder = this.ProjectService.idToOrder;
    this.subscriptions.add(
      this.ProjectService.componentChanged$.subscribe(() => {
        this.componentChanged();
      })
    );
    this.subscriptions.add(
      this.NodeService.starterStateResponse$.subscribe((args: any) => {
        if (this.isForThisComponent(args)) {
          this.saveStarterState(args.starterState);
        }
      })
    );
    this.subscriptions.add(
      this.NodeService.deleteStarterState$.subscribe((args: any) => {
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
    this.ProjectService.nodeChanged();
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
    this.NodeService.broadcastComponentShowSubmitButtonValueChanged({
      nodeId: this.nodeId,
      componentId: this.componentId,
      showSubmitButton: show
    });
  }

  chooseAsset(target: string): void {
    const params = {
      isPopup: true,
      nodeId: this.nodeId,
      componentId: this.componentId,
      target: target
    };
    this.openAssetChooser(params);
  }

  openAssetChooser(params: any): any {
    return this.ProjectAssetService.openAssetChooser(params).then((data: any) => {
      return this.assetSelected(data);
    });
  }

  assetSelected({ nodeId, componentId, assetItem, target }): void {}

  getComponents(nodeId: string): any[] {
    return this.ProjectService.getComponents(nodeId);
  }

  getComponent(nodeId: string, componentId: string): any {
    return this.ProjectService.getComponent(nodeId, componentId);
  }

  confirmAndRemove(message: string, array: any[], index: number): void {
    if (confirm(message)) {
      array.splice(index, 1);
      this.componentChanged();
    }
  }

  moveObjectUp(objects: any[], index: number): void {
    this.ProjectService.moveObjectUp(objects, index);
    this.componentChanged();
  }

  moveObjectDown(objects: any[], index: number): void {
    this.ProjectService.moveObjectDown(objects, index);
    this.componentChanged();
  }
}
