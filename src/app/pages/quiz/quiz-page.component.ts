import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { Question, Subject, SUBJECTS } from '../../models/question.model';
import { QuestionCardComponent } from '../../components/question-card/question-card.component';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [CommonModule, QuestionCardComponent],
  template: `
    <div class="layout">
      <!-- Mobile backdrop -->
      <div
        *ngIf="sidebarOpen"
        class="backdrop"
        (click)="sidebarOpen = false"
      ></div>

      <!-- Sidebar -->
      <aside class="sidebar" [class.sidebar-open]="sidebarOpen">
        <div class="sidebar-logo">
          <div class="logo-badge">GK</div>
          <div class="logo-text">
            <span class="logo-title">GK Quiz</span>
            <span class="logo-sub">Study &amp; Practice</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <p class="nav-label">Subjects</p>
          <ul class="nav-list">
            <li *ngFor="let subject of subjects">
              <button
                class="nav-item"
                [class.nav-item-active]="activeSubject.id === subject.id"
                (click)="selectSubject(subject)"
              >
                <span class="nav-icon">{{ subject.icon }}</span>
                <span class="nav-name">{{ subject.label }}</span>
                <span *ngIf="activeSubject.id === subject.id" class="nav-dot"></span>
              </button>
            </li>
          </ul>
        </nav>

        <div class="sidebar-footer">
          <p>Questions loaded from JSON files</p>
        </div>
      </aside>

      <!-- Main content -->
      <div class="main">
        <!-- Header -->
        <header class="header">
          <button class="hamburger" (click)="sidebarOpen = true" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
          <div class="header-subject">
            <span class="header-icon">{{ activeSubject.icon }}</span>
            <h2 class="header-title">{{ activeSubject.label }}</h2>
          </div>
          <span class="practice-badge">Practice Mode</span>
        </header>

        <!-- Content area -->
        <main class="content">
          <!-- Loading state -->
          <div *ngIf="loading" class="state-container">
            <div class="spinner"></div>
            <p class="state-text">Loading questions…</p>
          </div>

          <!-- Error state -->
          <div *ngIf="!loading && error" class="state-container">
            <p class="error-text">{{ error }}</p>
          </div>

          <!-- Questions list -->
          <div *ngIf="!loading && !error" class="questions-wrapper">
            <div class="questions-header">
              <h1 class="questions-title">{{ activeSubject.label }}</h1>
              <p class="questions-subtitle">
                {{ questions.length }} questions — click
                <strong>Show Answer</strong> to reveal the correct option
              </p>
            </div>

            <div class="questions-list">
              <app-question-card
                *ngFor="let q of questions; let i = index"
                [question]="q"
                [index]="i"
              ></app-question-card>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background: #f1f5f9;
    }

    /* ---- BACKDROP ---- */
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 20;
    }

    /* ---- SIDEBAR ---- */
    .sidebar {
      width: 256px;
      flex-shrink: 0;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      position: fixed;
      inset-y: 0;
      left: 0;
      z-index: 30;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      box-shadow: 2px 0 12px rgba(0,0,0,0.08);
    }

    @media (min-width: 1024px) {
      .sidebar {
        position: static;
        transform: none;
        box-shadow: none;
      }
    }

    .sidebar-open {
      transform: translateX(0);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px;
      border-bottom: 1px solid #f1f5f9;
    }

    .logo-badge {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: #4f46e5;
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .logo-sub {
      font-size: 11px;
      color: #94a3b8;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
    }

    .nav-label {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 0 8px;
      margin-bottom: 8px;
    }

    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: none;
      color: #475569;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
    }

    .nav-item:hover {
      background: #f8fafc;
      color: #1e293b;
    }

    .nav-item-active {
      background: #eef2ff;
      border-color: #c7d2fe;
      color: #4f46e5;
    }

    .nav-icon {
      font-size: 16px;
      line-height: 1;
    }

    .nav-name {
      flex: 1;
    }

    .nav-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4f46e5;
    }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid #f1f5f9;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
    }

    /* ---- MAIN ---- */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    /* ---- HEADER ---- */
    .header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px;
      background: none;
      border: none;
      cursor: pointer;
      border-radius: 6px;
    }

    .hamburger:hover {
      background: #f1f5f9;
    }

    .hamburger span {
      display: block;
      width: 18px;
      height: 2px;
      background: #64748b;
      border-radius: 2px;
    }

    @media (min-width: 1024px) {
      .hamburger {
        display: none;
      }
    }

    .header-subject {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-icon {
      font-size: 18px;
    }

    .header-title {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
    }

    .practice-badge {
      margin-left: auto;
      background: #eef2ff;
      color: #4f46e5;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 999px;
    }

    /* ---- CONTENT ---- */
    .content {
      flex: 1;
      overflow-y: auto;
    }

    /* ---- STATES ---- */
    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      height: 240px;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e2e8f0;
      border-top-color: #4f46e5;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .state-text {
      font-size: 14px;
      color: #94a3b8;
    }

    .error-text {
      color: #ef4444;
      font-size: 14px;
    }

    /* ---- QUESTIONS ---- */
    .questions-wrapper {
      max-width: 760px;
      margin: 0 auto;
      padding: 32px 20px;
    }

    .questions-header {
      margin-bottom: 28px;
    }

    .questions-title {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 6px;
    }

    .questions-subtitle {
      font-size: 13px;
      color: #94a3b8;
    }

    .questions-subtitle strong {
      color: #4f46e5;
    }

    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  `],
})
export class QuizPageComponent implements OnInit {
  subjects = SUBJECTS;
  activeSubject: Subject = SUBJECTS[0];
  questions: Question[] = [];
  loading = false;
  error: string | null = null;
  sidebarOpen = false;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadQuestions(this.activeSubject);
  }

  selectSubject(subject: Subject): void {
    this.activeSubject = subject;
    this.sidebarOpen = false;
    this.loadQuestions(subject);
  }

  private loadQuestions(subject: Subject): void {
    this.loading = true;
    this.error = null;
    this.questions = [];

    this.quizService.getQuestions(subject.dataFile).subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load questions. Please try again.';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
