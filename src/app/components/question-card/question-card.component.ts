import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="question-card">
      <div class="question-header">
        <span class="question-index">{{ index + 1 }}</span>
        <p class="question-text">{{ question.question }}</p>
      </div>

      <div class="options-grid">
        <div
          *ngFor="let option of question.options; let i = index"
          class="option"
          [class.option-correct]="revealed && option === question.answer"
        >
          <span class="option-label" [class.option-label-correct]="revealed && option === question.answer">
            {{ getLabel(i) }}
          </span>
          <span class="option-text">{{ option }}</span>
          <span *ngIf="revealed && option === question.answer" class="checkmark">✓</span>
        </div>
      </div>

      <div class="card-footer">
        <button
          class="show-answer-btn"
          [class.hide-btn]="revealed"
          (click)="toggleAnswer()"
        >
          {{ revealed ? 'Hide Answer' : 'Show Answer' }}
        </button>
        <span *ngIf="revealed" class="answer-label">
          Answer: <strong>{{ question.answer }}</strong>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .question-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .question-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }

    .question-index {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #eef2ff;
      color: #4f46e5;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }

    .question-text {
      font-size: 15px;
      font-weight: 500;
      color: #1e293b;
      line-height: 1.6;
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }

    @media (max-width: 640px) {
      .options-grid {
        grid-template-columns: 1fr;
      }
    }

    .option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      color: #475569;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .option-correct {
      background: #f0fdf4;
      border-color: #4ade80;
      color: #166534;
      font-weight: 600;
    }

    .option-label {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #64748b;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .option-label-correct {
      background: #22c55e;
      color: #ffffff;
    }

    .option-text {
      flex: 1;
    }

    .checkmark {
      margin-left: auto;
      font-size: 14px;
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .show-answer-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      background: #4f46e5;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .show-answer-btn:hover {
      background: #4338ca;
    }

    .hide-btn {
      background: #f1f5f9;
      color: #64748b;
    }

    .hide-btn:hover {
      background: #e2e8f0;
    }

    .btn-icon {
      font-size: 14px;
    }

    .answer-label {
      font-size: 13px;
      color: #166534;
    }

    .answer-label strong {
      color: #15803d;
    }
  `],
})
export class QuestionCardComponent {
  @Input() question!: Question;
  @Input() index!: number;

  revealed = false;
ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  if(typeof(this.question.answer)!='string'){
    this.question.answer = this.question.options[this.question.answer]
  }
}
  toggleAnswer(): void {
    this.revealed = !this.revealed;
  }

  getLabel(i: number): string {
    return String.fromCharCode(65 + i);
  }
}
