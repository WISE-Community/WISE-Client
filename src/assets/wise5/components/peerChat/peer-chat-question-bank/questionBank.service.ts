import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Question } from './Question';

@Injectable()
export class QuestionBankService {
  private questionUsedSource: Subject<Question> = new Subject<Question>();
  public questionUsed$: Observable<Question> = this.questionUsedSource.asObservable();

  questionUsed(question: Question): void {
    this.questionUsedSource.next(question);
  }
}
