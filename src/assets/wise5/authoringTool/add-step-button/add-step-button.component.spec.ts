import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStepButtonComponent } from './add-step-button.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddStepTarget } from '../../../../app/domain/addStepTarget';

describe('AddStepButtonComponent', () => {
  let component: AddStepButtonComponent;
  let fixture: ComponentFixture<AddStepButtonComponent>;
  let loader: HarnessLoader;
  let projectServiceSpy: jasmine.SpyObj<TeacherProjectService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    projectServiceSpy = jasmine.createSpyObj('TeacherProjectService', [
      'isFirstStepInLesson',
      'isBranchPoint',
      'isNodeInAnyBranchPath',
      'getParentGroupId',
      'getNodesByToNodeId',
      'isFirstNodeInBranchPath'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddStepButtonComponent, NoopAnimationsModule],
      providers: [
        { provide: TeacherProjectService, useValue: projectServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(AddStepButtonComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.nodeId = 'node1';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable button when no actions are available', async () => {
    projectServiceSpy.isFirstStepInLesson.and.returnValue(false);
    projectServiceSpy.isBranchPoint.and.returnValue(true);
    projectServiceSpy.isNodeInAnyBranchPath.and.returnValue(true);
    fixture.detectChanges();

    const button = await loader.getHarness(MatButtonHarness);
    expect(await button.isDisabled()).toBeTruthy();
  });

  it('should show all menu items when all actions are available', async () => {
    projectServiceSpy.isFirstStepInLesson.and.returnValue(true);
    projectServiceSpy.isBranchPoint.and.returnValue(false);
    projectServiceSpy.isNodeInAnyBranchPath.and.returnValue(false);
    fixture.detectChanges();

    const button = await loader.getHarness(MatButtonHarness);
    await button.click();

    const menu = await loader.getHarness(MatMenuHarness);
    const items = await menu.getItems();
    expect(items.length).toBe(3);
  });

  it('should navigate to add step before view when first in lesson', async () => {
    projectServiceSpy.isFirstStepInLesson.and.returnValue(true);
    projectServiceSpy.getParentGroupId.and.returnValue('group1');
    fixture.detectChanges();

    const button = await loader.getHarness(MatButtonHarness);
    await button.click();
    const menu = await loader.getHarness(MatMenuHarness);
    const items = await menu.getItems();
    expect(items.length).toBe(3);
    await items[0].click();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['add-node', 'choose-template'], {
      relativeTo: route,
      state: jasmine.any(AddStepTarget)
    });
  });

  it('should navigate to add step after view', async () => {
    projectServiceSpy.isFirstStepInLesson.and.returnValue(false);
    projectServiceSpy.isBranchPoint.and.returnValue(false);
    fixture.detectChanges();

    const button = await loader.getHarness(MatButtonHarness);
    await button.click();
    const menu = await loader.getHarness(MatMenuHarness);
    const items = await menu.getItems();
    expect(items.length).toBe(2);
    await items[0].click();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['add-node', 'choose-template'], {
      relativeTo: route,
      state: jasmine.any(AddStepTarget)
    });
  });

  it('should navigate to create branch view', async () => {
    projectServiceSpy.isFirstStepInLesson.and.returnValue(false);
    projectServiceSpy.isBranchPoint.and.returnValue(false);
    projectServiceSpy.isNodeInAnyBranchPath.and.returnValue(false);
    fixture.detectChanges();

    const button = await loader.getHarness(MatButtonHarness);
    await button.click();
    const menu = await loader.getHarness(MatMenuHarness);
    const items = await menu.getItems();
    expect(items.length).toBe(2);
    await items[1].click();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['create-branch'], {
      relativeTo: route,
      state: { targetId: 'node1' }
    });
  });
});
