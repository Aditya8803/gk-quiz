import { Routes } from '@angular/router';
import { QuizPageComponent } from './pages/quiz/quiz-page.component';

export const routes: Routes = [
  { path: '', component: QuizPageComponent },
  { path: '**', redirectTo: '' },
];
