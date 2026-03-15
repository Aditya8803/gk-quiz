import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private http: HttpClient) {}

  getQuestions(dataFile: string): Observable<Question[]> {
    return this.http.get<Question[]>(`data/${dataFile}`);
  }
}
