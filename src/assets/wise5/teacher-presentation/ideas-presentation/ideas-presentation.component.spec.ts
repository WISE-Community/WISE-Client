import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IdeasPresentationComponent } from './ideas-presentation.component';
import { TeacherPresentationSelectionStore } from '../state/teacher-presentation-selection.store';
import { TeacherPresentationConfigService } from '../services/teacher-presentation-config.service';
import { IdeasPresentationResponse } from '../models/teacher-presentation-config';
import { ConfigService } from '../../services/configService';
import { CRaterService } from '../../services/cRaterService';
import { CRaterRubric } from '../../components/common/cRater/CRaterRubric';
import { CRaterIdea } from '../../components/common/cRater/CRaterIdea';
import { branchPathBackgroundColors } from '../../common/color/color';

describe('IdeasPresentationComponent', () => {
  let component: IdeasPresentationComponent;
  let fixture: ComponentFixture<IdeasPresentationComponent>;
  let store: TeacherPresentationSelectionStore;

  const mockRubric = new CRaterRubric({
    ideas: [
      new CRaterIdea('idea_1', true, 'Photosynthesis uses light'),
      new CRaterIdea('idea_2', true, 'Plants absorb carbon dioxide')
    ]
  });

  const message = (
    workgroupId: number,
    responseTimestamp: number | null,
    text: string
  ): IdeasPresentationResponse => ({ studentWorkId: 101, workgroupId, responseTimestamp, text });
  const aliceFirst = message(1, 1000, 'Light is absorbed by chlorophyll');
  const aliceSecond = message(1, 2000, 'Chlorophyll is green');
  const bob = message(2, 3000, 'CO2 enters through the leaves');

  beforeEach(async () => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', [
      'getRunId',
      'getClassmateUserInfos'
    ]);
    configServiceSpy.getRunId.and.returnValue(1);
    configServiceSpy.getClassmateUserInfos.and.returnValue([
      { workgroupId: 1, displayNames: 'Alice' },
      { workgroupId: 2, displayNames: 'Bob' }
    ]);
    const cRaterServiceSpy = jasmine.createSpyObj('CRaterService', ['getCRaterRubric']);
    cRaterServiceSpy.getCRaterRubric.and.returnValue(mockRubric);
    const presentationConfigServiceSpy = jasmine.createSpyObj('TeacherPresentationConfigService', [
      'getConfig',
      'saveConfig'
    ]);
    presentationConfigServiceSpy.getConfig.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [IdeasPresentationComponent],
      providers: [
        TeacherPresentationSelectionStore,
        { provide: TeacherPresentationConfigService, useValue: presentationConfigServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: CRaterService, useValue: cRaterServiceSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(TeacherPresentationSelectionStore);
    store.init(1, 10, 'node1', 'comp1', 'DialogGuidance', 'Ideas');

    fixture = TestBed.createComponent(IdeasPresentationComponent);
    component = fixture.componentInstance;
    component.nodeId = 'node1';
    component.component = { id: 'comp1', type: 'DialogGuidance' };
    component.periodId = 10;
    component.store = store;
  });

  it('should present a selected idea category without responses', () => {
    store.selectedIdeaIds.set(new Set(['idea_1']));
    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('.idea-section');
    expect(sections.length).toBe(1);
    expect(sections[0].textContent).toContain('Photosynthesis uses light');
    expect(sections[0].querySelectorAll('.response-card').length).toBe(0);
  });

  it('should present only the selected messages from the stored snapshots', () => {
    store.selectedIdeaIds.set(new Set(['idea_1']));
    store.selectedIdeaResponseMap.set(new Map([['idea_1', new Map([['1:1000', aliceFirst]])]]));
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.response-card');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Light is absorbed by chlorophyll');
    expect(cards[0].textContent).not.toContain('Chlorophyll is green');
  });

  it('should present several messages by the same student under one idea', () => {
    store.selectedIdeaIds.set(new Set(['idea_1']));
    store.selectedIdeaResponseMap.set(
      new Map([
        [
          'idea_1',
          new Map([
            ['1:1000', aliceFirst],
            ['1:2000', aliceSecond]
          ])
        ]
      ])
    );
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.response-card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Light is absorbed by chlorophyll');
    expect(cards[1].textContent).toContain('Chlorophyll is green');
  });

  it('should present each standalone response as its own separate card without an idea category card', () => {
    store.standaloneResponses.set(
      new Map([
        ['1:1000', aliceFirst],
        ['2:3000', bob]
      ])
    );
    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('.idea-section');
    expect(sections.length).toBe(2);
    expect(sections[0].querySelector('.idea-category-card')).toBeNull();
    expect(sections[1].querySelector('.idea-category-card')).toBeNull();
    const cards = fixture.nativeElement.querySelectorAll('.response-card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Light is absorbed by chlorophyll');
    expect(cards[1].textContent).toContain('CO2 enters through the leaves');
  });

  it('should respect studentNamesDisplayMode', () => {
    store.selectedIdeaIds.set(new Set(['idea_1']));
    store.selectedIdeaResponseMap.set(new Map([['idea_1', new Map([['1:1000', aliceFirst]])]]));

    component.studentNamesDisplayMode = 'hide';
    fixture.detectChanges();
    let card = fixture.nativeElement.querySelector('.response-card');
    expect(card.textContent).not.toContain('Alice');
    expect(card.textContent).not.toContain('Student');
    expect(card.querySelector('mat-icon')).toBeNull();

    component.studentNamesDisplayMode = 'anonymize';
    fixture.detectChanges();
    card = fixture.nativeElement.querySelector('.response-card');
    expect(card.textContent).toContain('Student 1');
    expect(card.textContent).not.toContain('Alice');
    expect(card.querySelector('mat-icon')?.textContent.trim()).toBe('account_circle');

    component.studentNamesDisplayMode = 'show';
    fixture.detectChanges();
    card = fixture.nativeElement.querySelector('.response-card');
    expect(card.textContent).toContain('Alice');
    expect(card.querySelector('mat-icon')?.textContent.trim()).toBe('account_circle');
  });

  it('should render selected responses inside the idea-category-card when category is selected', () => {
    store.selectedIdeaIds.set(new Set(['idea_1']));
    store.selectedIdeaResponseMap.set(new Map([['idea_1', new Map([['1:1000', aliceFirst]])]]));
    fixture.detectChanges();

    const categoryCard = fixture.nativeElement.querySelector('.idea-category-card');
    expect(categoryCard).not.toBeNull();
    const nestedResponseCards = categoryCard.querySelectorAll('.response-card');
    expect(nestedResponseCards.length).toBe(1);
    expect(nestedResponseCards[0].textContent).toContain('Light is absorbed by chlorophyll');
  });

  it('should apply distinct pastel background colors from branchPathBackgroundColors to each card before repeating', () => {
    store.selectedIdeaIds.set(new Set(['idea_1', 'idea_2']));
    store.standaloneResponses.set(
      new Map([
        ['1:1000', aliceFirst],
        ['2:3000', bob]
      ])
    );
    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('.idea-section');
    expect(sections.length).toBe(4);

    const card0Bg = sections[0].querySelector('.idea-category-card').style.backgroundColor;
    const card1Bg = sections[1].querySelector('.idea-category-card').style.backgroundColor;
    const card2Bg = sections[2].querySelector('.response-card').style.backgroundColor;
    const card3Bg = sections[3].querySelector('.response-card').style.backgroundColor;

    expect(card0Bg).toBeTruthy();
    expect(new Set([card0Bg, card1Bg, card2Bg, card3Bg]).size).toBe(4);
    expect(component['getCardBackgroundColor'](0)).toBe(
      component['getCardBackgroundColor'](branchPathBackgroundColors.length)
    );
  });
});
