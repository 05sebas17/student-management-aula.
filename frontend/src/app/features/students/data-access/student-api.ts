import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateStudentRequest, Student } from '../models/student';

@Injectable({ providedIn: 'root' })
export class StudentApi {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/students';

  list() {
    return this.http.get<Student[]>(this.url);
  }
  getById(id: string) {
    return this.http.get<Student>(`${this.url}/${encodeURIComponent(id)}`);
  }
  create(student: CreateStudentRequest) {
    return this.http.post<Student>(this.url, student);
  }
}
